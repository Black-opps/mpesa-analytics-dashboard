// src/App.tsx
import React from "react";
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./features/auth/store/authStore";

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
