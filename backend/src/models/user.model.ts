import mongoose, { Document } from "mongoose";


export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}


const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ email: 1 }, { unique: true });



const User = mongoose.model<IUser>("User", userSchema);

export default User;