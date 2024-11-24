import express from "express";
import loadEnv from "./config/dotenv.js";
import connectDB from "./config/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import { errorHandler } from "./middleware/errorMiddleware.js";
import logger from "./utils/logger.js";
import cors from 'cors'; 

loadEnv();
const port = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);


// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start the server
connectDB().then(() => {
  app.listen(port, () => {
    logger.info(`App is listening to port: ${port}`);
  });
});
