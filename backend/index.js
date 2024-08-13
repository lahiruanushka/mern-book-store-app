import express from "express";
import loadEnv from "./config/dotenv.js";
import connectDB from "./config/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import logger from "./utils/logger.js";
import cors from 'cors'; 

loadEnv();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api", bookRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start the server
connectDB().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`App is listening to port: ${port}`);
  });
});
