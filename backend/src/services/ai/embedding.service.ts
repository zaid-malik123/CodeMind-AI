import { ai } from "../../config/ai.config.js";
import { env } from "../../config/env.js";


export const generateEmbedding = async (content: string) => {

    const response = await ai.models.embedContent({
        model: env.GEMINI_EMBEDDING_MODEL!,
        contents: content,
        config: {
            outputDimensionality: 768,
        },
    });

    return response.embeddings;
}

