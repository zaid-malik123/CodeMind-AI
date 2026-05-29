import express from "express";
import UserController from "../controllers/user.controller.js";
import {
  loginValidator,
  registerValidator,
} from "../validator/user.validation.js";
import { validateRequest } from "../middlewares/validation.middleware.js";

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

export default router;
