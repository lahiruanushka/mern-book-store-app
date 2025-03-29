import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Divider,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AccountCircle as AccountCircleIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // const response = await userProfileService.getProfile();
       
  
      //setUserData(profileData);
      setFormData({
        name: profileData.name,
        email: profileData.email,
      });
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError("Failed to load user profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateProfile = async () => {
    try {
      // Replace with your actual API call
      // const response = await userProfileService.updateProfile(formData);
      // const updatedUser = response.data;

      // setUserData(updatedUser);
      setEditMode(false);
      showNotification("Profile updated successfully", "success");
    } catch (err) {
      console.error("Failed to update profile:", err);
      showNotification("Failed to update profile. Please try again.", "error");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // API call here

      showNotification("Account deleted successfully", "success");
      // Redirect to login page after a short delay
      setTimeout(() => {
        handleLogout();
      }, 2000);
    } catch (err) {
      console.error("Failed to delete account:", err);
      showNotification("Failed to delete account. Please try again.", "error");
      setOpenDeleteDialog(false);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate("/login");
      // Redirect to login page
      navigate("/login");
    } catch (err) {
      console.error("Failed to logout:", err);
      showNotification("Failed to logout. Please try again.", "error");
      setOpenLogoutDialog(false);
    }
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">User not found. Please login again.</Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/login")}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 5 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  bgcolor: "primary.main",
                  fontSize: 64,
                }}
              >
                {user.name?.charAt(0)?.toUpperCase()}
              </Avatar>

              <Typography variant="h5" sx={{ mt: 2 }}>
                {user.name}
              </Typography>

              <Typography variant="body1" color="textSecondary">
                {user.email}
              </Typography>

              {user.role === "admin" && (
                <Chip
                  icon={<AdminIcon />}
                  label="Administrator"
                  color="primary"
                  sx={{ mt: 2 }}
                />
              )}

              {user.role !== "admin" && (
                <Chip
                  icon={<PersonIcon />}
                  label="User"
                  variant="outlined"
                  sx={{ mt: 2 }}
                />
              )}

              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Member since{" "}
                {userData && userData.createdAt
                  ? format(new Date(userData.createdAt), "MMMM dd, yyyy")
                  : "Loading..."}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Button
                fullWidth
                startIcon={<EditIcon />}
                onClick={() => setEditMode(!editMode)}
                sx={{ mb: 2 }}
                color={editMode ? "warning" : "primary"}
                variant="outlined"
              >
                {editMode ? "Cancel Edit" : "Edit Profile"}
              </Button>

              <Button
                fullWidth
                startIcon={<DeleteIcon />}
                onClick={() => setOpenDeleteDialog(true)}
                sx={{ mb: 2 }}
                color="error"
                variant="outlined"
              >
                Delete Account
              </Button>

              <Button
                fullWidth
                startIcon={<LogoutIcon />}
                onClick={() => setOpenLogoutDialog(true)}
                variant="contained"
                color="secondary"
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6">
                {editMode ? "Edit Profile" : "Profile Information"}
              </Typography>

              {editMode && (
                <Box>
                  <Button
                    startIcon={<SaveIcon />}
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateProfile}
                    sx={{ mr: 1 }}
                  >
                    Save
                  </Button>
                  <Button
                    startIcon={<CancelIcon />}
                    variant="outlined"
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        name: user.name,
                        email: user.email,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {editMode ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1">{user.name}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Email Address
                  </Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    User ID
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                    {user.id}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Account Created
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 2 }}
                  >
                    {userData && userData.createdAt
                      ? format(new Date(userData.createdAt), "MMMM dd, yyyy")
                      : "Loading..."}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Role
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {user.role}
                    {user.role === "admin" && (
                      <AdminIcon
                        color="primary"
                        fontSize="small"
                        sx={{ ml: 1, verticalAlign: "middle" }}
                      />
                    )}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Paper>

          {/* Additional sections could go here - order history, activity log, preferences, etc. */}
        </Grid>
      </Grid>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be
            undone and all your data will be permanently removed from our
            system.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      {}
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
      >
        <DialogTitle>Sign Out</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to sign out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="primary" variant="contained">
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
