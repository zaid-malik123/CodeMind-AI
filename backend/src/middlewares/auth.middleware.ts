
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

import { env } from "../config/env.js";
import User, { IUser } from "../models/user.model.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

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
      return res.status(401).json({
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET
    ) as JwtPayload;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Invalid token",
    });
  }
};

export default authMiddleware;
