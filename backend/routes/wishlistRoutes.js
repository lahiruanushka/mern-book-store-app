import express from "express";
import { auth } from '../middleware/auth.js';
import { wishlistController } from "../controllers/wishlistController.js";
const router = express.Router();

router.get('/', auth, wishlistController.getWishlist);
router.post('/add', auth, wishlistController.addToWishlist );
router.delete('/remove/:bookId', auth, wishlistController.removeFromWishlist );

export default router;