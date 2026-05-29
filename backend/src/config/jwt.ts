import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { SignOptions } from "jsonwebtoken";

interface TokenPayload {
  userId: string;
}

export const generateAccessToken = ({ userId }: TokenPayload) => {
  return jwt.sign(
    { userId },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
    }
  );
};

export const generateRefreshToken = ({ userId }: TokenPayload) => {
  return jwt.sign(
    { userId },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
    }
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
};