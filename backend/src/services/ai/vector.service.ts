import pinecone from "../../config/vector.db.config.js";
import { PINECONE_INDEX_NAME } from "../../constants/constant.js";
import { generateEmbedding } from "./embedding.service.js";

interface Chunk {
  filePath: string;
  content: string;
}

export const saveEmbeddings = async (
  repoId: string,
  chunks: Chunk[]
) => {

  const index = pinecone.index(
    PINECONE_INDEX_NAME
  );

  const vectors = [];

  for (let i = 0; i < chunks.length; i++) {

    const embedding =
      await generateEmbedding(
        chunks[i].content
      );
     
    if(embedding) {

      vectors.push({
        id: `${repoId}-${i}`,
        values: embedding[0].values,
        metadata: {
          repoId,
          filePath: chunks[i].filePath,
          content: chunks[i].content
        }
      });
    }
  }


  await index.upsert({records: vectors})
};