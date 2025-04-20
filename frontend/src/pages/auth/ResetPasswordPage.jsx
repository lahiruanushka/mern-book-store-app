import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
import { auth } from "../../services/api";

const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const validateToken = async () => {
      try {
        setValidatingToken(true);
        const response = await auth.validateResetToken(token);
        setTokenValid(response.data.valid);
      } catch (err) {
        setError(
          err.response?.data?.message || "Invalid or expired reset link"
        );
        setTokenValid(false);
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      await auth.resetPassword(token, data.password);
      setResetSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
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
          <Paper
            elevation={3}
            sx={{ p: 4, width: "100%", textAlign: "center" }}
          >
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Validating your reset link...
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

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
            Reset Your Password
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!tokenValid && !error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              This password reset link is invalid or has expired.
            </Alert>
          )}

          {resetSuccess ? (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                Your password has been reset successfully!
              </Alert>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => navigate("/login")}
                sx={{ mb: 2 }}
              >
                Login with New Password
              </Button>
            </Box>
          ) : (
            <>
              {tokenValid && (
                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="New Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
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
                      "Reset Password"
                    )}
                  </Button>
                </Box>
              )}

              {!tokenValid && (
                <Button
                  fullWidth
                  variant="contained"
                  component={Link}
                  to="/forgot-password"
                  sx={{ mt: 2 }}
                >
                  Request New Reset Link
                </Button>
              )}
            </>
          )}

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <Link to="/login" style={{ textDecoration: "none" }}>
                Back to Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;
