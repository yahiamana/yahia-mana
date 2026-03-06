"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

/**
 * Admin Login Page — Handles authentication with 2FA support.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          ...(requires2FA ? { totpCode } : {}),
        }),
      });

      const data = await res.json();

      if (data.requires2FA) {
        setRequires2FA(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Store CSRF token for subsequent requests
      if (data.data?.csrfToken) {
        sessionStorage.setItem("csrf_token", data.data.csrfToken);
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg)",
        padding: "var(--container-padding)",
      }}
    >
      <div
        className="glass"
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            textAlign: "center",
          }}
        >
          Admin <span className="gradient-text">Login</span>
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "0.8125rem",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Sign in to manage your portfolio
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <div>
            <label
              htmlFor="login-email"
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--color-text-secondary)",
                marginBottom: "0.375rem",
              }}
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "var(--color-bg)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                color: "var(--color-text-primary)",
                fontSize: "0.9375rem",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--color-text-secondary)",
                marginBottom: "0.375rem",
              }}
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "var(--color-bg)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                color: "var(--color-text-primary)",
                fontSize: "0.9375rem",
                outline: "none",
              }}
            />
          </div>

          {requires2FA && (
            <div>
              <label
                htmlFor="login-totp"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  marginBottom: "0.375rem",
                }}
              >
                2FA Code
              </label>
              <input
                id="login-totp"
                type="text"
                maxLength={6}
                required
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit code"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "var(--color-bg)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "8px",
                  color: "var(--color-text-primary)",
                  fontSize: "1.25rem",
                  letterSpacing: "0.3em",
                  textAlign: "center",
                  outline: "none",
                }}
              />
            </div>
          )}

          {error && (
            <p style={{ color: "var(--color-accent-warm)", fontSize: "0.8125rem" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
