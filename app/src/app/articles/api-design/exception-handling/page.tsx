import { Metadata } from "next";
import { parseHeaders } from "@/utils/page-utils";
import ArticleTemplateLayout from "@/app/articles/article-template";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
import CodeSnippet from "@/components/CodeSnippet";
import { getArticleContent } from "./code-examples";

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
          While there is truly no hard standard for reporting exceptions, I will
          share my experiences and opinions here.
        </p>

        <p>
          This article will focus on exception handling from within a REST
          focus, as I have a tendency to work a lot in this area.
        </p>

        <p>
          To illustrate how these concepts may be applied across different
          stacks, and are pretty much framework agnostic, I will provide
          examples in Java and Node.js stacks. Fully functional projects are
          available on GitHub under the following locations.
        </p>

        <ul>
          <li>
            <Link href="https://github.com/west-coast-matthew/blog_rest_exception_handling_node">
              https://github.com/west-coast-matthew/blog_rest_exception_handling_node
            </Link>{" "}
          </li>
          <li>
            <li>
              <Link href="https://github.com/west-coast-matthew/blog_rest_exception_handling_java">
                https://github.com/west-coast-matthew/blog_rest_exception_handling_java
              </Link>{" "}
            </li>
          </li>
        </ul>

        <p>
          I have been working with REST APIs for over a decade now, across
          various projects and organizations. To me the concepts what I am
          presenting here seem self-evident, however I am often surprised at the
          amount of what could be described as &apos;anti-patterns&apos;. I hope
          this articles either confirms your current processes are correct, or
          perhaps allows you to indentify opportunities for improvement in your
          existing code base.
        </p>

        <p>
          There are a few important areas I will cover in this article as
          follows.
        </p>

        <ul>
          <li>Apply an effective validation policy</li>
          <li>Utilize custom exceptions</li>
          <li>Provide consistency in response codes</li>
        </ul>

        <h2>Apply an effective validation policy</h2>
        <p>
          So whenever possible, I highly recommend using a well though out
          approach towards validation. If you can capture invalid data as early
          as possible, you you can respond with a concise response.
        </p>
        <p>
          For example, when attempting to perform an update (HTTP PUT/PATCH)
          operation, a check to confirm that the targeted entity for the update
          operation actually exists, and if it does not exist, ideally we would
          return and 404 response code. The issue is the default result for
          attempting to update a non-existent entity will more than likely throw
          an exception that would probably result in an 500 response code.
        </p>

        <p>
          In the java world, the Java Bean Validation API provides an intuitive
          way to annotate objects with validation constraints. So in the
          following example illusts an annotated entity and via the @Valid
          annotation, the runtime framework is instructed to automatically apply
          attribute level validation.
        </p>

        <CodeSnippet srcCode={getArticleContent("bean-validation")} />

        <p>
          This is a standard approach for that particular tech stack, however
          for NodeJS there is less of a standard, so many other options exist.
        </p>

        <p>
          My main point here is validate at a detailed level, and as early as
          possible.
        </p>

        <h2>Utilize custom exceptions</h2>
        <p>
          I am a big advocate of utilizing custom exceptions. This allows you to
          create a hierarchy of exceptions that are specific to your domain and
          application. This is important as it allows you to handle exceptions
          in a more granular way, and provide more meaningful error messages to
          the client.
        </p>

        <b>A custom handler in Node.js</b>
        <CodeSnippet srcCode={getArticleContent("node-custom-exception")} />

        <b>And an example in Java</b>
        <CodeSnippet srcCode={getArticleContent("java-custom-exception")} />

        <p>
          In both examples, we have create a base class, for which purpose
          specific implementations are created. Basically we wrap an additional
          message element, and an exception code that makes it easy to classify
          the exception from an auditing perspective. Given a centralized
          exception approach, which we will cover later in this article, this
          helps to maintain a consistent exception handling strategy.
        </p>

        <h2>Provide consistency in response codes</h2>

        <p>
          An important consideration if to provide the correct code for error
          type conditions. I have seen on mulitple occasions something like the
          following.
        </p>
        <CodeSnippet srcCode={getArticleContent("fetch-request-example")} />
        <p>
          So the above example is a Javascript snippet that is prepared to
          handle exceptions that are masked by HTTP 200 response codes. The
          issue here is that the Fetch API is natively prepared to handle 500
          response codes. Adding in cheks for a status message in the body to
          determine if the operation truly succeeded requires unecessary effort.
          Additionally, a 500 response code, using an alternate approach leaves
          more options. Above we see each developer may return their own
          preferred status indicators. That example is something based on real
          world past experience. One particular project used this approach, and
          the request handlers would use additional criteria in the if
          condition, which was a mess. Typically when you observe this type of
          syntax, it is a sign of larger architectual issues.
        </p>

        <p>
          In short, use 400 and 500 codes strictly. Stay out of the business of
          overriding logic that simple &amp;works&amp;
        </p>

        <h3>Implementing creational codes</h3>
        <p>
          For requests that create or update data, use the appropriate more
          granular HTTP status code. 201 (Created) and 204 (No content) may be
          used to further clarify the operation was successful.
        </p>

        <h3>Proper use of 404 exceptions</h3>
        <p>
          The use of 404 exceptions is a bit tricky as this could indicate if a
          resquested API endpoint does not physically exist, or if indeed it
          did, but the requested record did not. I frequently make use of a
          header containing an additional message that allows us to
          differentiate between the two cases. An additional entry in the
          response payload is another viable option, however the important thing
          is you provide the ability for the client to understand the true
          nature of the issue, ,and possibly any auditing middleware that might
          be responsible for exposing broken links.
        </p>

        <h3>Bringing visibility into actual exceptions</h3>
        <p>
          Finally, information regaring the nature of the error condition may be
          of use. You may not want to necessarily return the entire stack trace
          or details of if a database or dependency API is not available,
          however at a minimum returning a application specific code that might
          indicate which system dependency was not available may help to
          streamine the exception troublshooing process.
        </p>

        <p>
          For example, if a support resource recieves a request from a user
          indicating they are experiencing an &apos; SE-10017 &pos;, the support
          runbook could direct the request initially to a resource responsible
          for the database system that is off line, rather than initially
          fielding it to the developer on call.
        </p>

        <h3>Centralizing exception handling</h3>

        <p>
          Governence of a consistent process for handling exceptions in your API
          is most easily accomplished when exception handling logic is
          centralized. So, let&apos;s look at the following examples of throwing
          exceptions at the logic level.
        </p>

        <CodeSnippet srcCode={getArticleContent("throwing-exceptions")} />
        <p>
          Clean, consistent, easy to throw runtime exceptions. Note that
          developer is abstracted from the details of the exception handling
          strategy, and the resulting response output. Establishing an
          centralized location for catching and handling exceptions acorss the
          application can be accomplished in Java via Servlet Filters, and
          within a Node.js stack via express Middleware. Examples are as
          follows.
        </p>

        <b>Java based centralized exception handling</b>
        <CodeSnippet srcCode={getArticleContent("java-exception-handler")} />

        <b>Node based centralized exception handling</b>
        <CodeSnippet srcCode={getArticleContent("node-exception-handler")} />

        <p>
          So the above two example accomplish the same result, watch for certain
          exception types, catch them, and then return a consistent result.
          Since we making use of custom exceptions here, this streamlines the
          process of including custom codes in headers. From a developers
          perspective, the syntax is very similar to standard exceptions, so
          there is very little overhead associated with using them, which helps
          to increase adoption.
        </p>

        <h2>In Summary</h2>

        <p>
          So, consistency, consistency, consistency. Centralize logic, make use
          of custom exceptions, return consistent messaged, using established
          use cases.
        </p>

        <p>
          Again, two functioning projects are available at the following
          locations on GitHub that illustrate these concepts in both Node.js and
          Java stacks.
        </p>

        <ul>
          <li>
            <Link href="https://github.com/west-coast-matthew/blog_rest_exception_handling_node">
              https://github.com/west-coast-matthew/blog_rest_exception_handling_node
            </Link>{" "}
          </li>
          <li>
            <li>
              <Link href="https://github.com/west-coast-matthew/blog_rest_exception_handling_java">
                https://github.com/west-coast-matthew/blog_rest_exception_handling_java
              </Link>{" "}
            </li>
          </li>
        </ul>
      </Fade>
    </ArticleTemplateLayout>
  );
}
