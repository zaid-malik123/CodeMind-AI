export const createChunks = (
  files: {
    path: string;
    content: string;
  }[]
) => {

  const chunks = [];

  const CHUNK_SIZE = 1000;

  for (const file of files) {

    for (
      let i = 0;
      i < file.content.length;
      i += CHUNK_SIZE
    ) {

      chunks.push({
        filePath: file.path,
        content: file.content.slice(
          i,
          i + CHUNK_SIZE
        )
      });

    }
  }

  return chunks;
};