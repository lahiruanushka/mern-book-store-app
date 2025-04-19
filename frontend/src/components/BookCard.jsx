import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Rating,
  Box,
  IconButton,
  Tooltip,
  Zoom,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LoginPrompt from "./LoginPrompt"; 

// Styled components (same as before)
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

const ImageWrapper = styled(Box)({
  position: "relative",
  overflow: "hidden",
  "&:hover .image-overlay": {
    opacity: 1,
  },
});

const ImageOverlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  opacity: 0,
  transition: "opacity 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const BookmarkButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 8,
  right: 8,
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 1)",
    transform: "scale(1.1)",
  },
}));


const BookCard = ({ book, onAddToCart, onWishlistToggle }) => {
  const fallbackImage =
    "https://via.placeholder.com/300x450?text=No+Image+Available";

  // State for login prompt
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  // Get user auth state from Redux store
  const isLoggedIn = useSelector((state) => state.auth?.isAuthenticated || false);

  // Get wishlist items from Redux store
  const { items: wishlistItems } = useSelector(
    (state) => state.wishlist || { items: [] }
  );

  // Check if current book is in wishlist
  const isInWishlist = wishlistItems?.some((item) => item.bookId === book._id);

  // Calculate average rating from the ratings array
  const calculateAverageRating = () => {
    if (!book.ratings || book.ratings.length === 0) return 0;
    const totalRating = book.ratings.reduce(
      (sum, item) => sum + item.rating,
      0
    );
    return totalRating / book.ratings.length;
  };

  const averageRating = calculateAverageRating();
  const ratingCount = book.ratings?.length || 0;

  const handleAddToCart = async () => {
    if (!book || !book._id) {
      console.error("Invalid book data:", book);
      return;
    }

    if (!isLoggedIn) {
      // Open login prompt with cart action type
      setActionType("cart");
      setLoginPromptOpen(true);
      return;
    }

    onAddToCart(book._id);
  };

  const handleWishlistToggle = () => {
    if (!book || !book._id) {
      console.error("Invalid book data:", book);
      return;
    }

    if (!isLoggedIn) {
      // Open login prompt with wishlist action type
      setActionType("wishlist");
      setLoginPromptOpen(true);
      return;
    }

    onWishlistToggle(book._id, book.title, book.price, isInWishlist);
  };

  // Close login prompt
  const handleCloseLoginPrompt = () => {
    setLoginPromptOpen(false);
  };

  return (
    <>
      <StyledCard>
        <ImageWrapper>
          <CardMedia
            component="img"
            height="240"
            image={book.imageUrl || fallbackImage}
            alt={book.title}
            sx={{
              objectFit: "cover",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />

          <Link to={`/books/${book._id}`} style={{ textDecoration: "none" }}>
            <ImageOverlay className="image-overlay">
              <Tooltip title="Quick view" arrow TransitionComponent={Zoom}>
                <IconButton
                  sx={{
                    color: "white",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </ImageOverlay>
          </Link>

          <Tooltip
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            arrow
            TransitionComponent={Zoom}
          >
            <BookmarkButton onClick={handleWishlistToggle}>
              {isInWishlist ? (
                <BookmarkIcon color="primary" />
              ) : (
                <BookmarkBorderIcon />
              )}
            </BookmarkButton>
          </Tooltip>
        </ImageWrapper>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {book.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            By {book.author}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Rating
              name="read-only"
              value={averageRating}
              precision={0.1}
              readOnly
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {averageRating.toFixed(1)} ({ratingCount} ratings)
            </Typography>
          </Box>

          <Typography
            variant="h6"
            color="primary"
            sx={{
              mb: 2,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
            }}
          >
            ${book.price}
            {book.originalPrice && book.originalPrice > book.price && (
              <Typography
                component="span"
                sx={{
                  textDecoration: "line-through",
                  color: "text.secondary",
                  ml: 1,
                  fontSize: "0.9em",
                }}
              >
                ${book.originalPrice}
              </Typography>
            )}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            disabled={book.stockQuantity === 0}
            onClick={handleAddToCart}
            sx={{
              height: 48,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 4,
              },
            }}
            startIcon={<ShoppingCartIcon />}
          >
            {book.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>

          {book.stockQuantity <= 5 && book.stockQuantity > 0 && (
            <Typography
              variant="caption"
              color="error"
              sx={{
                display: "block",
                mt: 1,
                textAlign: "center",
              }}
            >
              Only {book.stockQuantity} left in stock!
            </Typography>
          )}
        </CardContent>
      </StyledCard>

      {/* Login Prompt Dialog */}
      <LoginPrompt
        open={loginPromptOpen}
        onClose={handleCloseLoginPrompt}
        actionType={actionType}
      />
    </>
  );
};

export default BookCard;
