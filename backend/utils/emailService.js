import nodemailer from "nodemailer";
import loadEnv from "../config/dotenv.js";
import logger from "./logger.js";

loadEnv();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const verifyConnection = async () => {
  try {
    await transporter.verify();
    logger.info("Email connection verified successfully");
    return true;
  } catch (error) {
    logger.error("Email connection verification failed:", error);
    return false;
  }
};

export { transporter, verifyConnection };
