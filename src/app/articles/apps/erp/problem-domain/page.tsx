import { Metadata } from "next";
import { parseHeaders } from "@/utils/page-utils";
import ArticleTemplateLayout from "@/app/articles/article-template";
import { Fade } from "react-awesome-reveal";

/**
 * Represents an 'individual' article.
 *
 * todo:
 *  - implement an HOC to handle the layout while we just specify content here... =or= should we
 * apply a custom selected <template className=""></template>
 */

export const metadata: Metadata = {
  title: "Matthew Dalby: Articles: API Design: Exception Handling",
};

export default async function ArticlePage() {
  const { selPath, selArticle } = await parseHeaders();

  return (
    <ArticleTemplateLayout selPath={selPath} selArticle={selArticle}>
      <Fade>
        <p>
          I wanted to go into detail about the problem domain, not to bore the
          audience, but hopefully at the proper level where enough background is
          provided to get a good understanding of the architectual decisions and
          resulting implementation.
        </p>
      </Fade>
    </ArticleTemplateLayout>
  );
}
