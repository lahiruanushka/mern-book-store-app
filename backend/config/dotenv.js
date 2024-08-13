import dotenv from "dotenv";

const loadEnv = () => {
  dotenv.config();
  
  if (!process.env.PORT || !process.env.MONGODB_URI) {
    throw new Error("Missing environment variables.");
  }
};

export default loadEnv;
