import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Alert,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { auth } from "../../services/api";

const VerifyEmailPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call your API to verify the email with the token
        await auth.verifyEmail(token);

        setSuccess(true);

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to verify your email");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setLoading(false);
      setError("Invalid verification link");
    }
  }, [token, navigate]);

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
            Email Verification
          </Typography>

          <Box sx={{ textAlign: "center", py: 3 }}>
            {loading ? (
              <>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="body1">
                  Verifying your email address...
                </Typography>
              </>
            ) : success ? (
              <>
                <CheckCircleOutlineIcon
                  color="success"
                  sx={{ fontSize: 60, mb: 2 }}
                />
                <Alert severity="success" sx={{ mb: 3 }}>
                  Your email has been verified successfully!
                </Alert>
                <Typography variant="body2" paragraph>
                  You will be redirected to the login page in a few seconds.
                </Typography>
                <CircularProgress size={20} sx={{ mb: 2 }} />
              </>
            ) : (
              <>
                <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
                <Typography variant="body2" paragraph>
                  There was a problem verifying your email address.
                </Typography>
                <Button
                  component={Link}
                  to="/resend-verification"
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Resend Verification Email
                </Button>
              </>
            )}
          </Box>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Already verified?{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                Go to Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmailPage;
