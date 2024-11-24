import express from 'express';
import { cartController } from '../controllers/cartController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, cartController.getCart);
router.post('/add', auth, cartController.addToCart);
router.delete('/item/:bookId', auth, cartController.removeFromCart);
router.put('/item/:bookId', auth, cartController.updateCartItemQuantity);
router.delete('/clear', auth, cartController.clearCart);

export default router;
