import { AuthenticatedRequest } from "../types/types.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import chatService from "../services/chat.service.js";
import type { Response } from "express";

class chatController {

    chatController = asyncHandler ( async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user!._id.toString();

        const { repoId, question, chatId } = req.body;

        const chat = await chatService.createChatService(
            {
                userId,
                repoId,
                question,
                chatId
            }
        )

        res.status(201).json({
            success: true,
            data: chat
        })

        

    })

}

export default new chatController();