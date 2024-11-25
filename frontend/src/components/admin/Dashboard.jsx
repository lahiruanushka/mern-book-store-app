import React from 'react';
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
  Tooltip
} from '@mui/material';
import { 
  Person as PersonIcon,
  MenuBook as BookIcon,
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Mock data for recent activities
  const recentActivities = [
    { text: "New order #1234 received", time: "5 minutes ago", type: "order" },
    { text: "Book 'React Patterns' stock low", time: "1 hour ago", type: "warning" },
    { text: "New user registration", time: "2 hours ago", type: "user" },
  ];

  const stats = [
    {
      title: 'Manage Users',
      value: '1,250',
      icon: PersonIcon,
      color: theme.palette.primary.main,
      bgColor: theme.palette.primary.light,
      path: '/admin/users',
      description: 'Active users this month'
    },
    {
      title: 'Manage Books',
      value: '450',
      icon: BookIcon,
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light,
      path: '/admin/books',
      description: 'Books in inventory'
    },
    {
      title: 'Manage Orders',
      value: '89',
      icon: ShoppingCartIcon,
      color: theme.palette.warning.main,
      bgColor: theme.palette.warning.light,
      path: '/admin/orders',
      description: 'Orders this week'
    }
  ];

  // Mock data for low stock items
  const lowStockBooks = [
    { id: 1, title: "React Patterns", stock: 3 },
    { id: 2, title: "Node.js Basics", stock: 2 },
    { id: 3, title: "TypeScript Guide", stock: 4 }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Dashboard Overview
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/books/create')}
          sx={{ 
            backgroundColor: theme.palette.success.main,
            '&:hover': {
              backgroundColor: theme.palette.success.dark,
            }
          }}
        >
          Create New Book
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={stat.title}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4]
                  }
                }}
                onClick={() => navigate(stat.path)}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
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
                      <Typography variant="h4">
                        {stat.value}
                      </Typography>
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
                        borderRadius: '50%',
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon 
                        sx={{ 
                          fontSize: 32,
                          color: stat.color
                        }} 
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Activities
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      {activity.type === 'order' && <ShoppingCartIcon color="primary" />}
                      {activity.type === 'warning' && <WarningIcon color="warning" />}
                      {activity.type === 'user' && <PersonIcon color="success" />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={activity.text}
                      secondary={activity.time}
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Low Stock Alert */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Low Stock Alert
            </Typography>
            <List>
              {lowStockBooks.map((book, index) => (
                <React.Fragment key={book.id}>
                  <ListItem>
                    <ListItemIcon>
                      <BookIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={book.title}
                      secondary={`Only ${book.stock} copies left`}
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="View Details">
                        <IconButton 
                          edge="end" 
                          onClick={() => navigate(`/admin/books/${book.id}`)}
                        >
                          <ArrowForwardIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < lowStockBooks.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;