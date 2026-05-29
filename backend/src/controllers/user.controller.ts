import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import userService from "../services/user.service.js";
import { MESSAGES, COOKIE_OPTIONS, COOKIE_EXPIRATION } from "../constants/constant.js";
import { generateAccessToken, generateRefreshToken } from "../config/jwt.js";

class UserController {
  registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const user = await userService.registerUser({ name, email, password });

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    res.cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: COOKIE_EXPIRATION.ACCESS_TOKEN,
    });

    res.cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: COOKIE_EXPIRATION.REFRESH_TOKEN,
    });


    return res
      .status(201)
      .json(new ApiResponse(201,  MESSAGES.USER_CREATED, user));
  });
}

export default new UserController();