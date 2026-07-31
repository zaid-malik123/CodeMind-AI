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
      const repoId = req.params.repoId as string;
      const chats = await chatService.getAllChatsService(userId, repoId);

      res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.CHAT_FETCHED, chats));

    }
  )

  getSingleChatMessagesController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {

      const userId = req.user!._id.toString();
      const chatId = req.params.chatId as string;

      const messages = await chatService.getSingleChatMessagesService(userId, chatId);

      res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.CHAT_MESSAGES_FETCHED, messages));

    }
  )

  chatDeleteController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user!._id.toString();
      const chatId = req.params.chatId as string;

      await chatService.deleteChatService(userId, chatId);

      res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.CHAT_DELETED));
    }
  )

  // testingForAIResponse = asyncHandler(
  //   async (req: AuthenticatedRequest, res: Response) => {
  //     const { question, context } = req.body;

      

  //     const aiResponse = await sendAIResponse({ question, context });

  //     res
  //       .status(HTTP_STATUS.OK)
  //       .json(new ApiResponse(HTTP_STATUS.OK, "fetched", aiResponse));
  //   }
  // )
}

export default new chatController();
