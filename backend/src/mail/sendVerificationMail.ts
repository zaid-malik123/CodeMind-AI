import { transporter } from "./nodemailer.js"
import { env } from "../config/env.js"  
import { HTTP_STATUS } from "../constants/constant.js";
import ApiError from "../utils/ApiError.js";
import { emailVerificationTemplate } from "./templates/email.verification.template.js";

export const sendVerificationMail = async (
  email: string,
  verificationUrl: string,
) => {
  try {
    return await transporter.sendMail({
      from: `"Your Company Team" <${env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification",
      html: emailVerificationTemplate(verificationUrl),
    });
  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to send email"
    );
  }
};