// src/features/auth/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Test123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // src/features/auth/pages/Login.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      console.log("✅ Login successful, redirecting to dashboard...");
      // Force a small delay to ensure state updates
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 100);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>MPesa Analytics</h2>
        {error && <div style={styles.error}>{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          disabled={loading}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          disabled={loading}
          required
        />
        <button
          type="submit"
          style={loading ? styles.buttonDisabled : styles.button}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div style={styles.links}>
          <Link to="/register">Create Account</Link>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#020617",
  },
  form: {
    background: "#1e293b",
    padding: "40px",
    borderRadius: "12px",
    width: "400px",
  },
  title: {
    color: "white",
    marginBottom: "24px",
    textAlign: "center" as const,
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "16px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  buttonDisabled: {
    width: "100%",
    padding: "12px",
    background: "#64748b",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "not-allowed",
  },
  error: {
    background: "#dc2626",
    color: "white",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  links: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    color: "#93c5fd",
  },
};
