// src/router/AppRouter.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import { Insights } from "../pages/Insights";
import { People } from "../pages/People";
import { Transactions } from "../pages/Transactions";
import { Reports } from "../pages/Reports";
import { Users } from "../pages/Users";
import { Login } from "../features/auth/pages/Login";
import { Register } from "../features/auth/pages/Register";
import { ForgotPassword } from "../features/auth/pages/ForgotPassword";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";
import { RoleGuard } from "../features/auth/components/RoleGuard";
import Upload from "../pages/Upload";
import { useAuth } from "../features/auth/hooks/useAuth";

// Create a component to handle root redirection
const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Landing />;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RootRedirect />} /> {/* ← Smart redirect */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Protected Routes (require authentication) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/people" element={<People />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/reports" element={<Reports />} />

          {/* Admin Only Routes */}
          <Route element={<RoleGuard allowedRoles={["owner", "admin"]} />}>
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
