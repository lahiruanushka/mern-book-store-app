import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Person as PersonIcon,
  MenuBook as BookIcon,
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { dashboard as dashboardService } from "../../services/api";

const Dashboard = () => {
  const [pendingOrders, setPendingOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const navigate = useNavigate();

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getStats();
      const data = await response.data;

      setPendingOrders(data.pendingOrders || 0);
      setRecentOrders(data.recentOrders || []);
      setRevenue(data.revenue || 0);
      setTotalBooks(data.totalBooks || 0);
      setTotalOrders(data.totalOrders || 0);
      setTotalUsers(data.totalUsers || 0);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      setError("Failed to load dashboard data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Calculate time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;

    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60)
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };

  // Generate stats cards data from API data
  const stats = [
    {
      title: "Users",
      value: totalUsers.toLocaleString(),
      icon: PersonIcon,
      color: theme.palette.primary.main,
      bgColor: theme.palette.primary.light,
      path: "/admin/users",
      description: "Total registered users",
    },
    {
      title: "Books",
      value: totalBooks.toLocaleString(),
      icon: BookIcon,
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light,
      path: "/admin/books",
      description: "Books in inventory",
    },
    {
      title: "Orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingCartIcon,
      color: theme.palette.warning.main,
      bgColor: theme.palette.warning.light,
      path: "/admin/orders",
      description: "Total orders",
    },
    {
      title: "Revenue",
      value: formatCurrency(revenue),
      icon: MoneyIcon,
      color: theme.palette.info.main,
      bgColor: theme.palette.info.light,
      path: "/admin/finance",
      description: "Total revenue",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">Dashboard Overview</Typography>
        <Button
          startIcon={<RefreshIcon />}
          variant="outlined"
          onClick={fetchStats}
          disabled={loading}
        >
          Refresh Data
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Stats Cards */}
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={stat.title}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.3s",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[4],
                    },
                  }}
                  onClick={() => navigate(stat.path)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          sx={{ mb: 1 }}
                        >
                          {stat.title}
                        </Typography>
                        <Typography variant="h4">{stat.value}</Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mt: 1 }}
                        >
                          {stat.description}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          backgroundColor: stat.bgColor,
                          borderRadius: "50%",
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon
                          sx={{
                            fontSize: 32,
                            color: stat.color,
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}

          {/* Pending Orders Widget */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Pending Orders</Typography>
                <Tooltip title="View All Orders">
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/admin/orders")}
                  >
                    View All ({pendingOrders})
                  </Button>
                </Tooltip>
              </Box>

              {recentOrders.length > 0 ? (
                <List>
                  {recentOrders.slice(0, 5).map((order, index) => (
                    <React.Fragment key={order.id}>
                      <ListItem>
                        <ListItemIcon>
                          <ShoppingCartIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Order #${order._id.substring(
                            0,
                            8
                          )} - ${formatCurrency(order.totalAmount)}`}
                          secondary={`${order.user.name} • ${getTimeAgo(
                            order.createdAt
                          )}`}
                        />
                        <ListItemSecondaryAction>
                          <Tooltip title="View Order Details">
                            <IconButton
                              edge="end"
                              onClick={() =>
                                navigate(`/admin/orders/${order.id}`)
                              }
                            >
                              <ArrowForwardIcon />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < recentOrders.slice(0, 5).length - 1 && (
                        <Divider />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="body2" color="textSecondary">
                    No pending orders at the moment
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Low Stock Books */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Low Stock Alert</Typography>
                <Tooltip title="View All Books">
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/admin/books")}
                  >
                    View All
                  </Button>
                </Tooltip>
              </Box>

              {/* Assuming we'd get low stock items from recentOrders or another API call */}
              {/* For now, using sample data */}
              <List>
                {[
                  { id: 1, title: "React Patterns", stock: 3 },
                  { id: 2, title: "Node.js Basics", stock: 2 },
                  { id: 3, title: "TypeScript Guide", stock: 4 },
                ].map((book, index, array) => (
                  <React.Fragment key={book.id}>
                    <ListItem>
                      <ListItemIcon>
                        <BookIcon
                          color={book.stock < 3 ? "error" : "warning"}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={book.title}
                        secondary={`Only ${book.stock} ${
                          book.stock === 1 ? "copy" : "copies"
                        } left in stock`}
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="View Book Details">
                          <IconButton
                            edge="end"
                            onClick={() => navigate(`/admin/books/${book.id}`)}
                          >
                            <ArrowForwardIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < array.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Revenue Overview */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Revenue Overview
              </Typography>
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ color: theme.palette.success.main, mb: 2 }}
                >
                  {formatCurrency(revenue)}
                </Typography>
                <Typography variant="subtitle1">Total Revenue</Typography>
                <Box sx={{ mt: 3, display: "flex", gap: 3 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6">{totalOrders}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Orders
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6">
                      {formatCurrency(revenue / (totalOrders || 1))}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Avg. Order Value
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6">{pendingOrders}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Pending Orders
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 2 }}
                >
                  Note: For more detailed revenue analytics, visit the Finance
                  section
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
