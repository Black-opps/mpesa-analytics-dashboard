// src/pages/Register.tsx - UPDATED WITH BETTER TYPING

import React, { useState } from "react";
import { Box, Card, TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface RegisterResponse {
  id: number;
  email: string;
  created_at: string;
}

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post<RegisterResponse>("/auth/register", { email, password });
      navigate("/login", {
        state: { message: "Registration successful! Please login." },
      });
    } catch (err: any) {
      setError(
        err.response?.data?.detail || err.message || "Registration failed"
      );
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
          Create a new account
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
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
          <Button fullWidth variant="text" onClick={() => navigate("/login")}>
            Already have an account? Sign in
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default Register;
