import { Metadata } from "next";
import { getArticleData } from "@/utils/page-utils";
import ArticleTemplateLayout from "@/app/articles/article-template";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
import CodeSnippet from "@/components/CodeSnippet";
import { getExample1, getExample2 } from "./code-examples";

/**
 * Represents an 'individual' article.
 *
 * todo:
 *  - implement an HOC to handle the layout while we just specify content here... =or= should we
 * apply a custom selected <template className=""></template>
 */

export const metadata: Metadata = {
  title: "Matthew Dalby: Articles: Software Engineering: Request Scoped Variables",
};

export default async function ArticlePage() {
  const { selPath, selArticle } = getArticleData("/software-engineering", "/request-scoped-variables");

  return (
    <ArticleTemplateLayout selPath={selPath} selArticle={selArticle}>
      <Fade>
        <h2>Introduction</h2>
        <p>
          Here I am going to cover how to bind variables to a request scope. The
          use case for this is to allow us to pass variables through the request
          scope, so that we can access them in the controller and service layers
          of our application, without having to pass references around.
        </p>

        <p>
          Specifically, we will be generating a unique id within a REST
          controller, which will be used to represent the transaction. This
          approach would support the ability to correlate logging events across
          a request.{" "}
        </p>

        <p>
          While it is true that global level variables are generally frowned
          upon in the software industry, there are rare exceptions when they
          make sense, and this is one of them.
        </p>

        <p>
          In order to illustrate how this concept is universal, and not
          necessarily stack specific, examples in both Java/Spring and
          Node.js/express are provided.
        </p>

        <p>
          Two projects have created to illustrate the concepts covered here,
          which are available on my GitHub account.
        </p>
        <p>
          <Link href="https://github.com/west-coast-matthew/blog-context-variables-node">
            https://github.com/west-coast-matthew/blog-context-variables-node
          </Link>
        </p>
        <p>
          <Link href="https://github.com/west-coast-matthew/blog-context-variables-java">
            https://github.com/west-coast-matthew/blog-context-variables-java
          </Link>
        </p>

        <h2>A Java Based Implementation</h2>

        <p>
          In the following example we will be using a servlet filter to bind a
          variable to the request scope. This will allow us to access the
          variable in the controller and service layers of our application.
        </p>

        <CodeSnippet srcCode={getExample1()}></CodeSnippet>
        <i>Binding variables through an servlet filter</i>

        <p>
          Using the @WebFilter annotation, we establish an interceptor for any
          inbound requests, this is the direct equivelent of middleware applied
          in node based projects. The
          &apos;&com.matthewdalby.example.context_variables.filter.TransactionFilter
          &apos; class creates the request scoped variable and binds it to the
          current request via the RequestContext class.
        </p>

        <p>
          Java works by handling each request via a higher level thread, and the
          setCurrentTransactionId method will result in the variable being bound
          to the current thread. In our case here, we are generating a unqie id
          representing the current transaction or request, and then making it
          available across the stack in order to support our ability to
          coordinate associate log entries with the overal operation.
        </p>

        <h2>And a Node.js Implementation</h2>
        <p>
          An here we have a node implementation, which is essentially performing
          the same operation. In this instance,
          ./src/iddleware/context.middleware.mjs file.
        </p>

        <p>
          Node of course operates a bit differently as all requests are handled
          by a single higher level thread, instead of a pool of threads each
          handling specific requests. AsyncLocalStorage from the
          &apos;hooks&apos; package is used to wire in the magic that allows us
          to bind our transaction ids to individual requests, despite the fact a
          common parent thread is concurrently handing all requests.
        </p>

        <p></p>

        <CodeSnippet srcCode={getExample2()}></CodeSnippet>
        <i>And our implementation in node</i>

        <h2>Conclusion</h2>

        <p>
          In conclusion, request scoped variables are a powerful tool that can
          help us to manage state across the request lifecycle. They allow us to
          bind variables to the request scope, which can then be accessed in the
          controller and service layers of our application. This can be useful
          for things like generating unique ids for transactions, or for
          coordinating logging events across a request.
        </p>
      </Fade>
    </ArticleTemplateLayout>
  );
}
