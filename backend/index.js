import express from "express";
import connectDB from "./config/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import dashRoutes from "./routes/dashRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import logger from "./utils/logger.js";
import cors from "cors";
import { verifyConnection } from "./utils/emailService.js";
import loadEnv from "./config/dotenv.js";

loadEnv();

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashRoutes);

// Error handling middleware
app.use(errorHandler);

// connecting to MongoDB before starting the server:
connectDB().then(async () => {
  // Start server
  app.listen(port, () => {
    logger.info(`App is listening to port: ${port}`);
  });

  // Verify email connection
  await verifyConnection();
});
