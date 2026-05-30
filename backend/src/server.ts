import app from "./app.js";
import { env } from "./config/env.js";
import { connectDb } from "./db/db.js";
import { logger } from "./logger/logger.js";
import redis from "./config/redis.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";


const startServer = async () => {
  try {
    await connectDb();
    await redis.ping();
    await connectRabbitMQ();
    app.listen(env.PORT, () => {
      logger.info(`Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();