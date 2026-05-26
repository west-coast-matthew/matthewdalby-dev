import path from "path";
import fs from "fs";

export const getArticleContent = (fileName: string): string => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "article-content",
    "api-design",
    "exception-handling",
    fileName + ".txt"
  );

  return fs.readFileSync(filePath, "utf-8");
};
