import Cart from "../models/cartModel.js"
import Order from "../models/orderModel.js"
import stripe from "stripe";

export const orderController = {
  // Create order
  createOrder: async (req, res) => {
    try {
      const { shippingAddress } = req.body;
      const cart = await Cart.findOne({ user: req.user.userId }).populate('items.book');
      
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      const totalAmount = cart.items.reduce((total, item) => {
        return total + (item.book.price * item.quantity);
      }, 0);

      const order = new Order({
        user: req.user.userId,
        items: cart.items.map(item => ({
          book: item.book._id,
          quantity: item.quantity,
          priceAtTime: item.book.price
        })),
        totalAmount,
        shippingAddress
      });

      await order.save();
      
      // Clear cart after order creation
      cart.items = [];
      await cart.save();

      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get user's orders
  getUserOrders: async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.userId })
        .populate('items.book')
        .sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update order status (admin only)
  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};
