import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Select,
  MenuItem,
  Button,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
  Visibility as VisibilityIcon,
  Edit,
} from "@mui/icons-material";
import { orders as ordersService } from "../../services/api";

const ManageOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusUpdateOpen, setOrderStatusUpdateOpen] = useState(false);
  const [newOrderStatus, setNewOrderStatus] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersService.getAllOrders();
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const getStatusChipProps = (status) => {
    const statusConfig = {
      pending: { color: "warning", label: "Pending" },
      processing: { color: "info", label: "Processing" },
      delivered: { color: "success", label: "Delivered" },
      cancelled: { color: "error", label: "Cancelled" },
    };
    return statusConfig[status] || { color: "default", label: status };
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toString().includes(searchTerm);

    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  const handleOpenStatusUpdate = (order) => {
    setSelectedOrder(order);
    setNewOrderStatus(order.status);
    setOrderStatusUpdateOpen(true);
  };

  const handleCloseStatusUpdate = () => {
    setOrderStatusUpdateOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;

    try {
      // Simulated API call to update order status
      await ordersService.updateStatus(selectedOrder._id, newOrderStatus);

      // Update the local state
      const updatedOrders = orders.map((order) =>
        order._id === selectedOrder._id
          ? { ...order, status: newOrderStatus }
          : order
      );
      setOrders(updatedOrders);

      // Close the modal
      handleCloseStatusUpdate();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExport = () => {
    // Implement export functionality
    const csvContent = [
      "Order ID,Customer,Email,Total Amount,Status,Date",
      ...orders.map(
        (order) =>
          `${order._id},${order.user.name},${order.user.email},${
            order.totalAmount
          },${order.status},${formatDate(order.createdAt)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "orders_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Order Management
        </Typography>
      </Box>

      {/* Filters Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search orders by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={selectedStatus}
                label="Status"
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              sx={{ whiteSpace: "nowrap" }}
              onClick={handleExport}
            >
              Export CSV
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <TableContainer component={Paper} elevation={1}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow
                key={order._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <TableCell component="th" scope="row">
                  #{order._id.slice(-5)}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{order.user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {order.user.email}
                  </Typography>
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{order.items[0].quantity}</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusChipProps(order.status).label}
                    color={getStatusChipProps(order.status).color}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton
                      size="small"
                      onClick={() => handleOrderDetails(order)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenStatusUpdate(order)}
                    >
                      <Edit />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Details Dialog */}
      <Dialog
        open={!!selectedOrder}
        onClose={handleCloseOrderDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Order Details #{selectedOrder._id.slice(-5)}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Customer Information</Typography>
                  <Typography>Name: {selectedOrder.user.name}</Typography>
                  <Typography>Email: {selectedOrder.user.email}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Shipping Address</Typography>
                  <Typography>
                    {selectedOrder.shippingAddress.street}
                  </Typography>
                  <Typography>
                    {selectedOrder.shippingAddress.city},
                    {selectedOrder.shippingAddress.state}{" "}
                    {selectedOrder.shippingAddress.zipCode}
                  </Typography>
                  <Typography>
                    {selectedOrder.shippingAddress.country}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Order Summary</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.priceAtTime.toFixed(2)}</TableCell>
                          <TableCell>
                            ${(item.quantity * item.priceAtTime).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Typography variant="subtitle1" align="right" sx={{ mt: 2 }}>
                    Total Amount: ${selectedOrder.totalAmount.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Status Update Modal */}
      <Dialog
        open={orderStatusUpdateOpen}
        onClose={handleCloseStatusUpdate}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={newOrderStatus}
                label="Status"
                onChange={(e) => setNewOrderStatus(e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusUpdate} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateOrderStatus}
            color="primary"
            variant="contained"
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageOrders;
