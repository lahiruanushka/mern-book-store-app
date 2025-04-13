import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import { auth } from "../services/api";
import { loginSuccess } from "../features/authSlice";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setNeedsVerification(false);

      const response = await auth.login(data);
      dispatch(loginSuccess(response.data));
      navigate("/dashboard");
    } catch (err) {
      // Check if the error is due to unverified email
      if (
        err.response?.status === 401 &&
        err.response?.data?.verified === false
      ) {
        setNeedsVerification(true);
        setUserEmail(err.response.data.email);
      } else {
        setError(err.response?.data?.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      await auth.resendVerification(userEmail);
      setError(null);
      setLoading(false);
      // Show success message but keep the verification alert
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend verification email"
      );
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {needsVerification ? (
            <Box>
              <Alert severity="warning" sx={{ mb: 3 }}>
                Your email has not been verified. Please check your inbox or
                request a new verification link.
              </Alert>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleResendVerification}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Resend Verification Email"
                )}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                component={Link}
                to="/login"
                sx={{ mt: 1 }}
              >
                Try Another Account
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </Box>
          )}

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link to="/register" style={{ textDecoration: "none" }}>
                Register here
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                Forgot password?
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
