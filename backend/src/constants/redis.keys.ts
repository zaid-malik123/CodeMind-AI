import redis from "../config/redis.js";

export const REDIS_KEYS = {
    REFRESH_TOKEN: (userId: string) => `refresh_token:${userId}`,
    PASSWORD_RESET_OTP: (email: string) => `password_reset_otp:${email}`,
    EMAIL_VERIFICATION_TOKEN: (token: string) => `email_verification_token:${token}`

} as const;