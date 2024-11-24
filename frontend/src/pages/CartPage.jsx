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
  CircularProgress
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { cart } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cart.get();
      // Ensure we have an array of items
      const items = Array.isArray(response.data) ? response.data : [];
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (bookId, quantity) => {
    if (quantity < 1) return;
    try {
      await cart.updateItem(bookId, quantity);
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update quantity. Please try again.');
    }
  };

  const handleRemoveItem = async (bookId) => {
    try {
      await cart.removeItem(bookId);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item. Please try again.');
    }
  };

  // Safely calculate total amount with validation
  const totalAmount = Array.isArray(cartItems) 
    ? cartItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0)
    : 0;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" gutterBottom>{error}</Typography>
        <Button variant="contained" onClick={fetchCart}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      {cartItems.length === 0 ? (
        <Typography variant="body1">Your cart is empty</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
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
                  <TableRow key={item.bookId}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell align="right">${Number(item.price).toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.bookId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Remove />
                      </IconButton>
                      {item.quantity}
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.bookId, item.quantity + 1)}
                      >
                        <Add />
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.bookId)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">
              Total: ${totalAmount.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CartPage;