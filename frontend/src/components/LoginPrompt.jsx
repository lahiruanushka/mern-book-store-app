import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Box,
  IconButton,
  Slide,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import { Link as RouterLink } from "react-router-dom";

// Styled components for enhanced UI
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    overflow: "hidden",
    maxWidth: 400,
    width: "100%",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 30,
  padding: "12px 24px",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "1rem",
  boxShadow: "none",
  transition: "all 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

// Transition effect for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LoginPrompt = ({ open, onClose, actionType }) => {
  // Action messages based on what the user was trying to do
  const actionMessages = {
    cart: {
      title: "Sign in required",
      icon: <ShoppingCartIcon sx={{ fontSize: 60, color: "primary.main" }} />,
      message:
        "Please sign in to add items to your shopping cart and continue with your purchase.",
    },
    wishlist: {
      title: "Sign in required",
      icon: <BookmarkIcon sx={{ fontSize: 60, color: "primary.main" }} />,
      message: "Please sign in to add items to your wishlist for later.",
    },
    default: {
      title: "Sign in required",
      icon: <PersonIcon sx={{ fontSize: 60, color: "primary.main" }} />,
      message: "Please sign in to access all features of our bookstore.",
    },
  };

  const { title, icon, message } =
    actionMessages[actionType] || actionMessages.default;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      fullWidth
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={onClose} size="small" aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pb: 4, pt: 0 }}>
        <Box
          sx={{
            textAlign: "center",
            mb: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "rgba(25, 118, 210, 0.1)",
              borderRadius: "50%",
              p: 2,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 2, mb: 4 }}
          >
            {message}
          </Typography>

          <ActionButton
            component={RouterLink}
            to="/login"
            variant="contained"
            color="primary"
            startIcon={<LoginIcon />}
            onClick={onClose}
          >
            Go to Login
          </ActionButton>

          <Button
            color="primary"
            onClick={onClose}
            sx={{ mt: 2, textTransform: "none" }}
          >
            Continue browsing
          </Button>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};

export default LoginPrompt;
