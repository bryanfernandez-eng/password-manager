import express from "express";
import {
  forgotPassword,
  resetPassword,
  verifyResetCode,
} from "../controllers/reset.controller.js";

const router = express.Router();

// POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// POST /api/auth/verify-reset-code
router.post("/verify-reset-code", verifyResetCode);

// POST /api/auth/reset-password
router.post("/reset-password", resetPassword);

export default router;