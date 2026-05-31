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