import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import type { JWTPayload } from "@/types";

// ─── Configuration ───

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-dev-secret-change-me");
const ACCESS_TOKEN_EXPIRY = "15m"; // Short-lived access token
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const BCRYPT_ROUNDS = 12; // High cost factor for password hashing
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// ─── Password Hashing ───

/**
 * Hash a password using bcrypt with a high cost factor.
 * bcrypt is chosen over argon2 for cross-platform compatibility
 * (argon2 requires native compilation which can fail on some platforms).
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/** Verify a password against a bcrypt hash */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── JWT Tokens ───

/** Create a short-lived access JWT */
export async function createAccessToken(payload: {
  sub: string;
  email: string;
  role: "ADMIN" | "EDITOR";
}): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/** Verify and decode an access JWT */
export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// ─── Refresh Tokens ───

/**
 * Generate a cryptographically random refresh token.
 * The token is opaque — its hash is stored in the DB.
 */
export function generateRefreshToken(): string {
  const bytes = new Uint8Array(48);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Hash a refresh token for safe DB storage */
export async function hashRefreshToken(token: string): Promise<string> {
  // Use bcrypt with fewer rounds since this isn't a password
  return bcrypt.hash(token, 6);
}

/** Compare a raw refresh token against its hash */
export async function verifyRefreshToken(token: string, hash: string): Promise<boolean> {
  return bcrypt.compare(token, hash);
}

// ─── Cookie Management ───

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

/** Set the access token cookie (short-lived) */
export async function setAccessTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("access_token", token, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60, // 15 minutes in seconds
  });
}

/** Set the refresh token cookie (long-lived) */
export async function setRefreshTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("refresh_token", token, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

/** Clear all auth cookies */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

/** Get the current access token from cookies */
export async function getAccessTokenFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
}

/** Get the current refresh token from cookies */
export async function getRefreshTokenFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value;
}

// ─── Session Management ───

/**
 * Create a new session with a rotated refresh token.
 * Stores the hashed refresh token in the database.
 */
export async function createSession(
  adminId: string,
  userAgent?: string,
  ipAddress?: string
): Promise<{ accessToken: string; refreshToken: string }> {
  // Look up user for token payload
  const admin = await prisma.adminUser.findUnique({ where: { id: adminId } });
  if (!admin) throw new Error("Admin not found");

  // Generate tokens
  const rawRefreshToken = generateRefreshToken();
  const hashedRefresh = await hashRefreshToken(rawRefreshToken);
  const accessToken = await createAccessToken({
    sub: admin.id,
    email: admin.email,
    role: admin.role,
  });

  // Store session in DB
  await prisma.session.create({
    data: {
      adminId,
      refreshToken: hashedRefresh,
      userAgent: userAgent ?? null,
      ipAddress: ipAddress ?? null,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    },
  });

  return { accessToken, refreshToken: rawRefreshToken };
}

/**
 * Rotate a refresh token — invalidate the old one and create a new one.
 * This implements refresh token rotation to detect token theft.
 */
export async function rotateRefreshToken(
  oldRefreshToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  // Find all non-expired sessions
  const sessions = await prisma.session.findMany({
    where: { expiresAt: { gt: new Date() } },
    include: { admin: true },
  });

  // Check each session for a matching refresh token
  for (const session of sessions) {
    const isMatch = await verifyRefreshToken(oldRefreshToken, session.refreshToken);
    if (isMatch && session.admin.isActive) {
      // Delete the old session (rotation)
      await prisma.session.delete({ where: { id: session.id } });

      // Create a new session with fresh tokens
      return createSession(session.adminId, session.userAgent ?? undefined, session.ipAddress ?? undefined);
    }
  }

  return null; // No matching session found — token may have been stolen
}

// ─── Account Lockout ───

/**
 * Record a failed login attempt. Locks the account after MAX_FAILED_LOGINS.
 */
export async function recordFailedLogin(email: string): Promise<void> {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return; // Don't reveal whether the user exists

  const newCount = user.failedLogins + 1;
  const updates: { failedLogins: number; lockedUntil?: Date } = {
    failedLogins: newCount,
  };

  if (newCount >= MAX_FAILED_LOGINS) {
    updates.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: updates,
  });
}

/** Reset failed login counter after successful login */
export async function resetFailedLogins(userId: string): Promise<void> {
  await prisma.adminUser.update({
    where: { id: userId },
    data: { failedLogins: 0, lockedUntil: null },
  });
}

/** Check if an account is currently locked */
export function isAccountLocked(lockedUntil: Date | null): boolean {
  if (!lockedUntil) return false;
  return new Date() < lockedUntil;
}

// ─── Auth Verification ───

/**
 * Get the currently authenticated admin user from cookies.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAccessTokenFromCookie();
  if (!token) return null;
  return verifyAccessToken(token);
}
