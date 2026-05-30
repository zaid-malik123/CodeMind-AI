import { MESSAGES } from "../constants/constant.js";
import Repository from "../models/repo.model.js";
import { cloneRepository } from "../services/clone.service.js";
import { readRepositoryFiles } from "../services/read.service.js";
import { scanRepository } from "../services/scan.service.js";

export const repoWorker = async (repoId: string) => {
  const repo = await Repository.findById(repoId);

  if (!repo) {
    throw new Error(MESSAGES.REPO_NOT_FOUND);
  }

  repo.status = "cloning";
  await repo.save();

  const localPath = await cloneRepository(repo.githubUrl!, repoId);

  const filePaths = await scanRepository(localPath);

  const files = await readRepositoryFiles(filePaths);


};
