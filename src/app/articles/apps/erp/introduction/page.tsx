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
        <h2>Introduction</h2>
        <p>
          I wanted to publish an example of what I would consider a &apos;real
          world&apos; application. Given the scope of basically
          <i>everything</i> I have worked on, is consdered IP for private
          companies. This makes things a bit hard to share with anyone else how
          I would approach an application in an actual day to day basis.
        </p>

        <p>
          As a result, I wanted to create an application that modeled some of my
          personal experiences. I came up with the concept of redoing an
          inventory tracking system I had played a large role on in the past.
          The domain space provides a problem interesting enough worth solving,
          and I am really looking forward to iplementing a few technical options
          that were not options for various reasons during the time I had spent
          on the project.
        </p>

        <p>
          To make things interesting, I have decided to implement the
          application in both Java and Node. The goal here is to apply common
          concepts across different tech stacks. The Java/Node choice is a
          natural fit as I spend most of my time in these areas, however at some
          future point, I am planning
        </p>

        <p>
          In the next section, I will deep dive into the domain problem, it is
          necessary to get enough background on the task at hand. I picked this
          project specifically as it introdues a few requirements that span
          beyond the normal scope of a lot of example applcations. In particular
          I wanted to address performance optimizations for a specific function
          related to tracing operations over time periods.
        </p>
      </Fade>
    </ArticleTemplateLayout>
  );
}
