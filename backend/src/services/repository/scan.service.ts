import fg from "fast-glob";

export const scanRepository = async (localPath: string) => {
  const files = await fg(["**/*.{ts,tsx,js,jsx,py,go,java,md}"], {
    cwd: localPath,
    absolute: true,
    ignore: [
      "**/node_modules/**",
      "**/.git/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.next/**",

      "**/package-lock.json",
      "**/yarn.lock",
      "**/pnpm-lock.yaml",

      "**/*.min.js",
      "**/*.map",

      "**/.env*",
    ],
  });

  return files;
};
