import path from "path";
import fs from "fs";

export const getArticleContent = (fileName: string): string => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "article-content",
    "node",
    "adventures-in-tanstack",
    fileName + ".txt"
  );

  return fs.readFileSync(filePath, "utf-8");
};
