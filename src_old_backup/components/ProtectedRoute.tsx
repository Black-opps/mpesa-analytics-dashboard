import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";

export default function ProtectedRoute({ children }: any) {
  if (!getToken()) {
    return <Navigate to="/login" />;
  }

  return children;
}
