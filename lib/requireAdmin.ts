import { notFound } from "next/navigation";
import { getSession } from "./auth";
import { isAdminRole } from "../utils/adminRoles";

/** Renders a 404 for anyone who isn't an admin. Returns the session otherwise. */
export async function requireAdmin() {
  const session = await getSession();

  if (!isAdminRole(session?.user?.role)) {
    notFound();
  }

  return session;
}
