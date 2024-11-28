import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Rating,
  Paper,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Skeleton,
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  Favorite as WishlistIcon,
  Share as ShareIcon,
  ReadMore as ReadMoreIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { books, cart, wishlist, users } from "../services/api";
import { useParams } from "react-router-dom";

const BookDetailsSkeleton = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Grid container spacing={4}>
      {/* Book Image Skeleton */}
      <Grid item xs={12} md={5}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={500}
          sx={{ borderRadius: 2 }}
        />
      </Grid>

      {/* Book Details Skeleton */}
      <Grid item xs={12} md={7}>
        <Skeleton variant="text" width="70%" height={50} />
        <Skeleton variant="text" width="50%" height={30} />

        <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
          <Skeleton variant="circular" width={100} height={30} />
          <Skeleton variant="text" width="30%" height={30} sx={{ ml: 2 }} />
        </Box>

        <Skeleton variant="text" width="40%" height={40} />

        <Box sx={{ my: 2 }}>
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="90%" />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Skeleton variant="rectangular" width={100} height={56} />
          <Skeleton variant="rectangular" width={150} height={56} />
          <Skeleton variant="circular" width={50} height={50} />
        </Box>
      </Grid>

      {/* Reviews Skeleton */}
      <Grid item xs={12}>
        <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
          <Skeleton variant="text" width="30%" height={40} />

          {[1, 2, 3].map((item) => (
            <Box key={item} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="50%" height={30} />
              <Skeleton variant="text" height={20} />
            </Box>
          ))}

          <Box sx={{ mt: 3 }}>
            <Skeleton variant="text" width="20%" height={30} />
            <Skeleton variant="rectangular" height={50} sx={{ mt: 2 }} />
            <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
            <Skeleton
              variant="rectangular"
              width="20%"
              height={50}
              sx={{ mt: 2 }}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </Container>
);


const BookDetailsPage = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [ratingUsers, setRatingUsers] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { id: bookId } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await books.getBook(bookId);

        const bookData = response.data;

        // Validate book data
        if (!bookData || !bookData._id) {
          throw new Error("Invalid book data received");
        }

        setBook(bookData);
      } catch (error) {
        console.error("Book fetching error:", error);

        setError({
          message:
            error.response?.data?.message ||
            error.message ||
            "Failed to load book details",
        });

        setSnackbar({
          open: true,
          message:
            error.response?.data?.message ||
            "Failed to load the book details. Please try again!",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  // Function to fetch user details for ratings
  const fetchRatingUsers = async () => {
    try {
      // Create an object to store user details
      const userDetailsMap = {};

      // Fetch user details for each rating
      const userPromises = book.ratings.map(async (rating) => {
        try {
          const response = await users.getUser(rating.user);
          userDetailsMap[rating.user] = response.data.name;
        } catch (error) {
          console.error(`Failed to fetch user ${rating.user}:`, error);
          userDetailsMap[rating.user] = "Anonymous"; // Fallback name
        }
      });

      // Wait for all user detail fetches to complete
      await Promise.all(userPromises);

      // Update the state with user details
      setRatingUsers(userDetailsMap);
    } catch (error) {
      console.error("Error fetching rating users:", error);
    }
  };

  // Call fetchRatingUsers when book data is loaded
  useEffect(() => {
    if (book && book.ratings.length > 0) {
      fetchRatingUsers();
    }
  }, [book]);

  const handleAddToCart = async () => {
    try {
      await cart.addItem(book._id, quantity);
      setSnackbar({
        open: true,
        message: "Book added to cart successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add book to cart",
        severity: "error",
      });
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await wishlist.addItem({
        bookId: book._id,
        title: book.title,
        price: book.price,
      });
      setSnackbar({
        open: true,
        message: "Book added to wishlist!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add book to wishlist",
        severity: "error",
      });
    }
  };

  const handleSubmitReview = async () => {
    try {
      await books.addRating(book._id, {
        rating,
        review,
      });
      setSnackbar({
        open: true,
        message: "Review submitted successfully!",
        severity: "success",
      });
      setReview("");
      setRating(0);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to submit review",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // New function to handle book sharing
  const handleShareBook = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out this book: ${book.title} by ${book.author}`,
        url: window.location.href
      });
    } else {
      setSnackbar({
        open: true,
        message: "Sharing not supported on this device",
        severity: "info"
      });
    }
  };

  // Compute average rating
  const averageRating = book?.ratings?.length 
    ? book.ratings.reduce((sum, r) => sum + r.rating, 0) / book.ratings.length 
    : 0;


      // Error state handling
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error.message || "An unexpected error occurred"}
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return <BookDetailsSkeleton />;
  }

  // Ensure book exists before rendering
  if (!book) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">No book data available</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Enhanced Book Image Section */}
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={4} 
            sx={{ 
              position: 'relative',
              height: 500, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
          >
            <img
              src={book.imageUrl}
              alt={book.title}
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Tooltip title="Share Book">
              <IconButton
                onClick={handleShareBook}
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Paper>
        </Grid>

        {/* Enhanced Book Details Section */}
        <Grid item xs={12} md={7}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              by {book.author}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', my: 2, gap: 2 }}>
              <Rating
                value={averageRating}
                precision={0.5}
                readOnly
                size="large"
              />
              <Chip 
                icon={<StarIcon />} 
                label={`${averageRating.toFixed(1)} (${book.ratings.length} reviews)`} 
                color="primary" 
                variant="outlined" 
              />
            </Box>

            <Typography variant="h4" color="primary" sx={{ my: 2 }}>
              ${book.price.toFixed(2)}
            </Typography>

            <Typography variant="body1" paragraph sx={{ flexGrow: 1 }}>
              {book.description}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
              <TextField
                type="number"
                label="Quantity"
                variant="outlined"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value)))
                }
                inputProps={{ min: 1 }}
                sx={{ width: 100 }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                size="large"
                sx={{
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }}
              >
                Add to Cart
              </Button>
              <Tooltip title="Add to Wishlist">
                <IconButton
                  color="secondary"
                  onClick={handleAddToWishlist}
                  aria-label="Add to Wishlist"
                  sx={{
                    border: '1px solid',
                    borderColor: 'secondary.main'
                  }}
                >
                  <WishlistIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Chip label={`ISBN: ${book.isbn}`} variant="outlined" />
              <Chip label={`Published: ${book.publishYear}`} variant="outlined" />
            </Box>
          </Box>
        </Grid>

        {/* Enhanced Reviews Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">
                Customer Reviews
              </Typography>
              <Chip 
                icon={<ReadMoreIcon />} 
                label={`${book.ratings.length} Total Reviews`} 
                color="secondary" 
                variant="outlined" 
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            {book.ratings.map((rating, index) => (
              <Box key={index} sx={{ mb: 3, p: 2, borderRadius: 2, backgroundColor: 'action.hover' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Rating value={rating.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {ratingUsers[rating.user] || "Anonymous"}
                  </Typography>
                </Box>
                <Typography variant="body2">{rating.review}</Typography>
              </Box>
            ))}

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Write a Review</Typography>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
                sx={{ mb: 2 }}
              />
              <TextField
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                label="Your Review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmitReview}
                size="large"
              >
                Submit Review
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookDetailsPage;