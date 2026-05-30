import { sendOtpMail } from "../mail/sendOtpMail.js";
import { logger } from "../logger/logger.js";

export const emailWorker = async (email: string, otp: string) => {
  await sendOtpMail(email, otp);
  logger.info(`OTP email sent successfully to ${email}`);
};
