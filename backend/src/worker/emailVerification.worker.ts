import { logger } from "../logger/logger.js";
import { sendVerificationMail } from "../mail/sendVerificationMail.js"


export const emailVerificationWorker = async (email: string, verificationUrl: string) => {

    await sendVerificationMail(email, verificationUrl);

    logger.info(`send verification email done ${email}`)

}