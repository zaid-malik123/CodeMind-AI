import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js"

export const ai = new GoogleGenAI({
    apiKey: env.AI_API_KEY
});