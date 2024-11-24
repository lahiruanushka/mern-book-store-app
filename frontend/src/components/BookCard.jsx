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

const BookCard = ({ book, onAddToCart }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={book.imageUrl || '/placeholder.jpg'}
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
          onClick={() => onAddToCart(book.id)}
        >
          {book.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;