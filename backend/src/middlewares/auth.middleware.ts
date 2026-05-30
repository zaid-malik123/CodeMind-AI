import jwt from "jsonwebtoken";
import type { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/types.js";

import { env } from "../config/env.js";
import User from "../models/user.model.js";
import { HTTP_STATUS, MESSAGES } from "../constants/constant.js";



interface JwtPayload {
  userId: string;
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.cookies.accessToken;

    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: MESSAGES.UNAUTHORIZED,
      });
    }

    const decoded = jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET
    ) as JwtPayload;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: MESSAGES.UNAUTHORIZED,
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: MESSAGES.UNAUTHORIZED,
    });
  }
};

export default authMiddleware;
