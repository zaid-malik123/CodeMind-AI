import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
  provider: "local" | "google";
  isVerified: boolean;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function(this: IUser) {
        return this.provider === "local";
      },
    },
    imageUrl: { type: String },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
