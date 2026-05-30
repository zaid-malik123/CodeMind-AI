import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { SignOptions } from "jsonwebtoken";
import { TOKEN_EXPIRATION } from "../constants/constant.js";

interface TokenPayload {
  userId: string;
}

export const generateAccessToken = ({ userId }: TokenPayload) => {
  return jwt.sign(
    { userId },
    env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: TOKEN_EXPIRATION.ACCESS_TOKEN as SignOptions["expiresIn"],
    }
  );
};

export const generateRefreshToken = ({ userId }: TokenPayload) => {
  return jwt.sign(
    { userId },
    env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: TOKEN_EXPIRATION.REFRESH_TOKEN as SignOptions["expiresIn"],
    }
  );
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET!) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET!) as TokenPayload;
};