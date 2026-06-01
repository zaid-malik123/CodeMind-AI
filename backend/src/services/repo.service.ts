import Repository from "../models/repo.model.js";
import { repoProducer } from "../jobs/producer/repo.producer.js";

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

    await repoProducer(repo._id.toString());

    return repo;
  }

  async getUserRepos(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [repos, total] = await Promise.all([
      Repository.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Repository.countDocuments({ userId }),
    ]);

    return {
      repos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async getRepoStatus(repoId: string) {}
}

export default new RepoService();
