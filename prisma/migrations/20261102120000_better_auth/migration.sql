-- Move the auth tables from next-auth v4 to Better Auth.
-- Users, their ids and their linked Google/GitHub accounts are kept, so
-- answers and scores stay attached. Existing sessions are removed, which
-- logs everyone out once.

BEGIN;

-- users: email_verified was a nullable timestamp; Better Auth wants a boolean.
-- Everyone signed up through Google or GitHub, which verify email addresses,
-- so users with a linked account count as verified. That keeps logging in
-- with the other provider working, as allowDangerousEmailAccountLinking did.
ALTER TABLE "users" ADD COLUMN "email_verified_bool" BOOLEAN NOT NULL DEFAULT false;
UPDATE "users" u SET "email_verified_bool" = true
  WHERE u."email_verified" IS NOT NULL
     OR EXISTS (SELECT 1 FROM "accounts" a WHERE a."user_id" = u."id");
ALTER TABLE "users" DROP COLUMN "email_verified";
ALTER TABLE "users" RENAME COLUMN "email_verified_bool" TO "email_verified";

-- accounts: keep provider, provider_account_id and the tokens; convert
-- expires_at (unix seconds) to a timestamp; drop next-auth-only columns.
ALTER TABLE "accounts"
  ADD COLUMN "access_token_expires_at" TIMESTAMP(3),
  ADD COLUMN "refresh_token_expires_at" TIMESTAMP(3),
  ADD COLUMN "password" TEXT,
  ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
UPDATE "accounts" SET "access_token_expires_at" = to_timestamp("expires_at")
  WHERE "expires_at" IS NOT NULL;
ALTER TABLE "accounts"
  DROP COLUMN "expires_at",
  DROP COLUMN "oauth_token",
  DROP COLUMN "oauth_token_secret",
  DROP COLUMN "session_state",
  DROP COLUMN "token_type",
  DROP COLUMN "type";
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- sessions: next-auth sessions can't be used by Better Auth.
DELETE FROM "sessions";
ALTER TABLE "sessions"
  ADD COLUMN "ip_address" TEXT,
  ADD COLUMN "user_agent" TEXT,
  ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- verifications replaces next-auth's (unused) email verification tokens.
DROP TABLE "verificationtokens";
CREATE TABLE "verifications" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "verifications_identifier_idx" ON "verifications"("identifier");

COMMIT;
