// src/features/auth/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading, token } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
    console.log("ProtectedRoute - token exists:", !!token);
    console.log("ProtectedRoute - loading:", loading);
  }, [isAuthenticated, token, loading]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          background: "#020617",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("Authenticated, rendering dashboard");
  return <Outlet />;
};
