import { getChannel } from "../../config/rabbitmq.js"
import { RABBIT_QUEUES } from "../../constants/constant.js";
import { logger } from "../../logger/logger.js";
import { emailWorker } from "../../worker/email.worker.js";

const channel = getChannel()

export const emailConsumer = async () => {

    logger.info("Email consumer started, waiting for messages...");

    channel.consume(RABBIT_QUEUES.EMAIL_QUEUE, async (msg) => {

        try {

            if(msg) {

            const { email, otp } = JSON.parse(msg.content.toString());

            await emailWorker(email, otp);
            
            channel.ack(msg);
        }
            
        } catch (error) {

            logger.error("Error processing email job:", error);
            
        }
    })
   
}   