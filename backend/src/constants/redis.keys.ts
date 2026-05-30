import redis from "../config/redis.js";

export const REDIS_KEYS = {
    REFRESH_TOKEN: (userId: string) => `refresh_token:${userId}`,
    PASSWORD_RESET_OTP: (email: string) => `password_reset_otp:${email}`,

} as const;