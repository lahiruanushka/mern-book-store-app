import express from 'express';
import { orderController } from '../controllers/orderController.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, orderController.createOrder);
router.get('/my-orders', auth, orderController.getUserOrders);
router.put('/:id/status', auth, isAdmin, orderController.updateOrderStatus);
router.get('/', auth, isAdmin, orderController.getAllOrders);

export default router;
