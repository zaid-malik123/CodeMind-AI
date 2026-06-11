import redis from "../config/redis.js";
import { COOKIE_EXPIRATION, TOKEN_EXPIRATION } from "../constants/constant.js";
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

  async setOtp(email: string, otp: string) {
    const key = REDIS_KEYS.PASSWORD_RESET_OTP(email);
    await redis.set(key, otp, "EX", 300); // OTP expires in 5 minutes
  }

  async getOtp(email: string): Promise<string | null> {
    const key = REDIS_KEYS.PASSWORD_RESET_OTP(email);
    return await redis.get(key);
  }

  async removeOtp(email: string) {
    const key = REDIS_KEYS.PASSWORD_RESET_OTP(email);
    await redis.del(key);
  }

  async setEmailVerificationToken(token: string, userId: string) {
    const key = REDIS_KEYS.EMAIL_VERIFICATION_TOKEN(token);

    await redis.set(
      key,
      userId,
      "EX",
      TOKEN_EXPIRATION.EMAIL_VERIFICATION_TOKEN_EXPIRATION,
    );
  }

  async getEmailVerificationToken(token: string) {
    const key = REDIS_KEYS.EMAIL_VERIFICATION_TOKEN(token);

    return await redis.get(key);
  }

  async removeEmailVerificationToken(token: string) {
    const key = REDIS_KEYS.EMAIL_VERIFICATION_TOKEN(token);

    await redis.del(key);
  }
}

export default new RedisService();
