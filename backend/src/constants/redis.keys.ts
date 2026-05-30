import redis from "../config/redis.js";

export const REDIS_KEYS = {
    REFRESH_TOKEN: (userId: string) => `refresh_token:${userId}`,

} as const;