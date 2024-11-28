import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  Skeleton,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  Visibility as DetailsIcon,
  LocalShipping as ShippingIcon,
  Print as PrintIcon,
  Cancel as CancelIcon,
  ReceiptLong as ReceiptIcon,
} from "@mui/icons-material";

import { orders } from "../services/api";

// Enhanced status color and icon mapping
const orderStatusConfig = {
  Pending: {
    color: "warning",
    icon: <ReceiptIcon fontSize="small" />,
    description: "Order is being processed",
  },
  Shipped: {
    color: "primary",
    icon: <ShippingIcon fontSize="small" />,
    description: "Order is on its way",
  },
  Delivered: {
    color: "success",
    icon: <ReceiptIcon fontSize="small" />,
    description: "Order has been delivered",
  },
  Cancelled: {
    color: "error",
    icon: <CancelIcon fontSize="small" />,
    description: "Order was cancelled",
  },
};

const OrdersPage = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openOrderDetails, setOpenOrderDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await orders.getMyOrders();
        setUserOrders(response.data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch orders", error);
        setError("Unable to load orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleOpenOrderDetails = (order) => {
    setSelectedOrder(order);
    setOpenOrderDetails(true);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
    setOpenOrderDetails(false);
  };

  const handlePrintOrder = (order) => {
    // Enhanced print functionality with more robust implementation
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(
      "<html><head><title>Order #" + order._id.slice(-6) + "</title>"
    );
    printWindow.document.write(
      "<style>body { font-family: Arial, sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; }</style>"
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write(
      "<h1>Order Details - #" + order._id.slice(-6) + "</h1>"
    );
    printWindow.document.write(
      "<table><thead><tr><th>Book</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr></thead><tbody>"
    );

    order.items.forEach((item) => {
      printWindow.document.write(`
        <tr>
          <td>${item.book.title}</td>
          <td>${item.quantity}</td>
          <td>$${item.priceAtTime.toFixed(2)}</td>
          <td>$${(item.quantity * item.priceAtTime).toFixed(2)}</td>
        </tr>
      `);
    });

    printWindow.document.write("</tbody></table>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const renderOrdersList = () => {
    if (isLoading) {
      return Array.from(new Array(3)).map((_, index) => (
        <Paper key={index} elevation={3} sx={{ mb: 2, p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Skeleton variant="text" width={150} height={30} />
              <Skeleton variant="text" width={100} height={20} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Skeleton variant="rectangular" width={80} height={30} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Skeleton variant="text" width={100} height={25} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box display="flex" justifyContent="flex-end">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ ml: 1 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ));
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      );
    }

    return userOrders.map((order) => {
      const statusConfig =
        orderStatusConfig[order.status] || orderStatusConfig.Pending;

      return (
        <Paper
          key={order._id}
          elevation={3}
          sx={{
            mb: 2,
            p: 2,
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: 6,
            },
            borderLeft: `6px solid ${
              statusConfig.color === "success"
                ? "green"
                : statusConfig.color === "error"
                ? "red"
                : statusConfig.color === "warning"
                ? "orange"
                : "blue"
            }`,
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography variant="subtitle1">
                Order #{order._id.slice(-6)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Tooltip title={statusConfig.description}>
                <Chip
                  icon={statusConfig.icon}
                  label={order.status}
                  color={statusConfig.color}
                  size="small"
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="body1">
                Total: ${order.totalAmount.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box display="flex" justifyContent="flex-end">
                <Tooltip title="View Order Details">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenOrderDetails(order)}
                  >
                    <DetailsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Print Order">
                  <IconButton
                    color="secondary"
                    onClick={() => handlePrintOrder(order)}
                  >
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      );
    });
  };

  const renderOrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <Dialog
        open={openOrderDetails}
        onClose={handleCloseOrderDetails}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: "#f4f4f4" }}>
          Order Details - #{selectedOrder._id.slice(-6)}
          <IconButton
            onClick={handleCloseOrderDetails}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CancelIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Order Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1">
                Order Date:{" "}
                {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                Status: {selectedOrder.status}
              </Typography>
              <Typography variant="body1">
                Total Amount: ${selectedOrder.totalAmount.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1">
                {selectedOrder.shippingAddress.street}
              </Typography>
              <Typography variant="body1">
                {selectedOrder.shippingAddress.city},{" "}
                {selectedOrder.shippingAddress.state}{" "}
                {selectedOrder.shippingAddress.zipCode}
              </Typography>
              <Typography variant="body1">
                {selectedOrder.shippingAddress.country}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Book</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.book.title}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          ${item.priceAtTime.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          ${(item.quantity * item.priceAtTime).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          My Orders
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ShippingIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
          }}
        >
          Track Shipments
        </Button>
      </Box>

      {userOrders.length === 0 && !isLoading ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            backgroundColor: "#f9f9f9",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            You haven't placed any orders yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
            href="/books"
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        renderOrdersList()
      )}

      {renderOrderDetailsModal()}
    </Container>
  );
};

export default OrdersPage;
