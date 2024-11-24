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
  Box
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { cart } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cart.get();
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleUpdateQuantity = async (bookId, quantity) => {
    try {
      await cart.updateItem(bookId, quantity);
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (bookId) => {
    try {
      await cart.removeItem(bookId);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
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
                <TableCell align="right">${item.price}</TableCell>
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
                  ${(item.price * item.quantity).toFixed(2)}
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
          disabled={cartItems.length === 0}
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default CartPage;