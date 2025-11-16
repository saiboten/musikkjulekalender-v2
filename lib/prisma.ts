import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Only use Neon adapter for serverless/pooled connections (production)
// Use direct connection for local PostgreSQL
const useNeonAdapter = connectionString.includes('neon.tech') || connectionString.includes('pooler');

export const prisma = useNeonAdapter 
  ? new PrismaClient({ 
      adapter: new PrismaNeon({ connectionString }) 
    })
  : new PrismaClient();
