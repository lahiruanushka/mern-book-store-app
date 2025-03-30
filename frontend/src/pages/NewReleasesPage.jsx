import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Snackbar,
  Alert,
  Typography,
  Paper,
  Skeleton,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Pagination,
  Tabs,
  Tab,
  Chip,
} from "@mui/material";
import { NewReleases, AutoAwesome, MenuBook, Clear } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { books, cart } from "../services/api";
import BookCard from "../components/BookCard";
import { useDispatch } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../features/wishlistSlice";

const BOOKS_PER_PAGE = 12;

const NewReleasesPage = () => {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [page, setPage] = useState(1);
  const [timeframe, setTimeframe] = useState("week");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  useEffect(() => {
    fetchNewReleases();
  }, [timeframe]);

  const fetchNewReleases = async () => {
    try {
      setLoading(true);
      // getting all books and filtering
      const response = await books.getAll();

      // Sort by publication date (newest first)
      const sortedBooks = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Filter based on timeframe
      const now = new Date();
      const filtered = sortedBooks.filter((book) => {
        const bookDate = new Date(book.createdAt);
        const diffTime = Math.abs(now - bookDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (timeframe === "week") return diffDays <= 7;
        if (timeframe === "month") return diffDays <= 30;
        if (timeframe === "quarter") return diffDays <= 90;
        return true; // Show all for "all" timeframe
      });

      setNewReleases(filtered);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";
    setNotification({
      open: true,
      message: errorMessage,
      severity: "error",
    });
  };

  const handleAddToCart = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setNotification({
          open: true,
          message: "Please log in to add items to cart",
          severity: "warning",
        });
        navigate("/login");
        return;
      }

      if (!bookId) throw new Error("Invalid book ID");

      await cart.addItem(bookId, 1);

      setNotification({
        open: true,
        message: "Book added to cart!",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.message || "Failed to add book to cart. Please try again.",
        severity: "error",
      });
    }
  };

  const handleWishlistToggle = async (bookId, title, price, isInWishlist) => {
    try {
      if (!isValidObjectId(bookId)) {
        throw new Error("Invalid book ID format");
      }

      if (isInWishlist) {
        await dispatch(removeFromWishlist(bookId)).unwrap();

        setNotification({
          open: true,
          message: "Book removed from wishlist!",
          severity: "success",
        });
      } else {
        await dispatch(
          addToWishlist({
            bookId,
            title,
            price,
          })
        ).unwrap();

        setNotification({
          open: true,
          message: "Book added to wishlist!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      setNotification({
        open: true,
        message:
          error.message || "Failed to update wishlist. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleTimeframeChange = (event, newValue) => {
    setTimeframe(newValue);
    setPage(1); // Reset to first page when changing timeframe
  };

  const totalPages = Math.ceil(newReleases.length / BOOKS_PER_PAGE);
  const displayedBooks = newReleases.slice(
    (page - 1) * BOOKS_PER_PAGE,
    page * BOOKS_PER_PAGE
  );

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(8)].map((_, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Card>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={24} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" width={80} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      case "quarter":
        return "This Quarter";
      default:
        return "All Time";
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 2, display: "flex", alignItems: "center" }}
        >
          <NewReleases sx={{ mr: 1, color: "primary.main" }} />
          New Releases
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Discover the latest books added to our collection
        </Typography>
      </Box>

      {/* Timeframe Tabs */}
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Tabs
          value={timeframe}
          onChange={handleTimeframeChange}
          centered
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab label="This Week" value="week" />
          <Tab label="This Month" value="month" />
          <Tab label="This Quarter" value="quarter" />
          <Tab label="All New Titles" value="all" />
        </Tabs>
      </Paper>

      {/* Featured Section for "week" timeframe */}
      {timeframe === "week" && displayedBooks.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <AutoAwesome sx={{ mr: 1 }} />
            <Typography variant="h5">Featured New Release</Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src={displayedBooks[0].coverImage || "/placeholder-book.jpg"}
                alt={displayedBooks[0].title}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: 400,
                  objectFit: "cover",
                  borderRadius: 1,
                  boxShadow: 3,
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                {displayedBooks[0].title}
              </Typography>
              <Typography variant="h6" gutterBottom>
                by {displayedBooks[0].author}
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 2 }}>
                {displayedBooks[0].category?.map((cat, idx) => (
                  <Chip
                    key={idx}
                    label={cat}
                    size="small"
                    sx={{ color: "white", borderColor: "white" }}
                    variant="outlined"
                  />
                ))}
              </Box>

              <Typography variant="body1" sx={{ mb: 3 }}>
                {displayedBooks[0].description?.substring(0, 300)}
                {displayedBooks[0].description?.length > 300 ? "..." : ""}
              </Typography>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleAddToCart(displayedBooks[0]._id)}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  sx={{ color: "white", borderColor: "white" }}
                  onClick={() => navigate(`/books/${displayedBooks[0]._id}`)}
                >
                  View Details
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Results Summary */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          {getTimeframeLabel()}{" "}
          <Chip label={newReleases.length} size="small" color="primary" />
        </Typography>
      </Box>

      {/* Book Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : displayedBooks.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {/* Skip the first book if it's already shown in the featured section */}
            {(timeframe === "week"
              ? displayedBooks.slice(1)
              : displayedBooks
            ).map((book) => (
              <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
                <BookCard
                  book={book}
                  onAddToCart={handleAddToCart}
                  onWishlistToggle={handleWishlistToggle}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          )}
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <MenuBook sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No new releases found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Check back soon for new titles or try a different timeframe
          </Typography>
          <Button variant="contained" onClick={() => setTimeframe("all")}>
            View All Books
          </Button>
        </Paper>
      )}

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewReleasesPage;
