import { Metadata } from "next";
import { parseHeaders } from "@/utils/page-utils";
import ArticleTemplateLayout from "@/app/articles/article-template";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Matthew Dalby: Articles: API Design: Exception Handling",
};

export default async function ArticlePage() {
  const { selPath, selArticle } = await parseHeaders();

  return (
    <ArticleTemplateLayout selPath={selPath} selArticle={selArticle}>
      <Fade>
        <p>
          Over the weekend I spent some time formalizing some efforts creating a
          generic Typescript node based application intended for creating REST
          based APIs.
          <Link
            href={
              "https://github.com/west-coast-matthew/boilerplate-node-rest-api"
            }
          >
            https://github.com/west-coast-matthew/boilerplate-node-rest-api
          </Link>
        </p>
      </Fade>
    </ArticleTemplateLayout>
  );
}
