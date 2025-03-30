import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const profileController = {
  // Get current user's profile
  getMyProfile: async (req, res) => {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      // Get user ID from authenticated request
      const userId = req.user.userId;

      // Find user by ID and exclude password
      const user = await User.findById(userId).select("-password").lean();

      if (!user) {
        return res.status(404).json({ message: "User profile not found" });
      }

      // Calculate account age in days
      const accountAgeDays = Math.floor(
        (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
      );

      // Construct the response object
      const userProfile = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        __v: user.__v,
        accountAgeDays,
        address: user.address || {
          street: "Not provided",
          city: "Not provided",
          state: "Not provided",
          zipCode: "Not provided",
          country: "Not provided",
        },
      };

      return res.status(200).json(userProfile);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching profile", error: error.message });
    }
  },

  // Update current user's profile
  updateMyProfile: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { name, address } = req.body;

      // Create update object with allowed fields
      const updateData = {};
      if (name) updateData.name = name;
      if (address) updateData.address = address;

      // Update the user profile
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!updatedUser) {
        return res.status(404).json({
          message: "User profile not found",
        });
      }

      return res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error updating profile",
        error: error.message,
      });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      // Validate password inputs
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: "Current password and new password are required",
        });
      }

      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Current password is incorrect",
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({
        message: "Password changed successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: "Error changing password",
        error: error.message,
      });
    }
  },

  // Update email address
  updateEmail: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { newEmail, password } = req.body;

      // Validate inputs
      if (!newEmail || !password) {
        return res.status(400).json({
          message: "New email and password are required",
        });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email: newEmail });
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({
          message: "Email already in use by another account",
        });
      }

      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Password is incorrect",
        });
      }

      // Update email
      user.email = newEmail;
      await user.save();

      // Return updated user without password
      const updatedUser = user.toObject();
      delete updatedUser.password;

      return res.status(200).json({
        message: "Email updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error updating email",
        error: error.message,
      });
    }
  },

  // Delete own account
  deleteMyAccount: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { password } = req.body;

      // Validate password
      if (!password) {
        return res.status(400).json({
          message: "Password is required to delete account",
        });
      }

      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Password is incorrect",
        });
      }

      // Delete user
      await User.findByIdAndDelete(userId);

      return res.status(200).json({
        message: "Account deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: "Error deleting account",
        error: error.message,
      });
    }
  },

  // Update shipping address
  updateAddress: async (req, res) => {
    try {
      const userId = req.user.userId;

      const { street, city, state, zipCode, country } = req.body;

      // Validate address data
      if (!street || !city || !state || !zipCode || !country) {
        return res.status(400).json({
          message: "All address fields are required",
        });
      }

      // Update user address
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          address: {
            street,
            city,
            state,
            zipCode,
            country,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("address");

      if (!updatedUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        message: "Address updated successfully",
        address: updatedUser.address,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error updating address",
        error: error.message,
      });
    }
  },
};
