import User from "../models/user.model.js";
import Repository from "../models/repo.model.js";
import { repoProducer } from "../jobs/producer/repo.producer.js";

class RepoService {

    async createRepo({ repoName, githubUrl, userId }: { repoName: string, githubUrl: string, userId: string }) {

        const repo = await Repository.create({

            userId,
            githubUrl,
            repoName

        })

        repoProducer(repo._id.toString())

        return;

    }
}

export default new RepoService();