import React from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  Book as BookIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";

const DashboardPage = () => {

  return (
    <Box sx={{ display: "flex" }}>
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1}}>
        <Toolbar />

        {/* Outlet for nested routes */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardPage;
