import type {
  Request,
  Response,
  NextFunction,
} from "express";

import ApiError from "../utils/ApiError.js";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err)
  // Known custom errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown server errors
  return res.status(500).json({
    success: false,

    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
};