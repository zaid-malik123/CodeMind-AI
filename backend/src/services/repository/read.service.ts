import fs from "fs/promises";

export const readRepositoryFiles = async (
  filePaths: string[]
) => {

  const files = [];

  for (const filePath of filePaths) {

    const content = await fs.readFile(
      filePath,
      "utf-8"
    );

    files.push({
      path: filePath,
      content
    });
  }

  return files;
};