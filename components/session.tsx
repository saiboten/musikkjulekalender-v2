"use client";

import React, { createContext, useContext } from "react";
import type { AppSession } from "../lib/auth";

const SessionContext = createContext<AppSession | null>(null);

/** Provides the session the root layout read on the server. */
export function SessionProvider({
  session,
  children,
}: {
  session: AppSession | null;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const data = useContext(SessionContext);
  return {
    data,
    status: data ? ("authenticated" as const) : ("unauthenticated" as const),
  };
}
