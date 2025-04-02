import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { generateChatResponse } from "../controllers/chatbot.controller.js";

const router = express.Router(); 

router.post("/message", protectRoute, generateChatResponse);

export default router;