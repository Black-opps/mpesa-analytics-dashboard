// src/pages/Login.tsx - IMPROVED VERSION with better debugging

import React, { useState } from "react";
import { Box, Card, TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Define the login response type
interface LoginResponse {
  access_token: string;
  token_type: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", { email });

      // Use the api.login method which is already defined in api.ts
      const response = await api.login(email, password);

      console.log("Login response:", response);
      console.log("Token stored:", localStorage.getItem("access_token"));

      // Verify token was stored
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token was not stored properly");
      }

      // Small delay to ensure token is saved
      setTimeout(() => {
        // Navigate to dashboard
        navigate("/dashboard");
      }, 100);
    } catch (err: any) {
      console.error("Login error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      // Better error messages
      if (err.message?.includes("Network error")) {
        setError(
          "Cannot connect to server. Please check if the API is running."
        );
      } else if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Quick test function to check token
  const checkToken = () => {
    const token = localStorage.getItem("access_token");
    console.log(
      "Current token:",
      token ? `${token.substring(0, 20)}...` : "No token"
    );
    if (token) {
      alert(`Token exists: ${token.substring(0, 20)}...`);
    } else {
      alert("No token found");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f9fafc",
      }}
    >
      <Card sx={{ p: 4, maxWidth: 400, width: "90%" }}>
        <Typography
          variant="h4"
          fontWeight={700}
          color="primary"
          gutterBottom
          align="center"
        >
          MPesa Analytics
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 3 }}
        >
          Sign in to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate("/register")}
          >
            Don't have an account? Sign up
          </Button>

          {/* Debug button - remove in production */}
          <Button
            fullWidth
            variant="text"
            size="small"
            onClick={checkToken}
            sx={{ mt: 1, fontSize: "0.7rem" }}
          >
            Debug: Check Token
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default Login;
