import User from "../models/userModel.js";

export const userController = {
  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;

      // Validate userId
      if (!userId) {
        return res.status(400).json({
          message: "User ID is required",
        });
      }

      // Find user by ID and select only the name
      const user = await User.findById(userId)
        .select("name") // Only select the name field
        .lean(); // Convert to plain JavaScript object

      // Check if user exists
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Return only the user's name
      return res.status(200).json({ name: user.name });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
};
