import { getChannel } from "../../config/rabbitmq.js";
import { RABBIT_QUEUES } from "../../constants/constant.js";

export const emailProducer = async (
  email: string,
  otp: string
) => {

  const channel = getChannel();


  await channel.sendToQueue(
    RABBIT_QUEUES.EMAIL_QUEUE,
    Buffer.from(
      JSON.stringify({ email, otp })
    ),
    {
      persistent: true
    }
  );

};