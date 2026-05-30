import { generateAccessToken, generateRefreshToken } from "../config/jwt.js";
import redisService from "../services/redis.service.js";

export const generateAuthTokens = async (userId: string) => {

    const accessToken = generateAccessToken({ userId });

    const refreshToken = generateRefreshToken({ userId });

    await redisService.setRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };

}