import { Metadata } from "next";
import { parseHeaders } from "@/utils/page-utils";
import ArticleTemplateLayout from "@/app/articles/article-template";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
import CodeSnippet from "@/components/CodeSnippet";
import { getExample1 } from "./code-examples";

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
          Unit level testing is a crucial aspect of software development,
          ensuring that individual components function correctly. In this
          article, we will explore the concept of applied unit testing, focusing
          on practical strategies and techniques to enhance the reliability and
          maintainability of your codebase. This specific approach makes use of
          mocking to reduce depenenecies on other components
        </p>

        <p>
          To make things interesting, a project has been created which makes use
          of a modest amount of business logic. There is enough logic
          implemented to illustrate how the logic would be difficult to test
          manually.
        </p>

        <p>
          This partilular effort has been implemented via Node.js, however the
          concepts apply to other frameworks, and I might create a Java based
          implementation at some future point to illustrate that the approach
          here is not specific to any particular stack.
        </p>

        <p>
          For the majority of my career I have been an avid practiioner of unit
          level testing, a first hand witness to the benefits of test driven
          development or TDD. I have read a lot of articles on the subject of
          testing, and frequently they focus on behavior driven testing (BDD),
          or full stack approaches, I would advise to proceed with caution. In
          my opinion, I would apply heavy emphasis at a minimum to heavy
          coverage on the areas most appropriate, as illustrated in the examples
          here.
        </p>

        <p>
          As an added benefit, a test driven attitude will typically impact your
          code design skills. You will most likely find yourself writing
          smaller, modular pieces of code, which by nature are easier to test.
        </p>

        <p>
          Source code for the project is available on my Github account located
          at &nbsp;
          <Link href="https://github.com/west-coast-matthew/blog-tank-tracing">
            https://github.com/west-coast-matthew/blog-tank-tracing
          </Link>
        </p>

        <h2>Solving a complex problem</h2>
        <p>
          The project associated with this article is intended to track
          transactions that occur during the manufacturing process of commercial
          beverages. This project is based on an actual project I had worked on
          in the past, for which I have recreated an implementation. I
          won&apos;t deep dive to much into the domain problem here, but instead
          will attempt to summarize the problem at hand we are solving.
        </p>

        <p>
          In short, raw materials are purchased in large quantities, for which a
          series of operations are performed against, after which the contents
          are converted into commercially packaged goods. So imagine a scneario
          where we are manufacturing orange juice. Oranges are iniitally
          pusrchased, washed, the juice is extracted, filtered pasturized,
          cooled, stored, moved around, until final packaging. Imaging that the
          average number of operations performed on a batch is around 30, and
          that we are responsible for performing thousands of operations on a
          monthly basis. Given that scenario, we have the following high level
          requirements.
        </p>

        <ul>
          <li>
            Track every operation, and maintain relationships between related
            operations
          </li>
          <li>
            Support the ability to go back at a previous point in history and
            trace all resulting activity from that point forward. This would
            support the ability to perform a product recall
          </li>
          <li>
            Support the abilityto track all activity on a tank during a series
            of events, i.e. from the time a storage tank was initiall empty, up
            until the time it reaches an empty state again, or the last recorded
            activity.
          </li>
        </ul>

        <p>
          So hopefully that is just enough background to illustrate the effort
          applied. The actual effort is simplified, in a real world scenario
          there would potentially be a lot more complexity, edge cases, et.
          however this implementation provides enough logic to illustrate the
          concept that we are building something complex, which makes a strong
          case for unit level testing.
        </p>

        <h2>Using mocks to stub functionality</h2>
        <p>
          I am a big fan of mocks. Since we are testing at a granular or unit
          level. Staging all possible variables in a database to reproduce test
          scenarios is hard. Given an architecture that is 3 tiered, where the
          core logic is stored in the middle or service tier, mocking simply is
          the reference to &apos;unplugging&apos; the lower tier. This approach
          requires injecting alternate implementations of whatever logic would
          normally occur.
        </p>

        <p>
          For this effort, we will be implementing logic in Node.js, so lets
          take a look at an example. Here we have a series of inventory related
          functions used by higher level sections of code located in the
          src/services/inventory.service.ts file. Each of these operations
          require for data to be loaded a database, and stored in memory prior
          to any operations on the data set.
        </p>

        <CodeSnippet srcCode={getExample1()}></CodeSnippet>
        <i>Mocking the data set in a Jest test battery</i>

        <p>
          So at line 11, we establish an reference to the actual target file we
          are attempting to mock (entity-load-service) which is responsible for
          loading the data required to drive the functions of the inventory
          tracking service. Line 12 defines the method to mock, and the
          implementation to swap it out with. In this case, we are mocking only
          a single method, but other cases may require additional methods to
          stub out. From this point forward, tests are written against the
          service methods calling them as any other portion of the application
          would.
        </p>

        <p>
          By introducing coverage reports into the testing process, we gain
          visibility into testing pass rates, and coverage reports. We are
          pushing around 90% coverage for this effort. This is on the high side,
          where it feels good to have this level of coverage, this is not always
          the best investment of time.
        </p>

        <p>
          The goal of this article is to provide an example of a complex logic
          and how to test it, so I won&apos;t go into detail about the Jest
          testing framework as there is plenty of information on the topic. Test
          are located under the ./tests folder on the project under GitHub.
        </p>

        <h2>Summary</h2>
        <p>
          This article has provided an in depth look at applied unit testing.
          There are appromately a few thousand lines of code intended to test
          only a few hundred lines of logic, an interesting ratio. This is a
          textbook case where a high effort is placed into tests, which is not
          always appropriate.
        </p>
        <p>
          With the availability of AI, delegating test cases to a generative
          agent eliminates a lot of the effort associated with implementing unit
          tests.
        </p>
      </Fade>
    </ArticleTemplateLayout>
  );
}
