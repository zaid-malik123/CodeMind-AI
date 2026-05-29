import { Redis } from "ioredis";
import { env } from "../config/env.js";
import { logger } from "../logger/logger.js";

const redis = new Redis(env.REDIS_HOST);

redis.on("connect", () => {
    logger.info("Connected to Redis successfully.");
});

redis.on("error", (error) => {
    logger.error(`Redis connection error: ${error.message}`);
});

export default redis;