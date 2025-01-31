import express from "express";
import {
  signup,
  login,
  logout,
  checkAuth,
  deleteAccount,
  verifyCode, 
  updateAccount
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST http://localhost:3000/api/auth/signup
router.post("/signup", signup);

// POST http://localhost:3000/api/auth/verify
router.post("/verify", verifyCode);

// POST http://localhost:3000/api/auth/login
router.post("/login", login);

// POST http://localhost:3000/api/auth/logout
router.post("/logout", protectRoute, logout);

// GET http://localhost:3000/api/auth/status
router.get("/status", protectRoute, checkAuth);

// DELETE http://localhost:3000/api/auth/me
router.delete("/me", protectRoute, deleteAccount);

// PUT http://localhost:3000/api/auth/update
router.put("/update", protectRoute, updateAccount);

export default router;
