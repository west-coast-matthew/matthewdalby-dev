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

export const getExample1 = () => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "article-content",
    "se",
    "exception-handling",
    "fetch-request-example.txt"
  );

  return fs.readFileSync(filePath, "utf-8");
};

export const getExample2 = () => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "article-content",
    "se",
    "exception-handling",
    "java-exception-handler.txt"
  );

  return fs.readFileSync(filePath, "utf-8");
};

export const getExample3 = () => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "article-content",
    "se",
    "exception-handling",
    "node-exception-handler.txt"
  );

  return fs.readFileSync(filePath, "utf-8");
};
