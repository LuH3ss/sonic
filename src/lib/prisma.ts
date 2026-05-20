import { PrismaClient } from "@/generated/prisma/client";

// Prisma v7 new-style generator requires the connection URL at instantiation time.
// DATABASE_URL must be set in .env (Neon Postgres connection string).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL!,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
