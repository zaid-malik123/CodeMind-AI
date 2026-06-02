import mongoose, { Document } from "mongoose";

interface IRepository extends Document {
  userId: mongoose.Types.ObjectId;
  githubUrl: string;
  repoName?: string;
  status: "pending" | "cloning" | "scanning" |"chunking" | "embedding" | "ready" | "failed";
  totalFiles: number;
  totalChunks: number;
  currentStep?: string;
  errorMessage?: string;
  indexedAt?: Date;
}

const repositorySchema = new mongoose.Schema<IRepository>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    githubUrl: { type: String, required: true },
    repoName: { type: String }, 
    status: {
      type: String,
      enum: ["pending", "cloning", "scanning", "chunking", "embedding", "ready", "failed"],
      default: "pending",
    },
    totalFiles: { type: Number, default: 0 },
    totalChunks: { type: Number, default: 0 },
    errorMessage: { type: String },
    indexedAt: { type: Date },
    currentStep: { type: String },
  },
  { timestamps: true },
);

// Indexes
repositorySchema.index({ userId: 1 });
repositorySchema.index({ status: 1 });

const Repository = mongoose.model<IRepository>("Repository", repositorySchema);

export default Repository;
