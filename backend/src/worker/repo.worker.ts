import { MESSAGES, REPO_STATUS } from "../constants/constant.js";
import Repository from "../models/repo.model.js";
import { saveEmbeddings } from "../services/ai/vector.service.js";
import { createChunks } from "../services/repository/chunk.service.js";
import { cloneRepository } from "../services/repository/clone.service.js";
import { readRepositoryFiles } from "../services/repository/read.service.js";
import { scanRepository } from "../services/repository/scan.service.js";
import { emitRepoStatus } from "../socket/socker.emit.js";

export const repoWorker = async (repoId: string) => {
  const repo = await Repository.findById(repoId);

  if (!repo) {
    throw new Error(MESSAGES.REPO_NOT_FOUND);
  }
  try {

    emitRepoStatus(repoId, REPO_STATUS.REPO_CLONNING);
    repo.status = "cloning";
    await repo.save();


    const localPath = await cloneRepository(repo.githubUrl!, repoId);

    emitRepoStatus(repoId, REPO_STATUS.REPO_SCANNING);
    repo.status = "scanning";
    await repo.save();

    const filePaths = await scanRepository(localPath);

    const files = await readRepositoryFiles(filePaths);

    emitRepoStatus(repoId, REPO_STATUS.REPO_CHUNKING);
    repo.status = "chunking";
    repo.totalFiles = files.length;
    await repo.save();

    const chunks = createChunks(files);

    emitRepoStatus(repoId, REPO_STATUS.REPO_EMBEDDING);
    repo.status = "embedding";
    repo.totalChunks = chunks.length;
    await repo.save();

    await saveEmbeddings(repoId, chunks);

    emitRepoStatus(repoId, REPO_STATUS.REPO_READY);
    repo.status = "ready";
    repo.indexedAt = new Date();
    await repo.save();

  } catch (error: any) {
    repo.status = "failed";
    repo.errorMessage = error.message;

    await repo.save();

    emitRepoStatus(repoId, REPO_STATUS.REPO_FAILED);
  }
};
