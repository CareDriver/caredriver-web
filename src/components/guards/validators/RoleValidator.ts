import { UserRole } from "@/interfaces/UserInterface";

export function checkPermission(
  role: string | undefined,
  validRoles: UserRole[],
): boolean {
  if (role) {
    return validRoles.map((r) => r.toString()).includes(role);
  } else {
    return false;
  }
}
