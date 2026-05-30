import mongoose, { Document } from "mongoose";

interface IRepoSummary extends Document {
  repoId: mongoose.Types.ObjectId;
  architecture?: string;
  techStack?: string[];
  folderTree?: string;
  apiOverview?: string;
}

const repoSummarySchema = new mongoose.Schema<IRepoSummary>(
  {
    repoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
      unique: true,
    },
    architecture: { type: String },
    techStack: [{ type: String }], 
    folderTree: { type: String }, 
    apiOverview: { type: String },
  },
  { timestamps: true },
);


const RepoSummary = mongoose.model<IRepoSummary>("RepoSummary", repoSummarySchema);

export default RepoSummary;