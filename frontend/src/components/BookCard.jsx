import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Rating,
  Box
} from '@mui/material';
import fallbackImage from "../assets/Open Book Cartoon Clipart Vector, Cartoon Blue Open Book Illustration, Book, Textbook, Learn PNG Image For Free Download.jfif"

const BookCard = ({ book, onAddToCart }) => {

   const handleAddToCart = async () => {
    if (!book || !book._id) {
      console.error('Invalid book data:', book);
      return;
    }
    onAddToCart(book._id);
  };
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={book.imageUrl ||fallbackImage}
        alt={book.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2">
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          By {book.author}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          ${book.price}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Rating value={book.rating || 0} readOnly precision={0.5} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            ({book.ratingCount || 0})
          </Typography>
        </Box>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={book.stockQuantity === 0}
            onClick={handleAddToCart}
        >
          {book.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;