import mongoose from 'mongoose';
import { env } from '../config/env.js'
import {logger} from "../logger/logger.js"

export const connectDb = async () => {
    try {
        await mongoose.connect(env.MONGO_URI!);
        logger.info("Connected to MongoDB");
    } catch (error) {
        logger.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}