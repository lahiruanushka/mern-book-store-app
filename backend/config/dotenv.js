import dotenv from "dotenv";

const loadEnv = () => {
  const result = dotenv.config();

  if (result.error) {
    console.error("Error loading .env file:", result.error);
  }

  if (
    !process.env.PORT ||
    !process.env.MONGODB_URI ||
    !process.env.JWT_SECRET ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASSWORD ||
    !process.env.FRONTEND_URL
  ) {
    throw new Error("Missing environment variables.");
  }

  console.log("Email User:", process.env.EMAIL_USER);
  console.log("Email Password exists:", !!process.env.EMAIL_PASSWORD);
};

export default loadEnv;
