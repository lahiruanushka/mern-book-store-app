import express from "express";
import { userController } from "../controllers/userController.js";
import { auth, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", userController.getUserById);

router.get("/", auth, isAdmin, userController.getAllUsers);
router.put("/:id", auth, isAdmin, userController.updateUser);
router.delete("/:id", auth, isAdmin, userController.deleteUser);
router.post("/", auth, isAdmin, userController.addUser);

export default router;
