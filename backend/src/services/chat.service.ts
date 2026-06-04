import { HTTP_STATUS, MESSAGES } from "../constants/constant.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { generateChatTitle } from "./ai/ai.generation.chatTitle.service.js";
import { generateEmbedding } from "./ai/embedding.service.js";
import { index } from "./ai/vector.service.js";

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

    const message = await Message.create({
      chatId,
      role: "user",
      content: question,
    });

    const embedding = await generateEmbedding(question);
    const vectors = embedding![0].values as number[];
    console.log("Vectors: ", vectors);

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

    console.log(JSON.stringify(results, null, 2));

    return chat;
  }
}

export default new ChatService();
