import Repository from "../models/repo.model.js"
import { cloneRepository } from "../services/clone.service.js"

export const repoWorker = async ( repoId: string ) => {

    const repo = await Repository.findById(repoId)


    const localPath = await cloneRepository(repo?.githubUrl!, repoId)

    console.log("THIS IS THE PATH ", localPath)
    

}