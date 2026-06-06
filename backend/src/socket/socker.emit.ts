import { SOCKER_EMMIT } from "../constants/constant.js";
import { getIo } from "./socket.js";

export const emitRepoStatus = (
    repoId: string,
    status: string
) => {

    const io = getIo();

    io.to(repoId).emit(
        SOCKER_EMMIT.REPO_EMMIT,
        {
            repoId,
            status
        }
    )

}

export const aiResponseMessageEmit = (chatId: string, response: any) => {

    const io = getIo();

    io.to(`chat:${chatId}`).emit(
        SOCKER_EMMIT.AI_RESPONSE, 
        response
    )

}