import React, { useState } from 'react';
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
  Toolbar,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';

const ManageOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const orders = [
    {
      id: 1,
      customer: "John Doe",
      email: "john@example.com",
      items: 2,
      total: "$45.00",
      status: "pending",
      date: "2024-03-25",
    },
    {
      id: 2,
      customer: "Jane Smith",
      email: "jane@example.com",
      items: 1,
      total: "$25.00",
      status: "delivered",
      date: "2024-03-24",
    },
  ];

  const getStatusChipProps = (status) => {
    const statusConfig = {
      pending: { color: 'warning', label: 'Pending' },
      delivered: { color: 'success', label: 'Delivered' },
      cancelled: { color: 'error', label: 'Cancelled' },
    };
    return statusConfig[status] || { color: 'default', label: status };
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
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
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search orders..."
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
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Export
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
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow
                key={order.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <TableCell component="th" scope="row">
                  #{order.id.toString().padStart(5, '0')}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{order.customer}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {order.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(order.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusChipProps(order.status).label}
                    color={getStatusChipProps(order.status).color}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageOrders;