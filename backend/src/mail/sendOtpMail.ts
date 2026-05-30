import { transporter } from "./nodemailer.js"
import { otpTemplate } from "./templates/forgot.password.template.js"
import { env } from "../config/env.js"  
import { HTTP_STATUS } from "../constants/constant.js";
import ApiError from "../utils/ApiError.js";

export const sendOtpMail = async (
  email: string,
  otp: string
) => {
  try {
    return await transporter.sendMail({
      from: `"Your Company Team" <${env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: otpTemplate(otp),
    });
  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to send email"
    );
  }
};