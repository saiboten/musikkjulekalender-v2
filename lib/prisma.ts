import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create the adapter with the pool configuration
const adapter = new PrismaNeon({ 
  connectionString 
});

export const prisma = new PrismaClient({ adapter });
