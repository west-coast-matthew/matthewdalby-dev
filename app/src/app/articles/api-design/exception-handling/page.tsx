import { Metadata } from "next";
import { parseHeaders } from "@/utils/page-utils";
import ArticleTemplateLayout from "@/app/articles/article-template";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
import CodeSnippet from "@/components/CodeSnippet";
import { getExample1, getExample2, getExample3 } from "./code-examples";

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
          Consistent exception handling is critical for effective API design.
          While there is no hard standard for reporting exceptions, I will share
          my experiences and opinions here.
        </p>

        <p>
          This article will focus on exception handling from within a REST
          focus, as I have a tendency to work a lot in this area.
        </p>

        <p>
          A project is available on GitHub at{" "}
          <Link href="https://github.com/west-coast-matthew/blog_rest_exception_handling_node">
            https://github.com/west-coast-matthew/blog_rest_exception_handling_node
          </Link>{" "}
          which illusrates a Node.js based implementation of exception handling,
          however the concepts apply to other stacks as well.
        </p>

        <h2>Consistency in response codes</h2>

        <p>
          For anyone working in the API space, I would highly recommend taking a
          moment or two to review the{" "}
          <Link href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status">
            documentation on HTTP status codes.
          </Link>{" "}
          There is a lot of power under the hood there.
        </p>

        <p>
          Returning &apos;HTTP 200&apos; status codes with an status code is
          really an anti pattern. The web API fetch call natively supports
          conditional handling of HTTP response codes.
        </p>

        <CodeSnippet srcCode={getExample1()}></CodeSnippet>
        <i>No bueno!</i>

        <p>
          So in the above example, we are applying unecessary conditional logic
          towards understanding the end result of the request placed.
        </p>

        <p>
          For requests that reference entities that do not exist
          (view/update,delete) that do not exist, an 404 response code would be
          appropriate. This is confusing as the same response is returned by
          default when a request for an actual API endpoint does not exist. I
          norder to provide additional clues to the client as per the exact
          nature of the exception an option exists to provide additional
          information in HTTP headers. For example, when a request is placed for
          an update on a product entity, let&apos;s say
          &apos;/api/product/1234&apos;, and should that record not exist, then
          a message in the response headers such as &apos;Product number 1234
          does not exist&apos; is helpfull within the scope of efforts related
          to diagnosing the issue. This may seem overkill for use cases when you
          have control over the entire stack, however when dealing with external
          consumers, as would be the case for B2B interactions, then this
          additional information provides clarity into the true root cause.
        </p>

        <p>
          As per 500 block exceptions, using an HTTP header, in addition to
          custom error codes can provide additional tools to help diagnose error
          conditions.
        </p>

        <h2>Centralized exception handling</h2>

        <p>
          So applying logic to handle exceptions from an API perspective can
          potentially present a lot of manual effort. This presents a challenge
          as applying consistency presents a lot of governence. The good news is
          that there are typicaly options for centralizing logic related to
          handling exceptions in a lot of stacks. This is referred to as filters
          in the Java world, and middleware in the Node.js space. I have{" "}
          <Link href="https://github.com/west-coast-matthew/blog_rest_exception_handling_node">
            posted a node implementation on GitHub
          </Link>{" "}
          that illustrates this concept.
        </p>

        <p>
          As a personal preference, I like extending exception classes, throwing
          them as runtime exceptions, and handling them at a global/central
          point. The addition of custom exception status codes is usefull as
          these can be exposed into logs, and instrumented to streamline
          troubleshooting efforts. A data related issue that can be resolved at
          an bug fix level deserves a different level of attention than a system
          level exception such as if a depenency system is down (i.e. database,
          third party API, etc.). The following examples illustrate the common
          concept applied across different implementations.
        </p>

        <p>An example of centralized exception handling in Java</p>
        <CodeSnippet srcCode={getExample2()}></CodeSnippet>

        <p>An another in Node.js</p>
        <CodeSnippet srcCode={getExample3()}></CodeSnippet>

        <h2>Summary</h2>

        <ul>
          <li>Make strict use of HTTP status codes</li>
          <li>Centralize exception handling</li>
          <li>Explore options for utilizing custom exceptions</li>
        </ul>
      </Fade>
    </ArticleTemplateLayout>
  );
}
