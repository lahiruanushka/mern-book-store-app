import Book from "../models/bookModel.js"

export const bookController = {
  // Get all books
  getAllBooks: async (req, res) => {
    try {
      const books = await Book.find();
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add new book (admin only)
  addBook: async (req, res) => {
    try {
      const book = new Book(req.body);
      await book.save();
      res.status(201).json(book);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update book (admin only)
  updateBook: async (req, res) => {
    try {
      const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!book) return res.status(404).json({ message: 'Book not found' });
      res.json(book);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Add rating
  addRating: async (req, res) => {
    try {
      const { rating, review } = req.body;
      const book = await Book.findById(req.params.id);
      
      if (!book) return res.status(404).json({ message: 'Book not found' });
      
      book.ratings.push({
        user: req.user.userId,
        rating,
        review
      });
      
      await book.save();
      res.json(book);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

