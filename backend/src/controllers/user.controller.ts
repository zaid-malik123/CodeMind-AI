import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import userService from "../services/user.service.js";
import {
  MESSAGES,
  COOKIE_OPTIONS,
  COOKIE_EXPIRATION,
  HTTP_STATUS,
} from "../constants/constant.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../config/jwt.js";
import { AuthenticatedRequest } from "../types/types.js";
import redisService from "../services/redis.service.js";

class UserController {
  registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const user = await userService.registerUser({ name, email, password });

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    await redisService.setRefreshToken(user.id, refreshToken);

    res.cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: COOKIE_EXPIRATION.ACCESS_TOKEN,
    });

    res.cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: COOKIE_EXPIRATION.REFRESH_TOKEN,
    });

    return res
      .status(HTTP_STATUS.CREATED)
      .json(new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.USER_CREATED, user));
  });

  loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await userService.loginUser({ email, password });

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

    await redisService.setRefreshToken(user.id, refreshToken);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.LOGIN_SUCCESS, user));
  });

  logoutUser = asyncHandler(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id.toString();

    await redisService.removeRefreshToken(userId!);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.LOGOUT_SUCCESS, {}));
  });

  generateNewAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies || req.body;

    const decoded = verifyRefreshToken(refreshToken);
    const storedRefreshToken = await redisService.getRefreshToken(decoded.userId);

    if (storedRefreshToken !== refreshToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(new ApiResponse(HTTP_STATUS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED, {}));
    }

    const accessToken = generateAccessToken({ userId: decoded.userId });
    const newRefreshToken = generateRefreshToken({ userId: decoded.userId });

    await redisService.setRefreshToken(decoded.userId, newRefreshToken);

    res.cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: COOKIE_EXPIRATION.ACCESS_TOKEN,
    });
    res.cookie("refreshToken", newRefreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: COOKIE_EXPIRATION.REFRESH_TOKEN,
    });

    return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.TOKEN_REFRESHED, {}));
    
  })

  currentUser = asyncHandler(async (req: AuthenticatedRequest, res) => {

    const userId = req.user?._id.toString();

    const user = await userService.getUserById(userId as string);


    return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.USER_FETCHED, user));
    
  });
}

export default new UserController();
