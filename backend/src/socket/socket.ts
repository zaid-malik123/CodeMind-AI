import { Server } from "socket.io";
import { env } from "../config/env.js";
import http from "http";
import { logger } from "../logger/logger.js";
import {  MESSAGES, SOCKER_EMMIT } from "../constants/constant.js";
import cookie from "cookie";
import { verifyAccessToken } from "../config/jwt.js";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";
import Repository from "../models/repo.model.js";

let io: Server;
const initSocketServer = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const { accessToken } = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!accessToken) {
      return next(new Error(MESSAGES.UNAUTHORIZED));
    }

    try {
      const verify = verifyAccessToken(accessToken);

      const userId = verify.userId.toString();

      const user = await User.findById(userId);

      if (!user) {
        return next(new Error(MESSAGES.USER_DOES_NOT_EXIST));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error(MESSAGES.SOCKET_AUTHENTICATION_FAILED));
    }
  });

  io.on("connection", (socket) => {
    socket.on(SOCKER_EMMIT.SOCKET_ROOM_ID, async (repoId: string) => {
      const user = socket.data.user;

      const repo = await Repository.findById(repoId);

      if (!repo) {
        return;
      }

      if (repo.userId.toString() !== user._id.toString()) {
        return;
      }

      socket.join(repoId);
    });

    socket.on(SOCKER_EMMIT.SOCKET_CHAT_ROOM_ID, async (chatId: string) => {
      const user = socket.data.user;

      const chat = await Chat.findById(chatId);

      if (!chat) return;

      if (chat.userId.toString() !== user._id.toString()) {
        return;
      }

      socket.join(`chat:${chatId}`);
    });

    socket.on("disconnect", () => {
      logger.info(`Disconnected ${socket.id}`);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("IO not intialized ");
  }

  return io;
};

export default initSocketServer;
