import { cache } from "react";
import { headers } from "next/headers";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";

export const socialProviders = [
  { id: "google", name: "Google" },
  { id: "github", name: "GitHub" },
] as const;

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXTAUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET ?? process.env.SECRET,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    },
  },
  account: {
    // Logging in with Google and later GitHub (same email) ends up on the same user.
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
  user: {
    additionalFields: {
      // Set by admins in the database, never by users.
      role: { type: "string", required: false, input: false },
      nickname: { type: "string", required: false, input: false },
    },
  },
  advanced: {
    // Users, sessions and accounts keep their numeric, database-generated ids.
    database: { generateId: "serial" },
  },
  onAPIError: {
    // Errors are shown on our own sign-in page as ?error=<code>.
    errorURL: "/auth/signin",
  },
  plugins: [nextCookies()],
});

export type AppSession = {
  id: number;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
};

/**
 * The current session in server components and route handlers, or null when
 * logged out. Cached per request, so the layout and page share one lookup.
 */
export const getSession = cache(async (): Promise<AppSession | null> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return null;
  }

  const { user } = session;

  return {
    id: Number(user.id),
    user: {
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    },
  };
});
