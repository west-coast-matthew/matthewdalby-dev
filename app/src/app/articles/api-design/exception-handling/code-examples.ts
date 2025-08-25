import path from "path";
import fs from "fs";

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
    "java-exception-handler.ts"
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
    "node-exception-handler.ts"
  );

  return fs.readFileSync(filePath, "utf-8");
};
