import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  IconButton
} from '@mui/material';
import {
  LockOutlined,
  Home,
  ArrowBack
} from '@mui/icons-material';

const UnauthorizePage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100'
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2
          }}
        >
          {/* Icon Circle */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'error.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 3
            }}
          >
            <LockOutlined
              sx={{
                fontSize: 40,
                color: 'error.main'
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'text.primary'
            }}
          >
            Access Denied
          </Typography>

          {/* Message */}
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ mb: 3 }}
          >
            Sorry, you don't have permission to access this page. Please contact your administrator if you think this is a mistake.
          </Typography>

          {/* Error Code */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 4 }}
          >
            Error code: 401 Unauthorized
          </Typography>

          {/* Buttons */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => window.history.back()}
              sx={{
                borderRadius: 2,
                px: 3
              }}
            >
              Go Back
            </Button>
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={() => window.location.href = '/'}
              sx={{
                borderRadius: 2,
                px: 3
              }}
            >
              Home
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default UnauthorizePage;