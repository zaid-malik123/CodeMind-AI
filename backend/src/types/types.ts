import { IUser } from "../models/user.model.js";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}