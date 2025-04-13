import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { auth } from '../services/api';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required')
});

const ResendVerificationPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await auth.resendVerification(data.email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Resend Verification Email
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          {success ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Verification email has been sent! Please check your inbox.
              </Alert>
              <Typography variant="body2" paragraph>
                Please check your email and follow the link to verify your account.
                If you don't see the email, check your spam folder.
              </Typography>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Go to Login
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Typography variant="body2" paragraph>
                Enter your email address below and we'll send you another verification link.
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
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
                  'Resend Verification Email'
                )}
              </Button>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Remember your password?{' '}
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    Back to Login
                  </Link>
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ResendVerificationPage;