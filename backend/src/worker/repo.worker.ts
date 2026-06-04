import { MESSAGES, REPO_STATUS } from "../constants/constant.js";
import Repository from "../models/repo.model.js";
import { saveEmbeddings } from "../services/ai/vector.service.js";
import { createChunks } from "../services/repository/chunk.service.js";
import { cloneRepository } from "../services/repository/clone.service.js";
import { readRepositoryFiles } from "../services/repository/read.service.js";
import { scanRepository } from "../services/repository/scan.service.js";
import { emitRepoStatus } from "../socket/socker.emit.js";
import fs from "fs/promises"

export const repoWorker = async (repoId: string, retryCount: number) => {
  const repo = await Repository.findById(repoId);

  if (!repo) {
    throw new Error(MESSAGES.REPO_NOT_FOUND);
  }
  try {
    repo.currentStep = REPO_STATUS.REPO_CLONNING;
    emitRepoStatus(repoId, REPO_STATUS.REPO_CLONNING);
    repo.status = REPO_STATUS.REPO_CLONNING;
    await repo.save();

    const localPath = await cloneRepository(repo.githubUrl!, repoId);

    repo.currentStep = REPO_STATUS.REPO_SCANNING;
    emitRepoStatus(repoId, REPO_STATUS.REPO_SCANNING);
    repo.status = REPO_STATUS.REPO_SCANNING;
    await repo.save();

    const filePaths = await scanRepository(localPath);

    const files = await readRepositoryFiles(filePaths);

    repo.currentStep = REPO_STATUS.REPO_CHUNKING;
    emitRepoStatus(repoId, REPO_STATUS.REPO_CHUNKING);
    repo.status = REPO_STATUS.REPO_CHUNKING;
    repo.totalFiles = files.length;
    await repo.save();

    const chunks = createChunks(files);

    repo.currentStep = REPO_STATUS.REPO_EMBEDDING;
    emitRepoStatus(repoId, REPO_STATUS.REPO_EMBEDDING);
    repo.status = REPO_STATUS.REPO_EMBEDDING;
    repo.totalChunks = chunks.length;
    await repo.save();

    await saveEmbeddings(repoId, chunks);

    repo.currentStep = REPO_STATUS.REPO_READY;
    emitRepoStatus(repoId, REPO_STATUS.REPO_READY);
    repo.status = REPO_STATUS.REPO_READY;
    repo.indexedAt = new Date();
    await repo.save();

    fs.rm(localPath, { recursive: true, force: true });

  } catch (error: any) {
    repo.currentStep = REPO_STATUS.REPO_FAILED;
    repo.status = REPO_STATUS.REPO_FAILED;
    repo.errorMessage = error.message;

    await repo.save();

    emitRepoStatus(repoId, REPO_STATUS.REPO_FAILED);
    throw error;
  }
};
