import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS, MESSAGES } from "../constants/constant.js";
import bcrypt from "bcryptjs";
import { verifyRefreshToken } from "../config/jwt.js";
import redisService from "./redis.service.js";
import { generateAuthTokens } from "../utils/auth.utils.js";
import { generateOtp } from "../utils/generateOtp.js";
import { emailProducer } from "../jobs/producer/email.producer.js";
import { uploadOnCloud } from "./uploadOnCloud.service.js";
import crypto from "crypto";
import { env } from "../config/env.js";
import { verifyEmailProducer } from "../jobs/producer/verifyEmail.producer.js";

class UserService {
  async registerUser({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.USER_ALREADY_EXIST);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "local"
    });

    const token = crypto.randomBytes(32).toString("hex");

    await redisService.setEmailVerificationToken(token, user._id.toString());

    const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${token}`;

    await verifyEmailProducer(email, verificationUrl);

    return user;
  }

  async loginUser({ email, password }: { email: string; password: string }) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.USER_DOES_NOT_EXIST);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.INVALID_CREDENTIALS);
    }

    return user;
  }

  async googleLogin( {name, email, imageUrl}: { name: string, email: string, imageUrl: string} ) {

    let user = await User.findOne({
      email
    });

    if(!user) {

      user = await User.create({
        name,
        email,
        imageUrl,
        provider: "google",
        isVerified: true
      })

    }

    return user;
  }

  async verifyUser(token: string) {
    const userId = await redisService.getEmailVerificationToken(token);

    if (!userId) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        MESSAGES.INVALID_AND_EXPIRED_TOKEN,
      );
    }

    const user = await User.findById(userId);

    if(!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_DOES_NOT_EXIST)
    }

    if(user.isVerified) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.USER_ALREADY_VERIFIED)
    }

    user.isVerified = true;

    await user.save();

    return;
    
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    const decoded = verifyRefreshToken(refreshToken);

    const storedRefreshToken = await redisService.getRefreshToken(
      decoded.userId,
    );

    if (storedRefreshToken !== refreshToken) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAuthTokens(decoded.userId);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async getUserById(userId: string) {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_DOES_NOT_EXIST);
    }

    return user;
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_DOES_NOT_EXIST);
    }

    const otp = generateOtp();

    await redisService.setOtp(email, otp);

    await emailProducer(email, otp);

    return;
  }

  async resetPassword({
    email,
    otp,
    newPassword,
  }: {
    email: string;
    otp: string;
    newPassword: string;
  }) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_DOES_NOT_EXIST);
    }

    const storedOtp = await redisService.getOtp(email);

    if (storedOtp !== otp) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.INVALID_OTP);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    await user.save();

    await redisService.removeOtp(email);

    return;
  }

  async updateProfile({
    userId,
    name,
    image,
  }: {
    userId: string;
    name?: string;
    image?: Express.Multer.File;
  }) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_DOES_NOT_EXIST);
    }

    if (name) {
      user.name = name;
    }

    if (image) {
      const imageUrl = await uploadOnCloud(image);
      user.imageUrl = imageUrl;
    }

    await user.save();

    return user;
  }
}

export default new UserService();
