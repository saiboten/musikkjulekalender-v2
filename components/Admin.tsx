import { useSession } from "next-auth/react";
import React from "react";
import { isAdminRole } from "../utils/adminRoles";

export const Admin = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  const isAdmin = isAdminRole(session?.user?.role);

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
};
