import express from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { validateBook } from "../validators/bookValidator.js";

const router = express.Router();

router.post("/books", validateBook, asyncHandler(createBook));
router.get("/books", asyncHandler(getAllBooks));
router.get("/books/:id", asyncHandler(getBookById));
router.put("/books/:id", validateBook, asyncHandler(updateBook));
router.delete("/books/:id", asyncHandler(deleteBook));

export default router;
