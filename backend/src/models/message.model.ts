import mongoose, { Document } from "mongoose";

interface IMessage extends Document {
    chatId: mongoose.Types.ObjectId,
    role: "user" | "assistant",
    content: string,
    fileRefs: {
        filePath: string
    }[]
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    fileRefs: [
        {
            filePath: String
        }
    ]
  },
  { timestamps: true },
);

// Index
messageSchema.index({ chatId: 1, createdAt: 1 });


const Message = mongoose.model<IMessage>("Message", messageSchema)
export default Message;
