"use client";

import { useSession } from "./session";
import React from "react";
import { isAdminRole } from "../utils/adminRoles";

export const Admin = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  const isAdmin = isAdminRole(session?.user?.role);

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
};
