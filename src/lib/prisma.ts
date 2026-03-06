import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton.
 * In development, Next.js hot-reloads clear the module cache,
 * which would create a new PrismaClient on every reload and
 * exhaust database connections. We store the client on `globalThis`
 * to reuse across hot reloads.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
