import redis from "../config/redis.js";
import { COOKIE_EXPIRATION } from "../constants/constant.js";
import { REDIS_KEYS } from "../constants/redis.keys.js";


class RedisService {

    async setRefreshToken(userId: string, token: string) {
        const key = REDIS_KEYS.REFRESH_TOKEN(userId);
        await redis.set(key, token, "EX", COOKIE_EXPIRATION.REFRESH_TOKEN);
    }

    async getRefreshToken(userId: string): Promise<string | null> {
        const key = REDIS_KEYS.REFRESH_TOKEN(userId);
        return await redis.get(key);
    }

    async removeRefreshToken(userId: string) {
        const key = REDIS_KEYS.REFRESH_TOKEN(userId);
        await redis.del(key);
    }
}

export default new RedisService();