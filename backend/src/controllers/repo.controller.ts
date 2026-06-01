import { AuthenticatedRequest } from "../types/types.js";
import type { Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler.js";
import repoService from "../services/repo.service.js";
import { HTTP_STATUS, MESSAGES } from "../constants/constant.js";
import ApiResponse from "../utils/ApiResponse.js";

class RepoController {

    createRepo = asyncHandler( async (req: AuthenticatedRequest, res: Response) => {

        const { githubUrl, repoName } = req.body;

        const userId = req.user!._id.toString();

        const repo = await repoService.createRepo({ repoName, githubUrl, userId });

        res.status(HTTP_STATUS.CREATED).json(
            new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.REPO_CREATED, repo)
        )        

    })

    currentUserRepo = asyncHandler ( async (req: AuthenticatedRequest, res: Response) => {

        const userId = req.user?._id.toString();

        const repos = await repoService.getReposByUserId(userId!);

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(HTTP_STATUS.OK, MESSAGES.REPO_FETCHED, repos)
        );

    })
}

export default new RepoController();