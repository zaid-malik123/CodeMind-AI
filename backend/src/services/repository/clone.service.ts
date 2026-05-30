import { simpleGit } from "simple-git";
import path from "path";

export const cloneRepository = async (
  repoUrl: string,
  repoId: string
) => {

  const git = simpleGit();

  const localPath = path.join(
    process.cwd(),
    "temp",
    "repositories",
    repoId
  );

  await git.clone(repoUrl, localPath);

  return localPath;
};