import { Server } from "socket.io";
import { env } from "../config/env.js";
import http from "http";
import { logger } from "../logger/logger.js";
import { SOCKER_EMMIT } from "../constants/constant.js";

let io: Server;
const initSocketServer = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info(`Connected ${socket.id}`);

    socket.on(SOCKER_EMMIT.SOCKET_ROOM_ID, (repoId: string) => {
      socket.join(repoId);


      logger.info(`${socket.id} joined room ${repoId}`);
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
