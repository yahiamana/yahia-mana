# Contributing

## Development Setup

```bash
npm install
cp .env.example .env
# Fill in .env values
npx prisma generate
npm run dev
```

## Code Style

- TypeScript strict mode
- ESLint + Prettier
- Conventional commit messages

## Making Changes

1. Create a feature branch from `main`
2. Write code with proper TypeScript types
3. Add tests for new functionality
4. Ensure `npm run lint && npm run typecheck && npm run test` pass
5. Open a pull request

## GSAP Animation Guidelines

- Always use `gsap.context()` to scope animations
- Clean up ScrollTrigger instances in `useEffect` return
- Respect `prefers-reduced-motion`

## Security

- Never commit secrets or `.env` files
- Validate all user input with Zod
- Use RBAC middleware on all admin endpoints
- Log admin actions to audit trail
