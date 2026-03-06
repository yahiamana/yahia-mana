import { NextResponse } from "next/server";

/**
 * In-memory token-bucket rate limiter.
 *
 * ⚠️ This works for single-instance deployments (e.g., one Vercel serverless
 * function instance). For production at scale, replace with Redis-backed
 * rate limiting (e.g., @upstash/ratelimit).
 *
 * Each key (IP or identifier) gets a bucket that refills at a steady rate.
 */

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

interface RateLimiterConfig {
  /** Max tokens in the bucket */
  maxTokens: number;
  /** How many tokens to refill per second */
  refillRate: number;
  /** Identifier for this limiter (for logging) */
  name: string;
}

class RateLimiter {
  private buckets = new Map<string, TokenBucket>();
  private config: RateLimiterConfig;

  constructor(config: RateLimiterConfig) {
    this.config = config;

    // Clean up stale buckets periodically (every 5 minutes)
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }
  }

  /**
   * Check if a request is allowed.
   * Returns true if allowed, false if rate limited.
   */
  check(key: string): boolean {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = { tokens: this.config.maxTokens, lastRefill: now };
      this.buckets.set(key, bucket);
    }

    // Refill tokens based on elapsed time
    const elapsed = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(
      this.config.maxTokens,
      bucket.tokens + elapsed * this.config.refillRate
    );
    bucket.lastRefill = now;

    if (bucket.tokens < 1) {
      return false; // Rate limited
    }

    bucket.tokens -= 1;
    return true;
  }

  /** Clean up buckets that haven't been used in 10 minutes */
  private cleanup() {
    const cutoff = Date.now() - 10 * 60 * 1000;
    for (const [key, bucket] of this.buckets) {
      if (bucket.lastRefill < cutoff) {
        this.buckets.delete(key);
      }
    }
  }
}

// ─── Pre-configured Rate Limiters ───

/** Auth endpoints: 5 requests per 15 seconds to prevent brute-force */
export const authRateLimiter = new RateLimiter({
  name: "auth",
  maxTokens: 5,
  refillRate: 5 / 15, // 5 tokens every 15 seconds
});

/** Upload endpoints: 10 requests per minute */
export const uploadRateLimiter = new RateLimiter({
  name: "upload",
  maxTokens: 10,
  refillRate: 10 / 60,
});

/** General API: 60 requests per minute */
export const apiRateLimiter = new RateLimiter({
  name: "api",
  maxTokens: 60,
  refillRate: 1, // 1 token per second
});

/**
 * Extract a rate limit key from a request (IP address).
 * Falls back to a generic key if IP can't be determined.
 */
export function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() || realIp || "unknown";
}

/**
 * Apply rate limiting to a request.
 * Returns a 429 response if rate limited, or null if allowed.
 */
export function checkRateLimit(
  limiter: RateLimiter,
  request: Request
): NextResponse | null {
  const key = getRateLimitKey(request);
  if (!limiter.check(key)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": "15" },
      }
    );
  }
  return null;
}
