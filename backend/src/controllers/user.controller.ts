import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import userService from "../services/user.service.js";
import { MESSAGES, HTTP_STATUS, AUTH_COOKIES } from "../constants/constant.js";
import { AuthenticatedRequest } from "../types/types.js";
import redisService from "../services/redis.service.js";
import { generateAuthTokens } from "../utils/auth.utils.js";
import { setAuthCookies } from "../utils/cookie.utils.js";

class UserController {
  registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const user = await userService.registerUser({ name, email, password });

    const { accessToken, refreshToken } = await generateAuthTokens(user.id);

    setAuthCookies(res, accessToken, refreshToken);

    return res
      .status(HTTP_STATUS.CREATED)
      .json(new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.USER_CREATED, user));
  });

  loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await userService.loginUser({ email, password });

    const { accessToken, refreshToken } = await generateAuthTokens(user.id);

    setAuthCookies(res, accessToken, refreshToken);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.LOGIN_SUCCESS, user));
  });

  googleLogin = asyncHandler( async (req, res) => {

    const { name, email, imageUrl } = req.body;
    
    const result = await userService.googleLogin({name, email, imageUrl})

    const { accessToken, refreshToken } = await generateAuthTokens(result.id);

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.LOGIN_SUCCESS, result))

  })

  verifyUser = asyncHandler ( async ( req, res) => {

    const { token } = req.params;

    await userService.verifyUser(token as string)

    return res.status(HTTP_STATUS.OK).json( new ApiResponse(HTTP_STATUS.OK, MESSAGES.USER_VERIFIED_SUCCESSFULLY))

  })

  logoutUser = asyncHandler(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id.toString();

    await redisService.removeRefreshToken(userId!);

    res.clearCookie(AUTH_COOKIES.ACCESS_TOKEN);
    res.clearCookie(AUTH_COOKIES.REFRESH_TOKEN);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.LOGOUT_SUCCESS, {}));
  });

  generateNewAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    const { accessToken, refreshToken: newRefreshToken } =
      await userService.refreshToken(refreshToken);

    setAuthCookies(res, accessToken, newRefreshToken);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.TOKEN_REFRESHED, {}));
  });

  currentUser = asyncHandler(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id.toString();

    const user = await userService.getUserById(userId as string);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.USER_FETCHED, user));
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    await userService.forgotPassword(email);

    res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.MESSAGE_OTP_SENT, {}));
  });

  resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;

    await userService.resetPassword({ email, otp, newPassword });

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, MESSAGES.PASSWORD_RESET_SUCCESS, {}),
      );
  });

  updateProfile = asyncHandler(async (req: AuthenticatedRequest, res) => {
    const userId = req.user!._id.toString();

    const { name } = req.body;

    const updatedUser = await userService.updateProfile({
      userId,
      name,
      image: req.file,
    });

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.PROFILE_UPDATED, updatedUser));
  });
}

export default new UserController();
