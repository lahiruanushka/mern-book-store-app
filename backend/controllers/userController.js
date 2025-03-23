import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

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

      // Find user by ID and exclude the password field
      const user = await User.findById(userId)
        .select("-password") // Exclude the password field
        .lean(); // Convert to plain JavaScript object

      // Check if user exists
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Return user data without password
      return res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  //  Get all users (without passwords)
  getAllUsers: async (req, res) => {
    try {
      // Find all users, excluding the password field
      const users = await User.find()
        .select("-password") // Exclude password field
        .lean(); // Convert to plain JavaScript object

      return res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching users",
        error: error.message,
      });
    }
  },

  // Update user data
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const updateData = req.body;

      // Validate userId
      if (!userId) {
        return res.status(400).json({
          message: "User ID is required",
        });
      }

      // Prevent updating certain fields
      delete updateData.password;
      delete updateData.email;
      delete updateData.role;

      // Find and update user
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Run model validations
      }).select("-password"); // Exclude password from response

      if (!updatedUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({
        message: "Error updating user",
        error: error.message,
      });
    }
  },

  // New method: Delete user by ID
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;

      // Validate userId
      if (!userId) {
        return res.status(400).json({
          message: "User ID is required",
        });
      }

      // Find and delete user
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        message: "User deleted successfully",
        deletedUser: {
          id: deletedUser._id,
          name: deletedUser.name,
        },
      });
    } catch (error) {
      res.status(400).json({
        message: "Error deleting user",
        error: error.message,
      });
    }
  },

  // Add new user account
  addUser: async (req, res) => {
    try {
      const { name, email, password, address, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User with this email already exists",
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        address,
        role: role || "customer", // Default to customer if no role specified
      });

      // Save user
      const savedUser = await newUser.save();

      // Return user without password
      const userResponse = savedUser.toObject();
      delete userResponse.password;

      return res.status(201).json(userResponse);
    } catch (error) {
      res.status(400).json({
        message: "Error creating user",
        error: error.message,
      });
    }
  },
};
