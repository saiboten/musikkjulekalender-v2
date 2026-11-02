import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Prisma 7 requires a driver adapter for every connection.
  // Use the Neon serverless adapter for Neon (production), plain pg for local PostgreSQL.
  const useNeonAdapter = new URL(connectionString).hostname.endsWith(
    ".neon.tech"
  );

  const adapter = useNeonAdapter
    ? new PrismaNeon({
        connectionString,
        // Neon scales to zero when idle; waking it up can take a few seconds.
        connectionTimeoutMillis: 15_000,
      })
    : new PrismaPg({
        connectionString,
        // pg has no timeout by default; Prisma 6 used 5 seconds.
        connectionTimeoutMillis: 5_000,
      });

  return new PrismaClient({ adapter });
}

// Reuse one client across hot reloads in development, so each reload
// doesn't open a new connection pool.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
