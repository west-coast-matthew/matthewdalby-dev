import path from "path";
import fs from "fs";

export const getExample1 = () => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "article-content",
    "se",
    "applied-unit-testing",
    "node-mocking.txt"
  );
  return fs.readFileSync(filePath, "utf-8");
};
