import * as amqplib from "amqplib";
import { env } from "../config/env.js";
import { logger } from "../logger/logger.js";
import { RABBIT_QUEUES } from "../constants/constant.js";

let connection;
let channel: amqplib.Channel;

export const connectRabbitMQ = async () => {
  try {
    connection = await amqplib.connect(env.RABBIT_URL!);
    channel = await connection.createChannel();

    await channel.assertQueue(RABBIT_QUEUES.EMAIL_QUEUE, { durable: true });
    await channel.assertQueue(RABBIT_QUEUES.REPOSITORY_QUEUE, { durable: true });

    await channel.assertQueue(RABBIT_QUEUES.REPOSITORY_RETRY_QUEUE, {
      durable: true,

      arguments: {
        "x-message-ttl": 5000,

        "x-dead-letter-exchange": "",

        "x-dead-letter-routing-key": RABBIT_QUEUES.REPOSITORY_QUEUE,
      },
    });

    await channel.assertQueue(RABBIT_QUEUES.REPOSITORY_DLQ, {
      durable: true,
    });

    logger.info("Connected to RabbitMQ");
  } catch (error) {
    logger.error("Error connecting to RabbitMQ:", error);
  }
};

export const getChannel = () => {
  if (!channel) {
    throw new Error(
      "RabbitMQ channel is not initialized. Call connectRabbitMQ first.",
    );
  }
  return channel;
};
