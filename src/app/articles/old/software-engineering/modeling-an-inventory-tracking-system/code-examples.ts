import path from "path";
import fs from "fs";

export const getExample1 = () => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "article-content",
    "se",
    "request-scoped-variables",
    "java-impl.txt"
  );
  return fs.readFileSync(filePath, "utf-8");
};

export const getExample2 = () => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "article-content",
    "se",
    "request-scoped-variables",
    "node-impl.txt"
  );
  return fs.readFileSync(filePath, "utf-8");
};
