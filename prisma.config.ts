import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // The CLI (migrations, db push) needs a direct connection; on Neon that's
    // the URL without "-pooler". The app itself uses the pooled DATABASE_URL.
    // Falls back to DATABASE_URL, which is fine for local PostgreSQL.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL,
  },
});
