import { getChannel } from "../../config/rabbitmq.js"
import { RABBIT_QUEUES } from "../../constants/constant.js"
import { logger } from "../../logger/logger.js"
import { repoWorker } from "../../worker/repo.worker.js"

export const repoConsumer = async () => {

    logger.info("Repository consumer started, waiting for messages...")

    const channel = getChannel()

    channel.consume(RABBIT_QUEUES.REPOSITORY_QUEUE, async (msg) => {

        if (msg) {

            const { repoId } = JSON.parse(msg.content.toString())

            repoWorker(repoId)

            channel.ack(msg)
        }

    })

}