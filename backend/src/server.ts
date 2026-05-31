import app from "./app.js";
import { env } from "./config/env.js";
import { connectDb } from "./db/db.js";
import { logger } from "./logger/logger.js";
import redis from "./config/redis.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import { emailConsumer } from "./jobs/consumer/email.consumer.js";
import { repoConsumer } from "./jobs/consumer/repo.consumer.js";
import initSocketServer from "./socket/socket.js";
import http from "http"


const startServer = async () => {
  try {
    const server = http.createServer(app)
    const io = initSocketServer(server)
    logger.info("Socket server Initialized !! ")
    await connectDb();
    await redis.ping();
    await connectRabbitMQ();
    await emailConsumer()
    await repoConsumer()

    server.listen(env.PORT, () => {
      logger.info(`Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();