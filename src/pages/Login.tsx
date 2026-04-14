// src/pages/Login.tsx
import React, { useState } from "react";
import { Box, Card, TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

      // Use the api.login method which now points to the gateway
      const response = await api.login(email, password);

      console.log("Login successful:", response);

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      // Better error messages
      if (err.message?.includes("Cannot connect")) {
        setError(
          "Cannot connect to server. Please make sure the API Gateway is running on port 8000."
        );
      } else if (err.message?.includes("401")) {
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
  
  color="primary"
  gutterBottom
  align="center" sx={{ fontWeight: 700 }}
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
        </form>
      </Card>
    </Box>
  );
};

export default Login;
