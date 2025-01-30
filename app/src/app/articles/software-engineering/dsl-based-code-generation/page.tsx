import { Metadata } from "next";
import { parseHeaders } from "@/utils/page-utils";
import ArticleTemplateLayout from "@/app/articles/article-template";
import { Fade } from "react-awesome-reveal";
import ImageReference from "@/components/ImageReference";

/**
 *
 */
export const metadata: Metadata = {
  title: "Matthew Dalby: Articles: API Design: Exception Handling",
};

export default async function ArticlePage() {
  const { selPath, selArticle } = await parseHeaders();

  return (
    <ArticleTemplateLayout selPath={selPath} selArticle={selArticle}>
      <h1>
        <p>Work smarter, not harder...</p>
      </h1>

      <Fade>
        <h2>An introduction</h2>
        <p>
          Traditional approaches to software development involve a lot of manual
          effort. Regardless of the particular language, or tech stack,
          it&apos;s easy to take note of the amount of repetative, boilerplate
          code that comes into play for performing certain tasks, especially
          when it comes to creating ORM related code. Whenever possible, I look
          for options to automate the development process as much as possible.
          Lately there has been a lot of talk about the role of AI in assisting
          in these , but I have using generative strategies for over a decade.
        </p>

        <p>
          In this article, I will talk about a strategy for reverse engineering
          a relational database into a DSL or <i>Domain Specific Language</i>,
          from which point code generation could be implemented to produce
          source code artifacts.
        </p>

        <p>
          I have also developed a project, available on my GitHub account
          (git@github.com:west-coast-matthew/blog_rdbms_dsl_generator.git) as a
          concrete implementation. The implementation is in Java, however the
          concept may be applied to a Node stack as well (I will take a stab at
          this in a future point).
        </p>

        <p>
          The real use case here is one where you are migrating an existing
          product from one stack to another. I faced this issue on a past
          project where we were looking at migrating 350+ tables into a new ORM.
          By estimates this would have required an estimated 2 FT resources and
          around 6 months of effort. using this approach, I was able to reduce
          the process down by a factor of only a few weeks and a single
          resource.
        </p>
      </Fade>

      <Fade>
        <h2>Domain Specific Languages</h2>
      </Fade>

      <Fade>
        <h2>An applied approach</h2>
        <p>
          As I previously mentioned, I created an application that demonstrates
          this concept, available on Github at
          git@github.com:west-coast-matthew/blog_rdbms_dsl_generator.git.
        </p>

        <p>
          The goal of this project is to read meta data from a relational
          database, and then generate a JSON representation of each table onto
          the local file system.
        </p>

        <h3>Architectual Design</h3>

        <ImageReference
          imgRef="/article-content/se/rdbms-to-dsl/dsl-generator-class-model.png"
          description="Overview"
        />

        <p>
          When modeling the application, I put a though cycles into the design,
          which resulted to provide a layer of decoupling between the specifics
          of what the source of the data (MySQL, Postgres, Mongo) from the main
          routine. Interfaces were created for operations such as obtaining meta
          information from a specific source, the DSL format, and final
          destination of the code artifacts.
        </p>

        <p>
          I decided implement this project in Java, however the concepts should
          transfer over to Node stacks as well. There is no value detailing how
          to setup a Java based project, however, let&apos;s look at the file
        </p>

        <p>
          The role of consuming data from a source falls under the interface
          Consumer, source code related to where the resulting DSL is output
          falls under the role of Publisher, and the remaining logic on the
          details of transferring data from a source to some destination assumes
          the role Generator.
        </p>

        <p>Top level interfaces were developed for each of the three roles. </p>

        <h3>Defining a DSL model</h3>
        <p>
          During the first step of the process, data from a source is translated
          into a neutral format, which then is passed over the boundaries of the
          other two roles.
        </p>

        <h3>Implementing the consumer</h3>
        <p>The decision to use a</p>

        <h3>Implementing the generator</h3>

        <h3>Implementing the publisher</h3>

        <h3></h3>

        <h3>Next steps</h3>
      </Fade>

      <Fade>
        <h2>In conclusion</h2>
        <p>
          While there are options out there for reversing a schema into ORM
          implementations, I mean why roll your own? The important take away
          here is that we have migrated the object (using the daatab as the
          single source of truth) into a neutral format
        </p>
      </Fade>
    </ArticleTemplateLayout>
  );
}
