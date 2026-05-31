import mongoose, { Document } from "mongoose";

interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  repoId: mongoose.Types.ObjectId;
  title: string;
}

const chatSchema = new mongoose.Schema<IChat>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    repoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    title: { type: String, default: "New Chat" },
  },
  { timestamps: true },
);

// Indexes
chatSchema.index({ userId: 1, repoId: 1 });

const Chat = mongoose.model<IChat>("Chat", chatSchema)

export default Chat;