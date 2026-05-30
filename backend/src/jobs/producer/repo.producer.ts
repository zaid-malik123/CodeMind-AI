import { getChannel } from "../../config/rabbitmq.js"
import { RABBIT_QUEUES } from "../../constants/constant.js"

export const repoProducer = async ( repoId: string ) => {

    const channel = getChannel()

    channel.sendToQueue(RABBIT_QUEUES.REPOSITORY_QUEUE, Buffer.from(JSON.stringify({ repoId })), {
        persistent: true
    })

}