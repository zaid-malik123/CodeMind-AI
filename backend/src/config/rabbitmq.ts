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

    channel.assertQueue(RABBIT_QUEUES.EMAIL_QUEUE, { durable: true });

    logger.info("Connected to RabbitMQ");


  } catch (error) {
    logger.error("Error connecting to RabbitMQ:", error);
  }
};


export const getChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized. Call connectRabbitMQ first.");
  }
  return channel;
};