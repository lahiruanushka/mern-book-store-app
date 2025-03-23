import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Avatar,
  Grid,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Loyalty as LoyaltyIcon,
  CalendarToday as CalendarIcon,
  ShoppingCart as CartIcon,
  CreditCard as PaymentIcon,
} from "@mui/icons-material";

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `user-tab-${index}`,
    "aria-controls": `user-tabpanel-${index}`,
  };
}

const UserInformationModal = ({ isOpen, onClose, userId }) => {
  const [tabValue, setTabValue] = useState(0);

  // Sample user data - in a real app, you would fetch this based on userId
  const userData = {
    id: "USR-7842",
    name: "Jennifer Morrison",
    email: "jennifer.morrison@example.com",
    address: {
      street: "123 Main Street",
      city: "Boston",
      state: "MA",
      zipCode: "02108",
      country: "United States",
    },
    role: "customer",
    joinDate: "2023-05-15",
    lastLogin: "2025-03-22T14:35:22",
    totalOrders: 14,
    totalSpent: 1258.75,
    loyaltyPoints: 540,
  };

  // Sample order data
  const orderData = [
    {
      id: "ORD-9284",
      date: "2025-03-15",
      status: "Delivered",
      items: 3,
      total: 124.99,
      paymentMethod: "Credit Card",
    },
    {
      id: "ORD-8472",
      date: "2025-02-28",
      status: "Delivered",
      items: 2,
      total: 89.5,
      paymentMethod: "PayPal",
    },
    {
      id: "ORD-7651",
      date: "2025-01-17",
      status: "Delivered",
      items: 5,
      total: 210.25,
      paymentMethod: "Credit Card",
    },
  ];

  // Login activity data
  const loginActivity = [
    {
      id: 1,
      date: "2025-03-22 14:35:22",
      device: "iPhone 16 Pro",
      location: "Boston, MA",
      ipAddress: "192.168.1.45",
    },
    {
      id: 2,
      date: "2025-03-19 09:12:07",
      device: "Chrome on Windows",
      location: "Boston, MA",
      ipAddress: "192.168.1.45",
    },
    {
      id: 3,
      date: "2025-03-15 17:28:33",
      device: "Safari on MacBook",
      location: "Cambridge, MA",
      ipAddress: "172.25.10.8",
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95%", sm: "80%", md: "70%" },
    maxWidth: 900,
    maxHeight: "90vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  // Check if isOpen is false, and if so, don't render the Modal
  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="user-information-modal-title"
    >
      <Box sx={modalStyle}>
        {/* Header */}
        <Box
          sx={{ p: 3, bgcolor: "primary.main", color: "primary.contrastText" }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography id="user-information-modal-title" variant="h6">
              User Information
            </Typography>
            <IconButton
              onClick={onClose}
              aria-label="close"
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* User Profile Summary */}
        <Box sx={{ p: 3, bgcolor: "background.paper" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "secondary.main",
                  fontSize: 28,
                }}
              >
                {userData.name.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h6" component="h2">
                {userData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <EmailIcon
                  fontSize="small"
                  sx={{ verticalAlign: "middle", mr: 1 }}
                />
                {userData.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <HomeIcon
                  fontSize="small"
                  sx={{ verticalAlign: "middle", mr: 1 }}
                />
                {`${userData.address.city}, ${userData.address.state} ${userData.address.zipCode}`}
              </Typography>
            </Grid>
    
          </Grid>

          {/* User Stats */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6} sm={3}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <LoyaltyIcon color="primary" fontSize="small" />
                  <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                    {userData.loyaltyPoints}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Loyalty Points
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <CalendarIcon color="primary" fontSize="small" />
                  <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                    {formatDate(userData.joinDate)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <CartIcon color="primary" fontSize="small" />
                  <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                    {userData.totalOrders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <PaymentIcon color="primary" fontSize="small" />
                  <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                    ${userData.totalSpent.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Spent
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="user information tabs"
            variant="fullWidth"
          >
            <Tab label="Details" {...a11yProps(0)} />
            <Tab label="Orders" {...a11yProps(1)} />
            <Tab label="Login Activity" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Scrollable content area */}
        <Box sx={{ overflow: "auto", maxHeight: "50vh", p: 2 }}>
          {/* User Details Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Personal Information
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Full Name
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{userData.name}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{userData.email}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        User ID
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{userData.id}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Role
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Chip
                        size="small"
                        label={
                          userData.role.charAt(0).toUpperCase() +
                          userData.role.slice(1)
                        }
                        color={
                          userData.role === "admin"
                            ? "error"
                            : userData.role === "manager"
                            ? "warning"
                            : "success"
                        }
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Address Information
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Street
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {userData.address.street}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        City
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {userData.address.city}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        State
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {userData.address.state}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        ZIP Code
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {userData.address.zipCode}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Country
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {userData.address.country}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Orders Tab */}
          <TabPanel value={tabValue} index={1}>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderData.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={order.status}
                          color={
                            order.status === "Delivered"
                              ? "success"
                              : order.status === "Processing"
                              ? "primary"
                              : "default"
                          }
                        />
                      </TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell align="right">
                        ${order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>{order.paymentMethod}</TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button variant="text">View All Orders</Button>
            </Box>
          </TabPanel>

          {/* Login Activity Tab */}
          <TabPanel value={tabValue} index={2}>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Device</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>IP Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loginActivity.map((login) => (
                    <TableRow key={login.id}>
                      <TableCell>{login.date}</TableCell>
                      <TableCell>{login.device}</TableCell>
                      <TableCell>{login.location}</TableCell>
                      <TableCell>{login.ipAddress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Box>
      </Box>

 
    </Modal>
  );
};

UserInformationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.string,
};

export default UserInformationModal;
