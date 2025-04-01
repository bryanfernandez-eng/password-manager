import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth.route.js";
import passwordRouter from "./routes/password.route.js";

import cors from "cors";
import helmet from "helmet"
import morgan from "morgan" 

import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser"

// Initialize Express app
const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser());  // Parse cookies for auth

// Security and logging middleware
app.use(helmet()); // Helps secure Express apps with various HTTP headers
app.use(morgan("dev")); // HTTP request logger

// Set port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// CORS configuration for frontend communication
app.use(cors({
  origin: 'http://localhost:5173',  // Allow requests from frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],         // Allowed HTTP methods
  credentials: true,                // Allow cookies to be sent
}));

// API routes setup
app.use("/api/auth", authRouter);         // Authentication routes
app.use("/api/password", passwordRouter)  // Password manager routes

// Start the server and connect to database
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
  connectDB(); // Connect to MongoDB database
});