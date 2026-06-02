import { getChannel } from "../../config/rabbitmq.js"
import { RABBIT_QUEUES } from "../../constants/constant.js"

export const repoProducer = async ({ repoId, retryCount }: { repoId: string; retryCount: number }) => {

    const channel = getChannel()

    channel.sendToQueue(RABBIT_QUEUES.REPOSITORY_QUEUE, Buffer.from(JSON.stringify({ repoId, retryCount })), {
        persistent: true
    })

}