import { Metadata } from "next";
import { parseHeaders } from "@/utils/page-utils";
import ArticleTemplateLayout from "@/app/articles/article-template";
import { Fade } from "react-awesome-reveal";
import CodeSnippet from "@/components/CodeSnippet";
import { getArticleContent } from "./code-examples";

export const metadata: Metadata = {
  title:
    "Matthew Dalby: Articles: Node.js/React/Typescript: Adventure in Tanstack",
};

export default async function ArticlePage() {
  const { selPath, selArticle } = await parseHeaders();

  return (
    <ArticleTemplateLayout selPath={selPath} selArticle={selArticle}>
      <Fade>
        <h2 className="subtitle">Introduction</h2>

        <p>
          I have spent a disproportunate amount of time in the React space over
          the past several years. This usually involves interactions with APIs,
          specifically REST. The opportunity has provided me with some insight
          into how various teams are accomplishing this simple common operations
          across various projects such as interating with remote APIs and
          maintaining applicaition state. Given the open nature of React, there
          is no consistent defacto standard to performing these operations.
        </p>
        <p>
          In this article, I will cover my personal experience with the
          tankstack library, specifically query interaction and and state
          management. I won&apos;t attempt to create an formal tutorial here on
          the Tanstack libraries, and I also wont put in effort into history of
          the tankstack project, as this is readily available online in other
          places. Spoiler alert here, the experience has been positive, and I
          would enoucrage anyone not working with the project to make take a
          peek into the applied approaches covered here towards state management
          and API interactions as I really view this as an proven development
          approach.
        </p>

        <h2>API interactions with useQuery</h2>
        <h3>The vanilla approach towards API interactions in React</h3>
        <p>
          Let&apos;s look at a textbook example of loading ata in an functional
          component in React. Upon initialization.
        </p>
        <CodeSnippet srcCode={getArticleContent("bad-fetch-example")} />
        <p>
          So in the above example, we are taking a low level approach towards
          API interaction. First of all, we perform a brute force fetch api call
          within the page, and secondly, we track the status of the load
          operation, i.e. was it successfull? is it still loading?, etc. While
          this gets the job done, and appears in many examples and tutorials,
          the following points are areas for improvement with this appraoch.
        </p>
        <ul>
          <li>
            Lower levels of call operations should be centralized into another
            file, enforcing separation of concearns between UI logic
          </li>
          <li>Manual effort required to tracking loading state</li>
          <li>Any effort for caching needs additional effort</li>
        </ul>

        <p>Let&apos;s take another pass at an approach in the next section.</p>

        <h2>
          A revised approach towards for UI interactions via TankStack useQuery
        </h2>

        <p>
          So we will start with a new useQuery based approach. First and
          foremost, we split the low level request details into the
          &apos;fetchProducts&apos; method, which was migrated to a separate
          file. Line 22 performs the useQuery call which wrappers the underlying
          action.
        </p>

        <CodeSnippet srcCode={getArticleContent("basic-tankstack-fetch")} />
        <p>
          So in the above example, the previous references to useState are gone.
          This is a cleaner approach, references to the resulting data, the
          state of the load request, and if and the nature of the error is
          assigned as a simple function call, managed by the underlying API
          details. The default variable names work in most cases, which is great
          as it provides consistency across simple use cases, however the aility
          to override the variable references is supported she the requirement
          arise.
        </p>

        <p>
          Another added benefit towards this library approach is the ability to
          manage caching. This requires a lot more additional logic when hand
          rolling which would be required in the initial approach. Line 23
          supplies the queryKey function, which provides a lot of power under
          the hood when it comes to fine tuning query operations. Caching and
          automatic refreshing is supported, with a range of options I will not
          attempt to cover here as it it well documented on the projects site
          (https://tanstack.com/query/v4/docs/framework/react/reference/useQuery).
        </p>

        <p>
          While the use cases for how and when to cache merit a separate
          discussion, it is worth noting the built in support with the library
          for caching, and the low level required to harness the required for
          implementing advanced caching functionality.
        </p>

        <h2>Summary</h2>
        <p>
          So I have hit on the hello world/boilerplate/example level approach
          that is ever present in blogs/tutorials/training courses. Well
          intended for illustration purposes, however not exactly production
          level code, however I have encountered this on many occasions.
        </p>
        <p>
          The above approach utilizing tankstack provide a solid path forward
          with data fetching from within React frontends.
        </p>

        <p>
          I would highly encourage anyone building projects in this space and
          consider drinking the coolaide on this one. Concise, consistent.
        </p>
      </Fade>
    </ArticleTemplateLayout>
  );
}
