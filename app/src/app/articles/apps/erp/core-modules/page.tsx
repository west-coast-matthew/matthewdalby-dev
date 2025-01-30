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
          With a decision made to separate the server side functionality into a
          series of projects, this drives a conversation about how to handle
          shared code. With microservice implementations in their purest
          interpretation, the code between the various services is independant.
          A downside to this approach is the duplication of code. Another option
          is to create an shared library for use across projects.
        </p>

        <p>
          A <i>common</i> or <i>core</i> library was estalished as a location to
          share source code. Deciding which code to centralize into this shared
          module is somewhat of a complicated subject. Too little centralization
          of code, there is a risk of duplication, too much, and then you have
          created a monolith. The approach used on this project is that after an
          initial set of shared functionality is established in the core module,
          code from other projects is only migrated into a core module once it
          becomes referenced in more than project.
        </p>

        <h2>Prime candidates for inclusion into the shared module</h2>
        <p>
          The following areas of functionality are natural candidates for
          inclusion into the core module.
        </p>
        <ul>
          <li>Security</li>
          <li>Common util functions</li>
          <li>Exception definitions</li>
          <li>Shared constants</li>
        </ul>
      </Fade>
    </ArticleTemplateLayout>
  );
}
