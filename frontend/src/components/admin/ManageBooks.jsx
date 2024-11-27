import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
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
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ImportExport as ImportExportIcon,
} from "@mui/icons-material";
import { books as booksService } from "../../services/api";
import AddEditBookModal from "./AddEditBookModal";

const ManageBooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Simulated API service (replace with actual service)
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksService.getAll();
      setBooks(response.data);
    } catch (error) {
      console.error(error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const getStockStatus = (stock) => {
    if (stock <= 5) return { label: "Low Stock", color: "error" };
    if (stock <= 10) return { label: "Medium Stock", color: "warning" };
    return { label: "In Stock", color: "success" };
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && book.stockQuantity <= 5) ||
      (stockFilter === "medium" &&
        book.stockQuantity > 5 &&
        book.stockQuantity <= 10) ||
      (stockFilter === "high" && book.stockQuantity > 10);
    return matchesSearch && matchesStock;
  });

  const handleSaveBook = (bookData) => {
    // Implement your save logic here
    console.log(bookData);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ maxWidth: 1200, margin: "auto", p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h4" component="h1">
            Book Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            color="primary"
            onClick={handleOpenModal}
          >
            Add New Book
          </Button>
        </Stack>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
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
                sx={{ whiteSpace: "nowrap" }}
              >
                Export
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <TableContainer component={Paper} elevation={1}>
          {filteredBooks.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 4,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No books found
              </Typography>
            </Box>
          ) : (
            <>
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
                        key={book._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": { backgroundColor: "action.hover" },
                        }}
                      >
                        <TableCell>#{book._id.slice(-4)}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {book.title}
                          </Typography>
                        </TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {book.category.join(", ")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${book.stockQuantity} - ${
                              getStockStatus(book.stockQuantity).label
                            }`}
                            color={getStockStatus(book.stockQuantity).color}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>${book.price.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
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
            </>
          )}
        </TableContainer>
      </Box>

      <AddEditBookModal
        open={isModalOpen}
        onClose={handleCloseModal}
        // Optional: pass initial data if editing an existing book
        // initialData={existingBookData}
      />
    </>
  );
};

export default ManageBooks;
