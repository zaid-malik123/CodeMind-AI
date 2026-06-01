import Repository from "../models/repo.model.js";
import { repoProducer } from "../jobs/producer/repo.producer.js";

class RepoService {

    async createRepo({ repoName, githubUrl, userId }: { repoName: string, githubUrl: string, userId: string }) {

        const repo = await Repository.create({

            userId,
            githubUrl,
            repoName

        })

        await repoProducer(repo._id.toString())

        return repo;

    }

    async getReposByUserId(userId: string) {
        const repos = await Repository.find({ userId });
        return repos;
    }
}

export default new RepoService();