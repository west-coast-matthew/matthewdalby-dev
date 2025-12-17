import { Metadata } from "next";
import { parseHeaders } from "@/utils/page-utils";
import ArticleTemplateLayout from "@/app/articles/article-template";
import { Fade } from "react-awesome-reveal";

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
          Caching is an often overlooked topic when it comes to API design. For
          hobby level projects, or for applications in corporate environments
          with modest user bases you can probably get away with not addressing
          this aspect, however for high usage cases, it is critical to take this
          into consideration.
        </p>

        <p>
          There are numerous options for caching, but I am going to address HTTP
          based API designs, specifically REST APIs as they seem to be popping
          up all over the place. I am going to pretty much just focus on
          utilizing http cache control headers here, as it is an easy win when
          it comes to optimizing data retrieval efforts.
        </p>

        <p>
          Caching does come at a cost, specifically one of complexity. What do
          you cache, and for how long? What is an appropriate strategy for
          performing refreshes?
        </p>

        <h2>Understanding data</h2>
        <p>
          When approaching a new application, I start with the underlying data
          structure. Generally you can classify data into three groups, sets
          that change frequently, semi-frequently, and infrequently.
        </p>

        <p>
          For data that infrequently changes, such as product categories or
          color options, these become natural candidates for caching.
        </p>

        <h2>How browsers handle cache control directives</h2>
        <p>Let&apos;s</p>

        <h2>Caching Options</h2>

        <h2>Understanding caching headers</h2>
        <p>
          The HTTP protocol provides some great options for annotating responses
          with data related to what expectations we can place on when data may
          be considered stale.
        </p>

        <p>
          It is important to note that by providing cache related information in
          the response headers it is mearly a hint for the client or any proxies
          between both endpoints. For cases where you have direct control over
          the client, there is an opporunity to optimize requests, however if
          you are implementing an external API, there is no guarantee the
          consumer will utilize them.
        </p>

        <h2>Summary</h2>
      </Fade>
    </ArticleTemplateLayout>
  );
}
