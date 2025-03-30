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
  Snackbar,
  Alert,
  Skeleton,
  Container,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";
import { profile as profileService } from "../services/api";

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await profileService.getProfile();
      const profileData = response.data;
      setUserData(profileData);
      setFormData({
        name: profileData.name,
        email: profileData.email,
      });
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError("Failed to load user profile. Please try again later.");
    } finally {
      setTimeout(() => setLoading(false), 800); // Add small delay for better UX
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
      const response = await profileService.updateProfile(formData);
      const updatedUser = response.data;

      setUserData(updatedUser.user);
      setFormData({
        name: updatedUser.name,
        email: updatedUser.email,
      });

      setEditMode(false);
      showNotification("Profile updated successfully", "success");
    } catch (err) {
      console.error("Failed to update profile:", err);
      showNotification("Failed to update profile. Please try again.", "error");
    }
  };

  const handleDeleteWithPassword = async () => {
    try {
      setPasswordError("");
      const response = await profileService.deleteAccount(confirmPassword);
      showNotification("Account deleted successfully", "success");
      setTimeout(() => {
        handleLogout();
      }, 2000);
    } catch (error) {
      console.error("Failed to delete account:", error);
      setPasswordError("Invalid password. Please try again.");
      showNotification("Failed to delete account. Please try again.", "error");
    }
  };

  useEffect(() => {
    if (!openDeleteDialog) {
      setConfirmPassword("");
      setPasswordError("");
    }
  }, [openDeleteDialog]);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
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

  const cancelEdit = () => {
    setEditMode(false);
    setFormData({
      name: userData.name,
      email: userData.email,
    });
  };

  // Skeleton loading component
  const ProfileSkeleton = () => (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ mb: 3, overflow: "visible" }}>
              <CardContent
                sx={{ textAlign: "center", py: 5, position: "relative" }}
              >
                <Skeleton
                  variant="circular"
                  width={120}
                  height={120}
                  sx={{ mx: "auto" }}
                />
                <Skeleton
                  variant="text"
                  width="60%"
                  height={40}
                  sx={{ mx: "auto", mt: 2 }}
                />
                <Skeleton
                  variant="text"
                  width="80%"
                  height={24}
                  sx={{ mx: "auto", mt: 1 }}
                />
                <Skeleton
                  variant="rounded"
                  width={120}
                  height={32}
                  sx={{ mx: "auto", mt: 2 }}
                />
                <Skeleton
                  variant="text"
                  width="40%"
                  height={20}
                  sx={{ mx: "auto", mt: 2 }}
                />
              </CardContent>
            </Card>

            <Card elevation={2}>
              <CardContent>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={32}
                  sx={{ mb: 2 }}
                />
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Skeleton variant="rounded" height={40} />
                  <Skeleton variant="rounded" height={40} />
                  <Skeleton variant="rounded" height={40} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Skeleton variant="text" width="30%" height={32} />
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Grid item xs={12} sm={6} key={item}>
                    <Skeleton variant="text" width="40%" height={24} />
                    <Skeleton variant="text" width="70%" height={28} />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => fetchUserProfile()}>
          Try Again
        </Button>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          User not found. Please login again.
        </Alert>
        <Button variant="contained" onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch (e) {
      return "Unknown";
    }
  };

  return (
    <Container maxWidth="lg">
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="500" sx={{ mb: 4 }}>
          My Profile
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ mb: 3, overflow: "visible" }}>
              <CardContent
                sx={{ textAlign: "center", py: 5, position: "relative" }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: 120,
                    height: 120,
                    mx: "auto",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: theme.palette.primary.main,
                      fontSize: 48,
                      boxShadow: 2,
                    }}
                  >
                    {userData.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </Box>

                <Typography variant="h5" sx={{ mt: 2, fontWeight: 500 }}>
                  {userData.name}
                </Typography>

                <Typography variant="body1" color="text.secondary">
                  {userData.email}
                </Typography>

                {userData.role === "admin" ? (
                  <Chip
                    icon={<AdminIcon />}
                    label="Administrator"
                    color="primary"
                    sx={{ mt: 2 }}
                  />
                ) : (
                  <Chip
                    icon={<PersonIcon />}
                    label="User"
                    color="default"
                    variant="outlined"
                    sx={{ mt: 2 }}
                  />
                )}

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Member since {formatDate(userData?.createdAt)}
                </Typography>
              </CardContent>
            </Card>

            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <SettingsIcon sx={{ mr: 1 }} color="action" />
                  <Typography variant="h6">Account Actions</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2}>
                  <Button
                    fullWidth
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(!editMode)}
                    color={editMode ? "warning" : "primary"}
                    variant={editMode ? "contained" : "outlined"}
                  >
                    {editMode ? "Cancel Edit" : "Edit Profile"}
                  </Button>

                  <Button
                    fullWidth
                    startIcon={<DeleteIcon />}
                    onClick={() => setOpenDeleteDialog(true)}
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
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                  flexDirection: isMobile && editMode ? "column" : "row",
                  alignItems: isMobile && editMode ? "flex-start" : "center",
                  gap: isMobile && editMode ? 2 : 0,
                }}
              >
                <Typography variant="h6" fontWeight="500">
                  {editMode ? "Edit Profile" : "Profile Information"}
                </Typography>

                {editMode && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      width: isMobile ? "100%" : "auto",
                    }}
                  >
                    <Button
                      startIcon={<SaveIcon />}
                      variant="contained"
                      color="primary"
                      onClick={handleUpdateProfile}
                      fullWidth={isMobile}
                    >
                      Save Changes
                    </Button>
                    <Button
                      startIcon={<CancelIcon />}
                      variant="outlined"
                      onClick={cancelEdit}
                      fullWidth={isMobile}
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
                      placeholder="Enter your full name"
                      variant="outlined"
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
                      disabled
                      helperText="Email cannot be changed"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Full Name
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {userData.name}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Email Address
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {userData.email}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Account Created
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {formatDate(userData?.createdAt)}
                    </Typography>
                  </Grid>
                  
                  {userData.role === "admin" && (
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Role
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          variant="body1"
                          fontWeight="500"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {userData.role}
                        </Typography>

                        <AdminIcon
                          color="primary"
                          fontSize="small"
                          sx={{ ml: 1, verticalAlign: "middle" }}
                        />
                      </Box>
                    </Grid>
                  )}
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 3 }}>
            This action cannot be undone. All your data will be permanently
            deleted.
          </Alert>
          <DialogContentText>
            Please enter your password to confirm this action:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteWithPassword}
            color="error"
            variant="contained"
            disabled={!confirmPassword}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        maxWidth="xs"
      >
        <DialogTitle>Sign Out</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to sign out?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenLogoutDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary" variant="contained">
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile;
