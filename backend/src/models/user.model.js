import mongoose from "mongoose";

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
        required: true 
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
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
