import path from "path";
import fs from "fs";

export const getHeaderComments = () => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "article-content",
    "se",
    "chain-of-reponsibility-pattern",
    "header-comments.txt"
  );
  return fs.readFileSync(filePath, "utf-8");
};

export const getFileStructure = () => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "article-content",
    "se",
    "chain-of-reponsibility-pattern",
    "file-structure.txt"
  );
  return fs.readFileSync(filePath, "utf-8");
};

export const getJavaExample = () => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "article-content",
    "se",
    "chain-of-reponsibility-pattern",
    "java-impl.txt"
  );
  return fs.readFileSync(filePath, "utf-8");
};
