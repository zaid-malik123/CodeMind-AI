import { AuthenticatedRequest } from "../types/types.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import chatService from "../services/chat.service.js";
import type { Response } from "express";
import { HTTP_STATUS, MESSAGES } from "../constants/constant.js";
import ApiResponse from "../utils/ApiResponse.js";

class chatController {
  chatController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user!._id.toString();

      const { repoId, question, chatId } = req.body;

      const chat = await chatService.createChatService({
        userId,
        repoId,
        question,
        chatId,
      });

      res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.CHAT_CREATED, chat));
    },
  );

  getAllChatsController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user!._id.toString();

      const chats = await chatService.getAllChatsService(userId);

      res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.CHAT_FETCHED, chats));

    }
  )
}

export default new chatController();
