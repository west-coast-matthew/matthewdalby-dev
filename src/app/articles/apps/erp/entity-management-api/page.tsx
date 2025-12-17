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
          When modeling data in applications, you can generally classify data
          into 3 groups: data that changes frequently, data that changes
          moderately, and data that seldom changes. For example, given a
          familliar ecommerce application, shopping carts and orders frequently
          change. Customer information could be considered as changing with a
          moderate frequency, and other types of data such as product
          categories, and products have a noticablly less frequency of updates,
          and can be referred to as infrequently changing data. A dedicated set
          of projects was created to facilititate the management of these types
          of use cases (erp-entity-mgmnt-api and erp-entity-mgmnt-ui).
        </p>

        <p>
          These modules are necessary, however are not considered{" "}
          <i>high value</i> as they are not consumer facing, therefore a
          polished UI experience does not merit the same level of effort as
          perhaps a public facing screen.
        </p>

        <p>
          Given the fact that these screens could be considered lower priority,
          an effort has been put in place to streamline the process of
          presenting screens to perform the occasional maintenance of this type
          of data. The original application I am basing this refactor on
          consisted of around 350 tables, which around 80 requried maintanance
          screens which fall with the scope of this module. Given the repetative
          nature of these types of screens, a strategy for dynamically bulding a
          form based on the object&apos;s attributes seems an attractive option.
        </p>
      </Fade>
    </ArticleTemplateLayout>
  );
}
