import React, { useState } from "react";
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
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { auth } from "../services/api";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Create Account", "Verify Email"];

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
      const response = await auth.register(data);

      // If registration is successful, show verification message
      setRegistrationComplete(true);
      setUserEmail(data.email);
      setActiveStep(1);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      await auth.resendVerification(userEmail);
      setError(null);
      showSuccessMessage(
        "Verification email sent again. Please check your inbox."
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend verification email"
      );
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message) => {
    // You could implement a success message state here
    // For now, just console.log
    console.log(message);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{ width: "100%", mb: 4 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          {registrationComplete ? (
            <Box sx={{ textAlign: "center" }}>
              <Typography component="h1" variant="h5" gutterBottom>
                Verify Your Email
              </Typography>

              <Alert severity="success" sx={{ mb: 3 }}>
                Registration successful! Please check your email to verify your
                account.
              </Alert>

              <Typography paragraph>
                We've sent a verification link to <strong>{userEmail}</strong>.
                Please check your inbox and click the link to activate your
                account.
              </Typography>

              <Typography paragraph variant="body2" color="text.secondary">
                If you don't see the email in your inbox, please check your spam
                folder.
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleResendVerification}
                  disabled={loading}
                  sx={{ mr: 2 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>

                <Button variant="outlined" component={Link} to="/login">
                  Go to Login
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <Typography
                component="h1"
                variant="h5"
                align="center"
                gutterBottom
              >
                Create Account
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  autoFocus
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
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
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
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
                    "Create Account"
                  )}
                </Button>

                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{" "}
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      Login here
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
