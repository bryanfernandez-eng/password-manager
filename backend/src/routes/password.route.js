// backend/src/routes/password.route.js
import express from "express";
import {
  addPassword,
  deletePassword,
  deleteAllPasswords,
  getPassword,
  getAllPasswords, 
  editPassword
} from "../controllers/password.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET http://localhost:3000/api/password/all
router.get("/all", protectRoute, getAllPasswords);

// POST http://localhost:3000/api/password/add
router.post("/add", protectRoute, addPassword);

// PUT http://localhost:3000/api/password/edit
router.put("/edit", protectRoute, editPassword);

// DELETE http://localhost:3000/api/password/
router.delete("/", protectRoute, deletePassword);

// DELETE http://localhost:3000/api/password/all
router.delete("/all", protectRoute, deleteAllPasswords);

// GET http://localhost:3000/api/password/:siteName/:email
router.get("/:siteName/:email", protectRoute, getPassword);



export default router;