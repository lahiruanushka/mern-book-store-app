import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Book as BookIcon,
  Category as CategoryIcon,
  Numbers as NumbersIcon,
  AttachMoney as MoneyIcon,
  Link as LinkIcon,
  CloudUpload,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import storageService from "../../services/storageService";
import { books } from "../../services/api";

// Zod schema for form validation
const bookSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  description: z.string().optional(),
  publishYear: z.coerce
    .number()
    .min(1800, { message: "Publication year must be after 1800" })
    .max(new Date().getFullYear(), {
      message: "Publication year cannot be in the future",
    }),
  isbn: z
    .string()
    .regex(
      /^(?:ISBN-?13?:?\s*)?(?:\d{1,5}[-\s]?)?\d{1,7}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?[\dX]$/i,
      { message: "Invalid ISBN format" }
    ),
  price: z.coerce
    .number()
    .min(0, { message: "Price must be non-negative" })
    .max(1000, { message: "Price seems unreasonably high" }),
  stockQuantity: z.coerce
    .number()
    .min(0, { message: "Stock quantity must be non-negative" })
    .max(10000, { message: "Stock quantity seems unrealistically high" }),
  category: z.array(z.string()).optional(),
});

const AddEditBookModal = ({ open, onClose, initialData }) => {
  const [categories, setCategories] = useState(initialData?.category || []);
  const [newCategory, setNewCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData || {
      title: "",
      author: "",
      description: "",
      publishYear: new Date().getFullYear(),
      isbn: "",
      price: 0,
      stockQuantity: 0,
      category: [],
      imageUrl: "",
    },
  });

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  const removeCategory = (categoryToRemove) => {
    setCategories(categories.filter((cat) => cat !== categoryToRemove));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && validateFile(file)) {
      // Validate file size (optional)
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Maximum size is 5MB.");
        return;
      }

      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setCategories(initialData?.category || []);
    setImageFile(null);
    setImagePreview(initialData?.imageUrl || "");
  };

  const validateFile = (file) => {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please upload an image.");
      return false;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Maximum size is 5MB.");
      return false;
    }

    return true;
  };

  const onSubmit = async (data) => {
    setIsUploading(true);
    try {
      // Upload image if a new file is selected
      let imageUrl = imagePreview;
      if (imageFile) {
        const uploadedFile = await storageService.uploadFile(imageFile);
        imageUrl = await storageService.getFilePreview(uploadedFile.$id);
        console.log(uploadedFile.$id);
        console.log("Image URL:", imageUrl);
      }

      // Prepare book data
      const bookData = {
        ...data,
        price: parseFloat(data.price),
        category: categories,
        imageUrl: imageUrl,
      };

      // API call
      console.log(bookData);
      const response = await books.addBook(bookData);
      console.log(response);

      handleClose();
    } catch (error) {
      console.error("Error submitting book:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Book</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Book Title"
                      variant="outlined"
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      InputProps={{
                        startAdornment: (
                          <BookIcon sx={{ mr: 1, color: "action.active" }} />
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="author"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Author"
                      variant="outlined"
                      error={!!errors.author}
                      helperText={errors.author?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Description"
                      variant="outlined"
                      multiline
                      rows={3}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6} md={4}>
                <Controller
                  name="publishYear"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Publish Year"
                      variant="outlined"
                      error={!!errors.publishYear}
                      helperText={errors.publishYear?.message}
                      InputProps={{
                        startAdornment: (
                          <NumbersIcon sx={{ mr: 1, color: "action.active" }} />
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6} md={4}>
                <Controller
                  name="isbn"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="ISBN"
                      variant="outlined"
                      error={!!errors.isbn}
                      helperText={errors.isbn?.message}
                      InputProps={{
                        startAdornment: (
                          <LinkIcon sx={{ mr: 1, color: "action.active" }} />
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6} md={4}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Price"
                      variant="outlined"
                      error={!!errors.price}
                      helperText={errors.price?.message}
                      InputProps={{
                        startAdornment: (
                          <MoneyIcon sx={{ mr: 1, color: "action.active" }} />
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6} md={4}>
                <Controller
                  name="stockQuantity"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Stock Quantity"
                      variant="outlined"
                      error={!!errors.stockQuantity}
                      helperText={errors.stockQuantity?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={8}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <TextField
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    fullWidth
                    label="Add Categories"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <CategoryIcon sx={{ mr: 1, color: "action.active" }} />
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={addCategory}
                    disabled={!newCategory}
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      onDelete={() => removeCategory(category)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>

              {/* Image Upload Section */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUpload />}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>

                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Book Cover Preview"
                      style={{
                        maxWidth: 100,
                        maxHeight: 100,
                        objectFit: "contain",
                      }}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            color="primary"
            variant="contained"
            disabled={isUploading}
            startIcon={isUploading ? <CircularProgress size={20} /> : null}
          >
            {isUploading ? "Saving..." : "Save Book"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddEditBookModal;
