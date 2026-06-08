import Repository from "../models/repo.model.js";
import { repoProducer } from "../jobs/producer/repo.producer.js";
import { paginate } from "../utils/paginate.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS, MESSAGES } from "../constants/constant.js";
import pinecone from "../config/vector.db.config.js";
import { index } from "./ai/vector.service.js";

class RepoService {
  async createRepo({
    repoName,
    githubUrl,
    userId,
  }: {
    repoName: string;
    githubUrl: string;
    userId: string;
  }) {
    const repo = await Repository.create({
      userId,
      githubUrl,
      repoName,
    });

    await repoProducer({  repoId: repo._id.toString(), retryCount: 0 });

    return repo;
  }

  async getUserRepos(userId: string, page: number, limit: number) {
    const { docs: repos, pagination } = await paginate({
      model: Repository,
      query: { userId },
      page,
      limit,
    });

    return {
      repos,
      pagination,
    };
  }

  async getRepoStatus({ repoId, userId }: { repoId: string; userId: string }) {
    const repo = await Repository.findOne({ _id: repoId, userId });

    if (!repo) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.REPO_NOT_FOUND);
    }

    return repo.status;
  }

  async deleteRepo({ repoId, userId }: { repoId: string; userId: string }) {
    const repo = await Repository.findOneAndDelete({ _id: repoId, userId });

    if (!repo) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.REPO_NOT_FOUND);
    }

    await index.deleteMany({
      filter: {
        repoId: {
          $eq: repoId,
        },
      },
    });

    return repo;
  }
}

export default new RepoService();
