import path from "path";
import fs from "fs";

export const getArticleContent = (
  dirName: string,
  fileName: string
): string => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "article-content",
    "se",
    dirName,
    fileName + ".txt"
  );

  return fs.readFileSync(filePath, "utf-8");
};
