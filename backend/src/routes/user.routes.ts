import express from "express";
import UserController from "../controllers/user.controller.js";
import {
  forgotPasswordValidator,
  googleLoginValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
} from "../validator/user.validation.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

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

router.post(
  "/google",
  googleLoginValidator,
  validateRequest,
  UserController.googleLogin
)

router.get("/logout", authMiddleware, UserController.logoutUser);

router.post(
  "/refresh-token",
  refreshTokenValidator,
  validateRequest,
  UserController.generateNewAccessToken,
);

router.get(
  "/verify-user/:token",
  UserController.verifyUser
)

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

router.post(
  "/update-profile",
  authMiddleware,
  upload.single("image"),
  UserController.updateProfile,
);

export default router;
