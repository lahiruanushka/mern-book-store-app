import express from "express";
import { authController } from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);

// Protected routes - require valid token
router.get("/verify-token", auth, authController.verifyToken);

export default router;
