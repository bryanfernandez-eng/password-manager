import express from "express";
import {
addPassword,
deletePassword,
deleteAllPasswords,
getPassword
} from "../controllers/password.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();


// POST http://localhost:3000/api/password/add
router.post("/add", protectRoute, addPassword);

// DELETE http://localhost:3000/api/password/
router.delete("/", protectRoute, deletePassword);

// DELETE http://localhost:3000/api/password/all
router.delete("/all", protectRoute, deleteAllPasswords);

// DELETE http://localhost:3000/api/password/:siteName/:email
router.get("/:siteName/:email", protectRoute, getPassword); 


export default router;
