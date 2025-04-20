import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { transporter } from "../utils/emailService.js";

export const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { name, email, password, address } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        address,
        verified: false,
        verificationToken,
        verificationExpires,
      });

      await user.save();

      // Send verification email
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

      console.log("Verification URL:", verificationUrl); // Log the verification URL

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email Address",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333;">Welcome to BookWhiz!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Verify Email</a>
            </div>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
            <p>Best regards,<br>BookWhiz Team</p>
          </div>
        `,
      };

      // Use the transporter from the service
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");

      res.status(201).json({
        message:
          "Registration successful! Please check your email to verify your account.",
        emailSent: true,
        userEmail: email,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Verify email
  verifyEmail: async (req, res) => {
    try {
      const { token } = req.params;

      const user = await User.findOne({
        verificationToken: token,
        verificationExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          message: "Invalid or expired verification token",
          verified: false,
        });
      }

      // Update user verification status
      user.verified = true;
      user.verificationToken = undefined;
      user.verificationExpires = undefined;
      await user.save();

      return res.status(200).json({
        message: "Email verified successfully! You can now log in.",
        verified: true,
      });
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Resend verification email
  resendVerification: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      if (user.verified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      user.verificationToken = verificationToken;
      user.verificationExpires = verificationExpires;
      await user.save();

      // Send verification email
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email Address",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333;">Email Verification</h2>
            <p>Hi ${user.name},</p>
            <p>Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Verify Email</a>
            </div>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>Best regards,<br>Your Application Team</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        message: "Verification email resent successfully!",
        emailSent: true,
      });
    } catch (error) {
      console.error("Resend verification error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Check if user has verified their email
      if (!user.verified) {
        return res.status(401).json({
          message: "Please verify your email before logging in",
          verified: false,
          email: user.email,
        });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        token,
        user: { id: user._id, name: user.name, email, role: user.role },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Verify token
  verifyToken: async (req, res) => {
    try {
      // The token should be verified by the auth middleware before reaching this controller
      // If the middleware passes, the token is valid

      // Get user information from the middleware-attached user object
      const userId = req.user.userId;

      // Fetch user details (optional - you might want to return updated user data)
      const user = await User.findById(userId).select(
        "-password -verificationToken -verificationExpires"
      );

      if (!user) {
        return res
          .status(404)
          .json({ valid: false, message: "User not found" });
      }

      // Check if user account is still active/verified
      if (!user.verified) {
        return res.status(401).json({
          valid: false,
          message: "Account not verified",
          email: user.email,
        });
      }

      return res.status(200).json({
        valid: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(500).json({ valid: false, message: error.message });
    }
  },

  // Request password reset
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User with this email doesn't exist" });
      }

      // Generate password reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetExpires = Date.now() + 60 * 60 * 1000; // 1 hour

      // Save the hashed token to the database
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetExpires;
      await user.save();

      // Create reset URL
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      // Send email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request - BookWhiz",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Password Reset</h2>
          <p>Hi ${user.name},</p>
          <p>You recently requested to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>Best regards,<br>BookWhiz Team</p>
        </div>
      `,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        message: "Password reset email sent successfully",
        emailSent: true,
      });
    } catch (error) {
      console.error("Password reset request error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Validate reset token
  validateResetToken: async (req, res) => {
    try {
      const { token } = req.params;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          message: "Password reset token is invalid or has expired",
          valid: false,
        });
      }

      res.status(200).json({
        message: "Token is valid",
        valid: true,
      });
    } catch (error) {
      console.error("Reset token validation error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Reset password
  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          message: "Password reset token is invalid or has expired",
          reset: false,
        });
      }

      // Update password
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      // Send confirmation email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset Successful - BookWhiz",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Password Reset Successful</h2>
          <p>Hi ${user.name},</p>
          <p>Your password has been successfully reset. If you did not make this change, please contact our support team immediately.</p>
          <p>Best regards,<br>BookWhiz Team</p>
        </div>
      `,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        message:
          "Password has been reset successfully. You can now log in with your new password.",
        reset: true,
      });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: error.message });
    }
  },
};
