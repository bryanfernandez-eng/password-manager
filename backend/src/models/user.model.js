import mongoose from "mongoose";
import validator from "validator";
const { isEmail } = validator;

// Schema for storing password entries
const savedPasswordSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true,
    },
    siteUrl: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    
      validate: [isEmail, "Invalid Email"],
    },
    password: {
      type: String,       // This will store the encrypted password
      required: true,
    },
    notes: {
      type: String,
      default: " ",       // Default empty string for notes
    },
  },
  { timestamps: true }    // Adds createdAt and updatedAt timestamps
);

// Main user schema for app users
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,    // Force lowercase for consistency
      trim: true,         // Remove whitespace
      validate: [isEmail, "Invalid Email"],
      unique: true,       // Ensures no duplicate emails
    },
    password: {
      type: String,       // User's hashed password
      required: true,
    },
    savedPasswords: {
      type: [savedPasswordSchema],  // Array of password entries
      default: [],                  // Start with empty array
    },
  },
  { timestamps: true }    // Adds createdAt and updatedAt timestamps
);

// Create and export the User model
export const User = mongoose.model("User", userSchema);