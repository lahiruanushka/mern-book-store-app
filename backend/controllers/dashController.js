import Book from "../models/bookModel.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";

export const dashController = {
  // Dashboard Statistics
  getStats: async (req, res) => {
    try {
      const totalBooks = await Book.countDocuments();
      const totalUsers = await User.countDocuments();
      const totalOrders = await Order.countDocuments();
      const pendingOrders = await Order.countDocuments({ status: "pending" });

      // Get revenue stats
      const revenue = await Order.aggregate([
        { $match: { status: { $in: ["completed", "shipped"] } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]);

      // Recent orders
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email");

      res.json({
        totalBooks,
        totalUsers,
        totalOrders,
        pendingOrders,
        revenue: revenue.length > 0 ? revenue[0].total : 0,
        recentOrders,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
