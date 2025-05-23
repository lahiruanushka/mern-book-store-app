import express from "express";
import { bookController } from "../controllers/bookController.js";
import { auth, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);
router.post("/", auth, isAdmin, bookController.addBook);
router.put("/:id", auth, isAdmin, bookController.updateBook);
router.delete("/:id", auth, isAdmin, bookController.deleteBook);
router.post("/:id/rating", auth, bookController.addRating);

export default router;
