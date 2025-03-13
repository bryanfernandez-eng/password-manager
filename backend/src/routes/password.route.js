import express from "express";
import {
addPassword,
deletePassword,
deleteAllPasswords,
getPassword
} from "../controllers/password.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", protectRoute, addPassword);

router.delete("/", protectRoute, deletePassword);

router.delete("/all", protectRoute, deleteAllPasswords);

router.get("/:siteName/:email", protectRoute, getPassword); 


export default router;
