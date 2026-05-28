import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import userService from "../services/user.service.js";
import { MESSAGES } from "../constants/constant.js";

class UserController {
  registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const user = await userService.registerUser({ name, email, password });

    return res
      .status(201)
      .json(new ApiResponse(201,  MESSAGES.USER_CREATED, user));
  });
}

export default new UserController();