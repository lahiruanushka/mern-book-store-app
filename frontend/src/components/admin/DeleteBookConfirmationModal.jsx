import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { books } from "../../services/api";

const DeleteBookConfirmationModal = ({ open, onClose, book }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteBook = async () => {
    setIsDeleting(true);
    try {
      await books.deleteBook(book._id);
      onClose();
    } catch (error) {
      console.error("Error deleting book:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="delete-book-dialog-title"
        aria-describedby="delete-book-dialog-description"
      >
        <DialogTitle id="delete-book-dialog-title">Delete Book</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-book-dialog-description">
            Are you sure you want to delete the book "{book?.title}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            color="primary"
            variant="outlined"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteBook}
            color="error"
            variant="contained"
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteBookConfirmationModal;
