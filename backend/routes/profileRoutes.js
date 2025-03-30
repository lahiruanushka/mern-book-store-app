import express from "express";
import { profileController } from "../controllers/profileController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication middleware to all profile routes
// This ensures only logged-in users can access these endpoints
router.use(auth);

// Profile management routes
router.get("/me", profileController.getMyProfile);
router.put("/me", profileController.updateMyProfile);

// Password management
router.put("/change-password", profileController.changePassword);

// Email management
router.put("/update-email", profileController.updateEmail);

// Account deletion
router.delete("/delete-account", profileController.deleteMyAccount);

// Address management
router.put("/address", profileController.updateAddress);

export default router;
