import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  Box,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Paper
} from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon, 
  LocalShipping as ShippingIcon, 
  Payment as PaymentIcon, 
  CheckCircle as ConfirmationIcon 
} from '@mui/icons-material';

import { orders, cart } from '../services/api';

// Zod Schema for Shipping Address
const shippingAddressSchema = z.object({
  street: z.string().min(3, { message: "Street address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State/Province is required" }),
  zipCode: z.string()
    .min(4, { message: "Zip/Postal code is required" })
    .max(10, { message: "Zip code is too long" }),
  country: z.string().min(2, { message: "Country is required" })
});

const OrderProcessingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Initialize React Hook Form with Zod resolver
  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    trigger,
    getValues
  } = useForm({
    resolver: zodResolver(shippingAddressSchema),
    mode: 'onBlur',
    defaultValues: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await cart.get();
        setCartItems(response.data.items);
        calculateTotal(response.data.items);
      } catch (error) {
        console.error('Failed to fetch cart items', error);
      }
    };
    fetchCartItems();
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => 
      acc + (item.book.price * item.quantity), 0
    );
    setTotalAmount(total);
  };

  const handleNext = async () => {
    // For shipping step, validate form before proceeding
    if (activeStep === 1) {
      const isValid = await trigger();
      if (!isValid) return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const createOrder = async () => {
    try {
      const shippingData = getValues();
      const orderData = {
        shippingAddress: shippingData,
        items: cartItems
      };
      
      const response = await orders.create(orderData);
      
      // Clear cart after successful order
      await cart.clear();
      
      handleNext(); // Move to confirmation step
    } catch (error) {
      console.error('Order creation failed', error);
    }
  };

  const steps = [
    {
      label: 'Review Cart',
      icon: <ShoppingCartIcon />,
      content: (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cart Items
            </Typography>
            {cartItems.map((item) => (
              <Grid container key={item.book._id} spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Grid item xs={6}>
                  <Typography>{item.book.title}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>Quantity: {item.quantity}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>
                    ${(item.book.price * item.quantity).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" align="right">
              Total: ${totalAmount.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      )
    },
    {
      label: 'Shipping Details',
      icon: <ShippingIcon />,
      content: (
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="street"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Street Address"
                    error={!!errors.street}
                    helperText={errors.street?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="City"
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="State/Province"
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="zipCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Zip/Postal Code"
                    error={!!errors.zipCode}
                    helperText={errors.zipCode?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Country"
                    error={!!errors.country}
                    helperText={errors.country?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Payment',
      icon: <PaymentIcon />,
      content: (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Summary
            </Typography>
            <Typography>
              Total Amount: ${totalAmount.toFixed(2)}
            </Typography>
            {/* Placeholder for future payment integration */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Secure payment processing coming soon
            </Typography>
          </CardContent>
        </Card>
      )
    },
    {
      label: 'Confirmation',
      icon: <ConfirmationIcon />,
      content: (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1">
            Thank you for your purchase. Your order will be processed shortly.
          </Typography>
        </Paper>
      )
    }
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel StepIconComponent={() => step.icon}>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box sx={{ mt: 3, mb: 3 }}>
        {steps[activeStep].content}
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          color="inherit" 
          disabled={activeStep === 0} 
          onClick={handleBack}
        >
          Back
        </Button>
        
        {activeStep === steps.length - 1 ? (
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => window.location.href = '/orders'}
          >
            View Orders
          </Button>
        ) : activeStep === 2 ? (
          <Button 
            variant="contained" 
            color="primary"
            onClick={createOrder}
          >
            Place Order
          </Button>
        ) : (
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default OrderProcessingPage;