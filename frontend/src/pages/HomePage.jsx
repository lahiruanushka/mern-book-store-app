import React, { useState, useEffect } from 'react';
import { Grid, TextField, MenuItem, Box, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { books, cart } from '../services/api';
import BookCard from '../components/BookCard';

const HomePage = () => {
  const [booksList, setBooksList] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await books.getAll();
      setBooksList(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    console.error('Operation error:', error);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    // Get error message
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    
    setNotification({
      open: true,
      message: errorMessage,
      severity: 'error'
    });
  };


 const handleAddToCart = async (bookId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({
        open: true,
        message: 'Please log in to add items to cart',
        severity: 'warning'
      });
      navigate('/login');
      return;
    }

    if (!bookId) {
      throw new Error('Invalid book ID');
    }

    await cart.addItem(bookId, 1);
    
    setNotification({
      open: true,
      message: 'Book added to cart successfully!',
      severity: 'success'
    });
  } catch (error) {
    let errorMessage = 'Failed to add book to cart';
    
    if (error.details?.status === 400) {
      errorMessage = error.details?.data?.message || 'Invalid request. Please try again.';
    } else if (error.message === 'Invalid book ID format') {
      errorMessage = 'Invalid book format. Please try again.';
    }

    setNotification({
      open: true,
      message: errorMessage,
      severity: 'error'
    });
  }
};

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const filteredBooks = booksList
    .filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(book => category === 'all' || book.category.includes(category));

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          label="Search books"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="all">All Categories</MenuItem>
          <MenuItem value="fiction">Fiction</MenuItem>
          <MenuItem value="classic">Classic</MenuItem>
        </TextField>
      </Box>
      
      <Grid container spacing={3}>
        {filteredBooks.map((book) => (
          <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
            <BookCard book={book} onAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;