import { ai } from "../../config/ai.config.js";


export const generateEmbedding = async (content: string) => {

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: content,
        config: {
            outputDimensionality: 768,
        },
    });

    return response.embeddings;
}

