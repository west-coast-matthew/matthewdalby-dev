import { Metadata } from "next";
;
import ArticleTemplateLayout from "@/app/articles/article-template";
import { Fade } from "react-awesome-reveal";

export const metadata: Metadata = {
  title: "Matthew Dalby: Hire Me",
};

export default async function ArticlePage() {
  const selPath = "/hire-me";
  const selArticle = null;

  return (
    <ArticleTemplateLayout selPath={selPath} selArticle={selArticle}>
      <Fade>(hire me!!!!) Put your article content here, thats it!</Fade>
    </ArticleTemplateLayout>
  );
}
