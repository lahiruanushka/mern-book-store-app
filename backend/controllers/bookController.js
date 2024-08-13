import { Book } from "../models/bookModel.js";

export const createBook = async (req, res) => {
  const { title, author, publishYear } = req.body;
  const book = await Book.create({ title, author, publishYear });
  res.status(201).json(book);
};

export const getAllBooks = async (req, res) => {
  const books = await Book.find({});
  res.status(200).json(books);
};

export const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404).json({ message: "Book not found" });
    return;
  }
  res.status(200).json(book);
};

export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, publishYear } = req.body;

  const book = await Book.findByIdAndUpdate(
    id,
    { title, author, publishYear },
    { new: true, runValidators: true }
  );

  if (!book) {
    res.status(404).json({ message: "Book not found" });
    return;
  }

  res.status(200).json(book);
};

export const deleteBook = async (req, res) => {
  const { id } = req.params;
  const book = await Book.findByIdAndDelete(id);

  if (!book) {
    res.status(404).json({ message: "Book not found" });
    return;
  }

  res.status(200).json({ message: "Book deleted successfully" });
};
