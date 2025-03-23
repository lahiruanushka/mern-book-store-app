import express from "express";
import { auth, isAdmin } from "../middleware/auth.js";
import { dashController } from "../controllers/dashController.js";

const router = express.Router();

router.get("/stats", auth, isAdmin, dashController.getStats);

export default router;
