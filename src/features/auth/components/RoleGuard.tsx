import React from "react";

import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

interface Props {
  allowedRoles: string[];
}

export const RoleGuard: React.FC<Props> = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
