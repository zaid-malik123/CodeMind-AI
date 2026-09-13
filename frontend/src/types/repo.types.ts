export interface createRepoPayload  {
    githubUrl: string,
    repoName: string,
}

export type RepoStatus =
  | "pending"
  | "cloning"
  | "scanning"
  | "chunking"
  | "embedding"
  | "ready"
  | "failed";



export interface IRepository  {
  _id: string,
  userId: string;
  githubUrl: string;
  repoName?: string;
  status: RepoStatus;
  totalFiles: number;
  totalChunks: number;
  currentStep?: string;
  errorMessage?: string;
  indexedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

