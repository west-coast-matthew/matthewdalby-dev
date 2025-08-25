import path from "path";
import fs from "fs";

export const getExample1 = () => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "article-content",
    "se",
    "effective-rest-controllers",
    "basic-rest-contoller.examples.txt"
  );
  return fs.readFileSync(filePath, "utf-8");
};

export const getExample2 = () => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "article-content",
    "se",
    "effective-rest-controllers",
    "fetch-request-example.txt"
  );
  return fs.readFileSync(filePath, "utf-8");
};

export const getExample3 = () => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "article-content",
    "se",
    "effective-rest-controllers",
    "spring-bean-validation.txt"
  );
  return fs.readFileSync(filePath, "utf-8");
};

export const getExample4 = () => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "article-content",
    "se",
    "effective-rest-controllers",
    "cache-control-examples.txt"
  );
  return fs.readFileSync(filePath, "utf-8");
};
