import { AuthenticatedRequest } from "../types/types.js";
import type { Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler.js";
import repoService from "../services/repo.service.js";

class RepoController {

    createRepo = asyncHandler( async (req: AuthenticatedRequest, res: Response) => {

        const { githubUrl, repoName } = req.body;

        const userId = req.user!._id.toString();

        await repoService.createRepo({ repoName, githubUrl, userId });

        res.status(201).json({ message: "Repository added successfully" });



    })
}

export default new RepoController();