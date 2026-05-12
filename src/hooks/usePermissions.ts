// src/hooks/usePermissions.ts

export type UserRole = "owner" | "admin" | "analyst" | "viewer";

export const usePermissions = () => {
  const storedRole = localStorage.getItem("role");

  const role: UserRole = (storedRole as UserRole) || "owner";

  const hasRole = (roles: string[]) => {
    return roles.includes(role);
  };

  return {
    role,
    hasRole,
  };
};

export default usePermissions;
