import { Metadata } from "next";
import { getArticleData } from "@/utils/page-utils";
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
  title: "Matthew Dalby: Articles: Apps > Erp: Entity Management Ui",
};

export default async function ArticlePage() {
  const { selPath, selArticle } = getArticleData("/apps/erp", "/entity-management-ui");

  return (
    <ArticleTemplateLayout selPath={selPath} selArticle={selArticle}>
      <Fade>
        <h2></h2>
        <p></p>
      </Fade>
    </ArticleTemplateLayout>
  );
}
