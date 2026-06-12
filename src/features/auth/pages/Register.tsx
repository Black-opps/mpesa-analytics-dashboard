// src/features/auth/pages/Register.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Register: React.FC = () => {
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // ✅ FIX: Pass 3 separate arguments, not an object
      await register(email, password, full_name);
      console.log("✅ Registration successful, redirecting...");
      navigate("/login", { replace: true });
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.detail || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <div style={styles.error}>{error}</div>}

        <input
          type="text"
          placeholder="Full Name"
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
          style={styles.input}
          disabled={loading}
          required
        />

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
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          disabled={loading}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
          disabled={loading}
          required
        />

        <button
          type="submit"
          style={loading ? styles.buttonDisabled : styles.button}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <div style={styles.loginLink}>
          Already have an account? <Link to="/login">Login</Link>
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
    background: "#10b981",
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
  loginLink: {
    marginTop: "20px",
    textAlign: "center" as const,
    color: "#94a3b8",
  },
};
