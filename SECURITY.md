# Security Checklist

## Authentication & Session Management

- [x] Passwords hashed with bcrypt (cost factor 12)
- [x] Short-lived JWTs (15 min) for access tokens
- [x] Opaque refresh tokens stored as hashes in database
- [x] Refresh token rotation — old tokens invalidated on use
- [x] HttpOnly, Secure, SameSite=Strict cookies
- [x] Account lockout after 5 failed login attempts (15 min)
- [x] Optional TOTP 2FA via authenticator app
- [x] Password reset via signed JWT (1-hour expiry)
- [x] All sessions invalidated on password reset

## Authorization

- [x] RBAC with ADMIN and EDITOR roles
- [x] Role hierarchy: ADMIN inherits EDITOR permissions
- [x] Server-side role checking on all admin endpoints
- [x] Admin layout redirects unauthenticated users

## Input Validation & Sanitization

- [x] All API inputs validated with Zod schemas
- [x] Strong password requirements (12+ chars, uppercase, lowercase, number, special char)
- [x] Slug format validation (lowercase, hyphens only)
- [x] File type and size validation for uploads
- [x] Prisma prepared statements (SQL injection prevention)

## CSRF Protection

- [x] Double-submit cookie pattern
- [x] Constant-time token comparison (timing attack prevention)
- [x] CSRF validation on all mutating endpoints (POST, PUT, DELETE)

## Rate Limiting

- [x] Auth endpoints: 5 requests / 15 seconds
- [x] Upload endpoints: 10 requests / minute
- [x] General API: 60 requests / minute
- [ ] **Production**: Upgrade to Redis-backed rate limiting (e.g., @upstash/ratelimit)

## HTTP Security Headers

- [x] Content-Security-Policy (strict)
- [x] Strict-Transport-Security (2-year max-age, preload)
- [x] X-Frame-Options: DENY
- [x] X-Content-Type-Options: nosniff
- [x] Referrer-Policy: strict-origin-when-cross-origin
- [x] Permissions-Policy (camera, microphone, geolocation disabled)
- [x] X-XSS-Protection: 1; mode=block

## Cloudinary Security

- [x] Server-side signed uploads (API secret never exposed)
- [x] File type whitelist (JPEG, PNG, WebP, GIF, AVIF, MP4, WebM)
- [x] File size limits (10 MB images, 100 MB videos)
- [ ] Configure Cloudinary upload preset with additional restrictions

## Audit & Monitoring

- [x] Audit log for all admin actions
- [x] Failed login attempts logged with IP
- [x] Session tracking (user agent, IP address)
- [ ] Sentry integration for error monitoring
- [ ] Alerts for suspicious activity (multiple failed logins from same IP)

## Post-Deploy Verification

1. **HTTPS enforcement**: Verify all traffic redirects to HTTPS
2. **Cookie flags**: Check cookies in DevTools → Application → Cookies
   - `access_token`: HttpOnly ✓, Secure ✓, SameSite=Strict ✓
   - `refresh_token`: HttpOnly ✓, Secure ✓, SameSite=Strict ✓
3. **Security headers**: Check `curl -I https://yourdomain.com`
4. **Admin login**: Verify login works, 2FA can be enabled
5. **Token rotation**: Verify refresh tokens rotate on each refresh
6. **Rate limiting**: Attempt >5 rapid login requests → expect 429
7. **Account lockout**: 5 failed logins → account locked 15 min
8. **RBAC**: EDITOR cannot delete projects or manage users

## Secrets Management

- [ ] All secrets in platform env variables (never in code)
- [ ] JWT_SECRET is 64+ characters of random hex
- [ ] CSRF_SECRET is 32+ characters of random hex
- [ ] Database uses SSL (`?sslmode=require`)
- [ ] Rotate JWT_SECRET periodically (invalidates all sessions)

## Backup & Recovery

1. **Neon snapshots**: Enable automatic daily snapshots in Neon dashboard
2. **Manual backup**: `pg_dump` via Neon CLI
3. **Recovery**: Restore from Neon snapshot or `pg_restore`
4. **Key rotation**: Change JWT_SECRET → all users must re-login
