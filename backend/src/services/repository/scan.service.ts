import fg from "fast-glob";

export const scanRepository = async (
  localPath: string
) => {


  const files = await fg(
    [
      "**/*.{ts,tsx,js,jsx,json,md}"
    ],
    {
      cwd: localPath,
      absolute: true,
      ignore: [
        "**/node_modules/**",
        "**/.git/**",
        "**/dist/**",
        "**/build/**",
        "**/test/**",
        "**/logs/**",
        "**/coverage/**",
        "**/.next/**"
      ]
    }
  );

  return files;
};