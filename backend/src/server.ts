import app from "./app.js";
import { env } from "./config/env.js";
import { connectDb } from "./db/db.js";
import { logger } from "./logger/logger.js";

const startServer = async () => {
  try {
    await connectDb();
    app.listen(env.PORT, () => {
      logger.info(`Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();