import mongoose from "mongoose";
import validator from "validator";
const { isEmail } = validator;

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
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: " ",
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
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
    profilePictureUrl: {
      type: String,
      default: " ",
    },
    password: {
      type: String,
      required: true,
    },
    savedPasswords: {
      type: [savedPasswordSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
