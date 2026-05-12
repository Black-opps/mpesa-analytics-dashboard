// src/App.tsx

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/store/authStore";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      {" "}
      {/* ✅ Router MUST be the outermost wrapper */}
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
