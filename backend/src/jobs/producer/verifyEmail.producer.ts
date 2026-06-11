import { getChannel } from "../../config/rabbitmq.js";
import { RABBIT_QUEUES } from "../../constants/constant.js";

export const verifyEmailProducer = async (
  email: string,
  verificationUrl: string
) => {

  const channel = getChannel();


  await channel.sendToQueue(
    RABBIT_QUEUES.VERIFY_EMAIL_QUEUE,
    Buffer.from(
      JSON.stringify({ email, verificationUrl })
    ),
    {
      persistent: true
    }
  );

};