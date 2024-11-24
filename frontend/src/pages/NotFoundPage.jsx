import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 4,
        }}
      >
        <SentimentDissatisfied 
          sx={{ 
            fontSize: '6rem', 
            color: 'primary.main',
            mb: 2 
          }} 
        />
        
        <Typography 
          variant="h1" 
          component="h1"
          sx={{
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 'bold',
            mb: 2
          }}
        >
          404
        </Typography>

        <Typography 
          variant="h4" 
          component="h2"
          sx={{ 
            mb: 2,
            color: 'text.secondary' 
          }}
        >
          Page Not Found
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            maxWidth: 'sm',
            color: 'text.secondary'
          }}
        >
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>

        <Button 
          variant="contained" 
          size="large"
          onClick={handleGoHome}
          sx={{
            py: 1.5,
            px: 4,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem'
          }}
        >
          Go Back Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;