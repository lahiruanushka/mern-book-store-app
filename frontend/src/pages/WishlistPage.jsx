import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchWishlist, removeFromWishlist } from "../features/wishlistSlice";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Container,
  IconButton,
  Skeleton,
  Alert,
  Fade,
  Divider,
  Paper,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingCartIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  LocalOffer as PriceIcon,
  BookmarkRemove as EmptyWishlistIcon,
} from "@mui/icons-material";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const [removeAnimation, setRemoveAnimation] = useState(null);
  const navigate = useNavigate();
  const wishlistState = useSelector((state) => state.wishlist);
  const items = wishlistState?.items || [];
  const loading = wishlistState?.loading || false;
  const error = wishlistState?.error || null;

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemoveFromWishlist = async (bookId) => {
    setRemoveAnimation(bookId);
    try {
      await dispatch(removeFromWishlist(bookId)).unwrap();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={32} width="80%" />
              <Skeleton variant="text" height={24} width="60%" />
              <Skeleton variant="text" height={24} width="40%" />
              <Skeleton
                variant="rectangular"
                height={36}
                width="100%"
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // Empty wishlist component
  const EmptyWishlist = () => (
    <Paper
      sx={{
        p: 4,
        textAlign: "center",
        backgroundColor: "grey.50",
        borderRadius: 2,
      }}
    >
      <EmptyWishlistIcon sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
      <Typography variant="h6" color="textSecondary" gutterBottom>
        Your Wishlist is Empty
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={3}>
        Start adding books you love to your wishlist!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<ShoppingCartIcon />}
        onClick={() => navigate("/")}
      >
        Browse Books
      </Button>
    </Paper>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <FavoriteIcon color="primary" />
          My Wishlist
        </Typography>
        <LoadingSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography
          variant="h4"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <FavoriteIcon color="primary" />
          My Wishlist
          <Typography variant="subtitle1" color="textSecondary" sx={{ ml: 2 }}>
            ({items.length} {items.length === 1 ? "item" : "items"})
          </Typography>
        </Typography>

        {items.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <Grid container spacing={3}>
            {items.map((item) => {
              return (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Fade in={removeAnimation !== item.bookId}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Link
                          to={`/books/${item.bookId}`}
                          style={{ textDecoration: "none" }}
                        >
                          <Typography variant="h6" gutterBottom>
                            {item.title || "Loading book details..."}
                          </Typography>
                        </Link>
                        {item.price && (
                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            ${item.price.toFixed(2)}
                          </Typography>
                        )}

                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <CalendarIcon fontSize="small" />
                          Added: {new Date(item.addedAt).toLocaleDateString()}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            startIcon={<ShoppingCartIcon />}
                            fullWidth
                            onClick={() => {
                              /* Add to cart functionality */
                            }}
                          >
                            Add to Cart
                          </Button>
                          <Tooltip title="Remove from Wishlist">
                            <IconButton
                              color="error"
                              onClick={() =>
                                handleRemoveFromWishlist(item.bookId)
                              }
                              sx={{
                                "&:hover": {
                                  backgroundColor: "error.light",
                                  color: "white",
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Stack>
    </Container>
  );
};

export default WishlistPage;
