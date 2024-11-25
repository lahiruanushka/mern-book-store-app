import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Button,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Grid,
  Skeleton
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  ArrowBack,
  LocalShipping
} from '@mui/icons-material';
import { cart } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cart.get();
      const items = Array.isArray(response.data.items)
        ? response.data.items.map(item => ({
            ...item,
            book: {
              ...item.book,
              price: parseFloat(item.book.price) || 0
            },
            quantity: parseInt(item.quantity) || 0
          }))
        : [];
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (bookId, quantity, currentQuantity) => {
    if (quantity < 1) return;
    
    // Optimistic update
    const updatedItems = cartItems.map(item =>
      item.book._id === bookId ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);

    try {
      await cart.updateItem(bookId, quantity);
      setSnackbar({
        open: true,
        message: 'Quantity updated successfully',
        severity: 'success'
      });
    } catch (error) {
      // Revert on failure
      setCartItems(cartItems);
      setSnackbar({
        open: true,
        message: 'Failed to update quantity',
        severity: 'error'
      });
    }
  };

  const handleRemoveItem = async (bookId) => {
    // Optimistic update
    const filteredItems = cartItems.filter(item => item.book._id !== bookId);
    setCartItems(filteredItems);

    try {
      await cart.removeItem(bookId);
      setSnackbar({
        open: true,
        message: 'Item removed from cart',
        severity: 'success'
      });
    } catch (error) {
      // Revert on failure
      setCartItems(cartItems);
      setSnackbar({
        open: true,
        message: 'Failed to remove item',
        severity: 'error'
      });
    }
  };

  const getItemTotal = (item) => {
    const price = parseFloat(item.book.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return price * quantity;
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const LoadingSkeleton = () => (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={60} />
    </Box>
  );

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={fetchCart}
          startIcon={<ArrowBack />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const CartHeader = () => (
    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
      <ShoppingCart sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      <Typography variant="h4" component="h1">
        Shopping Cart {totalItems > 0 && `(${totalItems} items)`}
      </Typography>
    </Box>
  );

  const CartSummary = () => (
    <Card elevation={3} sx={{ position: 'sticky', top: 20 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Order Summary</Typography>
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>Subtotal:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">${totalAmount.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Shipping:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">Free</Typography>
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h6">Total:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" align="right">
                ${totalAmount.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={() => navigate('/checkout')}
          disabled={cartItems.length === 0}
          startIcon={<LocalShipping />}
        >
          Proceed to Checkout
        </Button>
        
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
          startIcon={<ArrowBack />}
        >
          Continue Shopping
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <CartHeader />
      
      {cartItems.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>Your cart is empty</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Add some books to your cart and they will appear here
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            startIcon={<ArrowBack />}
          >
            Browse Books
          </Button>
        </Card>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Book</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {item.book.title}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        ${item.book.price.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item.book._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Remove />
                          </IconButton>
                          <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item.book._id, item.quantity + 1)}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontWeight: 500 }}>
                          ${getItemTotal(item).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item.book._id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <CartSummary />
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartPage;