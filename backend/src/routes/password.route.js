import express from "express";
import {
addPassword,
deletePassword,
deleteAllPasswords
} from "../controllers/password.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST http://localhost:3000/api/password/add
router.post("/add", protectRoute, addPassword);

router.delete("/", protectRoute, deletePassword);

router.delete("/all", protectRoute, deleteAllPasswords);


export default router;
