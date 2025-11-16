export const ADMIN_ROLES = ["admin", "Stein"];

export function isAdminRole(role: string | undefined): boolean {
  return role ? ADMIN_ROLES.includes(role) : false;
}
