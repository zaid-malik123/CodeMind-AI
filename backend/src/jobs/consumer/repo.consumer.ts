import { getChannel } from "../../config/rabbitmq.js";
import { RABBIT_QUEUES } from "../../constants/constant.js";
import { logger } from "../../logger/logger.js";
import { repoWorker } from "../../worker/repo.worker.js";

export const repoConsumer = async () => {
  logger.info("Repository consumer started, waiting for messages...");

  const channel = getChannel();

  channel.prefetch(1);

  channel.consume(RABBIT_QUEUES.REPOSITORY_QUEUE, async (msg) => {

    if (!msg) {
      logger.warn("Received null message, skipping...");
      return;
    }

    const { repoId, retryCount } = JSON.parse(msg.content.toString());

    try {

      await repoWorker(repoId, retryCount);
      channel.ack(msg);

    } 
    catch (error: any) {

      const nextRetry = retryCount + 1;

      // DLQ

      if (nextRetry > 3) {
        channel.sendToQueue(
          RABBIT_QUEUES.REPOSITORY_DLQ,

          Buffer.from(
            JSON.stringify({
              repoId,
              retryCount: nextRetry,

              error: error.message,
            }),
          ),

          {
            persistent: true,
          },
        );

        logger.error(`Message moved to DLQ after ${retryCount} retries: ${error.message}`);

        channel.ack(msg);

        return;
      }

      // Retry Queue

      channel.sendToQueue(
        RABBIT_QUEUES.REPOSITORY_RETRY_QUEUE,

        Buffer.from(
          JSON.stringify({
            repoId,
            retryCount: nextRetry,
          }),
        ),

        {
          persistent: true,
        },
      );

      channel.ack(msg);
    }
  });
};
