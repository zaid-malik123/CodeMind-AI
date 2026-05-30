import express from "express";
import UserController from "../controllers/user.controller.js";
import {
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
} from "../validator/user.validation.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  validateRequest,
  UserController.registerUser,
);

router.post(
  "/login",
  loginValidator,
  validateRequest,
  UserController.loginUser,
);

router.get("/logout", authMiddleware, UserController.logoutUser);

router.post(
  "/refresh-token",
  refreshTokenValidator,
  validateRequest,
  UserController.generateNewAccessToken,
);

router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validateRequest,
  UserController.forgotPassword,
);

router.post(
  "/reset-password",
  resetPasswordValidator,
  validateRequest,
  UserController.resetPassword,
);

router.get("/me", authMiddleware, UserController.currentUser);

export default router;
