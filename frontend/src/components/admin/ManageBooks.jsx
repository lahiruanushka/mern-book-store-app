import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ImportExport as ImportExportIcon,
} from '@mui/icons-material';

const ManageBooks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      stock: 15,
      price: "$19.99",
      category: "Classic Fiction",
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      stock: 20,
      price: "$15.99",
      category: "Science Fiction",
    },
    {
      id: 3,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      stock: 8,
      price: "$12.99",
      category: "Classic Fiction",
    },
    {
      id: 4,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      stock: 25,
      price: "$21.99",
      category: "Fantasy",
    },
  ];

  const getStockStatus = (stock) => {
    if (stock <= 5) return { label: 'Low Stock', color: 'error' };
    if (stock <= 10) return { label: 'Medium Stock', color: 'warning' };
    return { label: 'In Stock', color: 'success' };
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock = stockFilter === 'all' ||
                        (stockFilter === 'low' && book.stock <= 5) ||
                        (stockFilter === 'medium' && book.stock > 5 && book.stock <= 10) ||
                        (stockFilter === 'high' && book.stock > 10);
    return matchesSearch && matchesStock;
  });

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Book Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
        >
          Add New Book
        </Button>
      </Stack>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Stock Level</InputLabel>
              <Select
                value={stockFilter}
                label="Stock Level"
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="low">Low Stock</MenuItem>
                <MenuItem value="medium">Medium Stock</MenuItem>
                <MenuItem value="high">High Stock</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<ImportExportIcon />}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Export
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((book) => (
                <TableRow
                  key={book.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell>#{book.id.toString().padStart(3, '0')}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {book.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {book.category}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${book.stock} - ${getStockStatus(book.stock).label}`}
                      color={getStockStatus(book.stock).color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{book.price}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBooks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default ManageBooks;