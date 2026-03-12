// src/components/Auth/AdminRoute.tsx

import React from "react";
import { Navigate } from "react-router-dom";
import api from "../../services/api";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const isAdmin = api.isAdmin();

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
