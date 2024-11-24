import React, { useState, useEffect } from 'react';
import { Grid, TextField, MenuItem, Box } from '@mui/material';
import { books, cart } from '../services/api';
import BookCard from '../components/BookCard';

const HomePage = () => {
  const [booksList, setBooksList] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await books.getAll();
        setBooksList(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  const handleAddToCart = async (bookId) => {
    try {
      await cart.addItem(bookId, 1);
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  const filteredBooks = booksList
    .filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(book => category === 'all' || book.category.includes(category));

  return (
    <Box sx={{ mt: 4}}>
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
    </Box>
  );
};

export default HomePage;