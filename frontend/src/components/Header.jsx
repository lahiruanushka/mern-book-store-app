import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  InputBase,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search,
  ShoppingCart,
  User,
  Bookmark,
  LogOut,
  Home,
  BookOpen,
  Library,
  Settings,
  Bell
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const isAdmin = user?.role === 'admin' ? true : false;

  console.log('user', user)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

   const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

const navigationItems = [
    { text: 'Home', icon: <Home size={24} />, path: '/' },
    { text: 'Categories', icon: <BookOpen size={24} />, path: '/categories' },
    { text: 'New Releases', icon: <Library size={24} />, path: '/new-releases' },
    { text: 'Admin Panel', icon: <Settings size={24} />, path: '/admin', admin: true },
];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {navigationItems.map((item) => {
          if ((item.auth && !isAuthenticated) || (item.admin && !isAdmin)) return null;
          return (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{ 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
            onClick={() => navigate('/')}
          >
            <Library size={24} />
           BookWhiz
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navigationItems.map((item) => {
                if ((item.auth && !isAuthenticated) || (item.admin && !isAdmin)) return null;
                return (
                  <Button
                    key={item.text}
                    color="inherit"
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                  >
                    {item.text}
                  </Button>
                );
              })}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAuthenticated ? (
              <>
                <IconButton color="inherit" onClick={handleNotificationsOpen}>
                  <Badge badgeContent={3} color="error">
                    <Bell size={24} />
                  </Badge>
                </IconButton>

                <IconButton color="inherit" onClick={() => navigate('/cart')}>
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCart size={24} />
                  </Badge>
                </IconButton>

                <IconButton onClick={handleUserMenuOpen}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    <User size={20} />
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button color="inherit" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleUserMenuClose(); }}>
          <ListItemIcon><User size={20} /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { navigate('/orders'); handleUserMenuClose(); }}>
          <ListItemIcon><ShoppingCart size={20} /></ListItemIcon>
          My Orders
        </MenuItem>
        <MenuItem onClick={() => { navigate('/wishlist'); handleUserMenuClose(); }}>
  <ListItemIcon><Bookmark size={20} /></ListItemIcon>
  Wishlist
</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogOut size={20} /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
      >
        <MenuItem onClick={handleNotificationsClose}>
          New book release: "The Latest Best Seller"
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          Your order #123 has been shipped
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          Special offer: 20% off on all classics
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;