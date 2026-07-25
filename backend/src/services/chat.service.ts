import mongoose from "mongoose";
import { HTTP_STATUS, MESSAGES } from "../constants/constant.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { paginate } from "../utils/paginate.js";
import { generateChatTitle } from "./ai/ai.generation.chatTitle.service.js";
import { sendAIResponse } from "./ai/ai.response.service.js";
import { generateEmbedding } from "./ai/embedding.service.js";
import { index } from "./ai/vector.service.js";
import { aiResponseMessageEmit } from "../socket/socket.emit.js";

class ChatService {
  async createChatService({
    userId,
    repoId,
    question,
    chatId,
  }: {
    userId: string;
    repoId: string;
    question: string;
    chatId?: string;
  }) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_DOES_NOT_EXIST);
    }

    let chat;

    if (chatId) {
      chat = await Chat.findById(chatId);

      if (!chat) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.CHAT_NOT_FOUND);
      }

      if (chat.userId.toString() !== userId) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
      }
    } else {
      const title = await generateChatTitle(question);

      chat = await Chat.create({
        userId,
        repoId,
        title,
      });
    }

     await Message.create({
      chatId: chat._id,
      role: "user",
      content: question,
    });



    const embedding = await generateEmbedding(question);
    const vectors = embedding![0].values as number[];

    if (!embedding) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        MESSAGES.EMBEDDING_GENERATION_FAILED,
      );
    }

    const results = await index.query({
      vector: vectors,
      topK: 5,
      includeMetadata: true,
      filter: {
        repoId,
      },
    });

    const context = results.matches
      .map(
        (match) => `
File: ${match.metadata?.filePath}

${match.metadata?.content}
`,
      )
      .join("\n\n-------------------\n\n");

    const fileRefs = results.matches.map((match) => ({
      filePath: String(match.metadata?.filePath),
    }));

    const aiResponse = await sendAIResponse({
      question,
      context,
    });

    const aiMessage = await Message.create({
      chatId: chat._id,
      role: "assistant",
      content: aiResponse,
      fileRefs,
    });

    await aiResponseMessageEmit(chat._id.toString(), aiMessage)

    return chat;
  }

  async getAllChatsService(userId: string, repoId: string) {
    const chats = await paginate({
      model: Chat,
      filter: { userId, repoId },
      page: 1,
      limit: 20,
      sort: { createdAt: -1 },
    });

    return chats;
  }

  async getSingleChatMessagesService(userId: string, chatId: string) {
    const messages = await Message.aggregate([
      {
        $match: {
          chatId: new mongoose.Types.ObjectId(chatId),
        },
      },

      {
        $lookup: {
          from: "chats",
          localField: "chatId",
          foreignField: "_id",
          as: "chat",
        },
      },

      {
        $unwind: "$chat",
      },

      {
        $match: {
          "chat.userId": new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $project: {
          _id: 1,
          chatId: 1,
          role: 1,
          content: 1,
        },
      },

      {
        $sort: {
          createdAt: 1,
        },
      }
    ]);

    return messages;
  }

  async deleteChatService(userId: string, chatId: string) {
    
    const chat = await Chat.findById(chatId);

    if (!chat) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.CHAT_NOT_FOUND);
    }

    if (chat.userId.toString() !== userId) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    await Message.deleteMany({ chatId });
    await Chat.findByIdAndDelete(chatId);

    return;

  }
}

export default new ChatService();
