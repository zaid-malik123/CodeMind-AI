import { Server } from "socket.io"
import { env } from "../config/env.js"
import http from "http"
import { logger } from "../logger/logger.js";

let io: Server;
const initSocketServer = (server: http.Server) => {

    io = new Server(server, {
        cors: {
            origin: env.CORS_ORIGIN,
            credentials: true
        }
    })

    io.on("connection", (socket) => {

        logger.info("Socker server connection done and that user connected is ", socket.id )

        socket.on("disconnect", () => {

            logger.info("Disconnected ", socket.id)
        })

    })

    return io;
}

export const getIo = () => {

    if(!io) {
        throw new Error("IO not intialized ")
    }

    return io;
}

export default initSocketServer;