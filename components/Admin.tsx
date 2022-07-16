import { useSession } from "next-auth/react";
import React from "react";

export const Admin = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  const isAdmin = session?.user?.role === "admin";

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
};
