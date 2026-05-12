import React, { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await login({
        email,
        password,
      });

      navigate("/dashboard");
    } catch (error) {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0A0F1D",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "400px",
          background: "#11162A",
          padding: "32px",
          borderRadius: "20px",
          border: "1px solid #1E293B",
        }}
      >
        <h1
          style={{
            color: "white",
            marginBottom: "24px",
          }}
        >
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            height: "52px",
            marginBottom: "16px",
            borderRadius: "12px",
            border: "1px solid #334155",
            padding: "0 16px",
            background: "#0F172A",
            color: "white",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            height: "52px",
            marginBottom: "24px",
            borderRadius: "12px",
            border: "1px solid #334155",
            padding: "0 16px",
            background: "#0F172A",
            color: "white",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            height: "52px",
            borderRadius: "12px",
            border: "none",
            background: "#3CE6AE",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <div
          style={{
            marginTop: "16px",
            color: "#94A3B8",
          }}
        >
          No account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
};
