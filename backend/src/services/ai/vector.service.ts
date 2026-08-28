import pinecone from "../../config/vector.db.config.js";
import { PINECONE_INDEX_NAME } from "../../constants/constant.js";
import { generateEmbedding } from "./embedding.service.js";
import { env } from "../../config/env.js";
import pLimit from "p-limit";

const limit = pLimit(5);

interface Chunk {
  filePath: string;
  content: string;
}

export const index = pinecone.index(
  PINECONE_INDEX_NAME,
  env.VECTOR_DB_HOST_NAME,
);
export const saveEmbeddings = async (repoId: string, chunks: Chunk[]) => {
  const vectors = (
    await Promise.all(
      chunks.map((chunk, i) =>
        limit(async () => {
          const embedding = await generateEmbedding(chunk.content);

          if (!embedding || !embedding[0]?.values) {
            return [];
          }

          return [
            {
              id: `${repoId}-${i}`,
              values: embedding[0].values,
              metadata: {
                repoId,
                filePath: chunk.filePath,
                content: chunk.content,
              },
            },
          ];
        }),
      ),
    )
  ).flat();

  await index.upsert({
    records: vectors,
  });
};
