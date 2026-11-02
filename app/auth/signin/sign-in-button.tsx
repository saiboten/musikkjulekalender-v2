"use client";

import { authClient } from "../../../lib/auth-client";
import { Button } from "../../../components/ui";

export function SignInButton({ id, name }: { id: string; name: string }) {
  return (
    <Button
      onClick={() =>
        authClient.signIn.social({
          provider: id,
          callbackURL: "/",
          errorCallbackURL: "/auth/signin",
        })
      }
    >
      Logg inn med {name}
    </Button>
  );
}
