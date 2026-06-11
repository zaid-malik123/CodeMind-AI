import { getChannel } from "../../config/rabbitmq.js";
import { RABBIT_QUEUES } from "../../constants/constant.js";
import { logger } from "../../logger/logger.js";
import { emailVerificationWorker } from "../../worker/emailVerification.worker.js";

export const verifyEmailConsumer = async () => {
  const channel = await getChannel();

  logger.info("Verification Email consumer started, waiting for messages...");

  channel.consume(RABBIT_QUEUES.VERIFY_EMAIL_QUEUE, async (msg) => {

    try {

        if(msg) {

            const {email, verificationUrl} = JSON.parse(msg.content.toString());

            await emailVerificationWorker(email, verificationUrl)

            channel.ack(msg)

        }
        
    } catch (error) {
        logger.error("Verificaton Consumer Error --> ", error)
    }

  })

};
