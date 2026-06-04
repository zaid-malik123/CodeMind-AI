import express from "express";
import chatController from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createChatValidator } from "../validator/chat.validation.js";
import { validateRequest } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post(
    "/new",
    authMiddleware,
    createChatValidator,
    validateRequest,
    chatController.chatController
)

router.get(
    "/",
    authMiddleware,
    chatController.getAllChatsController
)

export default router;