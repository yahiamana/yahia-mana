# Developer Portfolio

Full-stack portfolio built with Next.js 16, Three.js, GSAP, Lenis, Framer Motion, Prisma, PostgreSQL (Neon), and Cloudinary.

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url>
cd prtf
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your Neon DB URL, Cloudinary credentials, JWT secret, etc.

# 3. Generate Prisma client & run migrations
npx prisma generate
npx prisma migrate dev

# 4. Seed the database
SEED_ADMIN_PASSWORD=your-strong-password-here npm run seed

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — portfolio
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) — admin panel

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run seed` | Seed database with admin + sample data |
| `npm run prisma:migrate` | Run Prisma migrations |
| `npm run prisma:generate` | Generate Prisma client |

## Architecture

```
src/
  app/          # Next.js App Router pages & API routes
  components/   # React components (HeroCanvas, Header, etc.)
  lib/          # Server utilities (auth, prisma, cloudinary)
  types/        # Shared TypeScript types
  styles/       # Global CSS
prisma/         # Schema & migrations
scripts/        # Seed script
tests/          # Unit, integration, E2E tests
```

## Environment Variables

See [`.env.example`](.env.example) for all required variables:
- `DATABASE_URL` — Neon PostgreSQL connection string
- `JWT_SECRET` — 64-char hex for JWT signing
- `CLOUDINARY_*` — Cloudinary credentials
- `SMTP_*` — Email service for contact notifications
- `SENTRY_DSN` — Error monitoring

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **3D**: Three.js (procedural geometry, no external assets)
- **Animation**: GSAP + ScrollTrigger, Lenis smooth scroll, Framer Motion
- **Database**: PostgreSQL on Neon, Prisma ORM
- **Media**: Cloudinary (signed uploads, responsive transforms)
- **Auth**: bcrypt hashing, JWT (jose), refresh token rotation, optional TOTP 2FA
- **Validation**: Zod
- **Testing**: Vitest, Playwright
- **Deployment**: Vercel

## Security

See [SECURITY.md](SECURITY.md) for the full security checklist.

Key security features:
- HttpOnly, Secure, SameSite=Strict cookies
- Refresh token rotation with DB-backed sessions
- Account lockout after 5 failed attempts
- CSRF double-submit cookie pattern
- Rate limiting on auth and upload endpoints
- CSP, HSTS, X-Frame-Options headers
- RBAC with ADMIN/EDITOR roles
- Audit logging for all admin actions

## Deployment

1. Create a **Neon** database → copy `DATABASE_URL`
2. Create **Cloudinary** account → copy cloud name, API key, secret
3. Deploy to **Vercel** → set all env vars from `.env.example`
4. Run `npx prisma migrate deploy` on Vercel
5. Seed the database with your admin password
6. Enable 2FA on your admin account for production

## License

Private — All rights reserved.
