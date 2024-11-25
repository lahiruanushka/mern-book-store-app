import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Box,
  Snackbar,
  Alert,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Chip,
  Skeleton,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Pagination,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Slider,
  Divider
} from '@mui/material';
import {
  Search,
  FilterList,
  Sort,
  Clear,
  BookmarkBorder,
  LocalLibrary,
  MenuBook,
  Close
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { books, cart } from '../services/api';
import BookCard from '../components/BookCard';

const BOOKS_PER_PAGE = 12;

const HomePage = () => {
  const [booksList, setBooksList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState('title');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const categories = [
    'Fiction',
    'Classic',
    'Mystery',
    'Science Fiction',
    'Romance',
    'Biography',
    'History',
    'Self-Help'
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await books.getAll();
      setBooksList(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }
    
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

      if (!bookId) throw new Error('Invalid book ID');

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

  const handleAddToWishlist = async (bookId) => {
    console.log(bookId)
  }

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange([0, 200]);
    setSortBy('title');
  };


const filterAndSortBooks = () => {
    let filtered = [...booksList];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(book => 
        book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter with proper type checking
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(book => {
        // Handle cases where category might be an array, string, or undefined
        const bookCategories = Array.isArray(book.category) 
          ? book.category 
          : typeof book.category === 'string'
          ? [book.category]
          : [];

        return selectedCategories.some(selectedCategory => 
          bookCategories.some(bookCategory =>
            bookCategory?.toLowerCase().includes(selectedCategory.toLowerCase())
          )
        );
      });
    }

    // Apply price filter with type checking
    filtered = filtered.filter(book => {
      const price = parseFloat(book.price) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply sorting with null checks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
        case 'price-desc':
          return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredBooks = filterAndSortBooks();
  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
  const displayedBooks = filteredBooks.slice(
    (page - 1) * BOOKS_PER_PAGE,
    page * BOOKS_PER_PAGE
  );

  const FilterDrawer = () => (
    <Drawer
      anchor="right"
      open={filterDrawerOpen}
      onClose={() => setFilterDrawerOpen(false)}
    >
      <Box sx={{ width: 280, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 2 }}>Categories</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => handleCategoryToggle(cat)}
              color={selectedCategories.includes(cat) ? "primary" : "default"}
              variant={selectedCategories.includes(cat) ? "filled" : "outlined"}
            />
          ))}
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 2 }}>Price Range</Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => setPriceRange(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={200}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography color="text.secondary">${priceRange[0]}</Typography>
            <Typography color="text.secondary">${priceRange[1]}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Button
          variant="outlined"
          fullWidth
          onClick={handleClearFilters}
          startIcon={<Clear />}
        >
          Clear All Filters
        </Button>
      </Box>
    </Drawer>
  );

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(8)].map((_, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Card>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={24} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" width={80} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          <LocalLibrary sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Book Store
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover your next favorite book from our collection
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or author..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                select
                fullWidth
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort by"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Sort />
                    </InputAdornment>
                  )
                }}
              >
                <MenuItem value="title">Title (A-Z)</MenuItem>
                <MenuItem value="price-asc">Price (Low to High)</MenuItem>
                <MenuItem value="price-desc">Price (High to Low)</MenuItem>
              </TextField>

              <Button
                variant="outlined"
                onClick={() => setFilterDrawerOpen(true)}
                startIcon={<FilterList />}
              >
                Filters
                {selectedCategories.length > 0 && (
                  <Chip
                    size="small"
                    label={selectedCategories.length}
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Active Filters */}
        {(selectedCategories.length > 0 || searchQuery || priceRange[0] > 0 || priceRange[1] < 200) && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedCategories.map(cat => (
              <Chip
                key={cat}
                label={cat}
                onDelete={() => handleCategoryToggle(cat)}
                size="small"
              />
            ))}
            {(priceRange[0] > 0 || priceRange[1] < 200) && (
              <Chip
                label={`$${priceRange[0]} - $${priceRange[1]}`}
                size="small"
                onDelete={() => setPriceRange([0, 200])}
              />
            )}
            {searchQuery && (
              <Chip
                label={`Search: ${searchQuery}`}
                size="small"
                onDelete={() => setSearchQuery('')}
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Results Summary */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography color="text.secondary">
          {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
        </Typography>
      </Box>

      {/* Book Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : displayedBooks.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {displayedBooks.map((book) => (
              <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
                <BookCard book={book} onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
              />
            </Box>
          )}
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <MenuBook sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>No books found</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search or filters to find what you're looking for
          </Typography>
          <Button
            variant="contained"
            onClick={handleClearFilters}
            startIcon={<Clear />}
          >
            Clear All Filters
          </Button>
        </Paper>
      )}

      {/* Filter Drawer */}
      <FilterDrawer />

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;