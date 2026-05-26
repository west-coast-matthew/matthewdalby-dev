import { Metadata } from "next";
import { getArticleData } from "@/utils/page-utils";
import ArticleTemplateLayout from "@/app/articles/article-template";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
import CodeSnippet from "@/components/CodeSnippet";
import { getHeaderComments, getJavaExample } from "./code-examples";

/**
 * Represents an 'individual' article.
 *
 * todo:
 *  - implement an HOC to handle the layout while we just specify content here... =or= should we
 * apply a custom selected <template className=""></template>
 */

export const metadata: Metadata = {
  title: "Matthew Dalby: Articles: API Design: Chain of Responsibility Pattern",
};

export default async function ArticlePage() {
  const { selPath, selArticle } = getArticleData("/software-engineering", "/chain-of-responsibility-pattern");

  return (
    <ArticleTemplateLayout selPath={selPath} selArticle={selArticle}>
      <Fade>
        <h2>Introduction</h2>
        <p>
          I am a big fan of design patterns. When I make observations, I try and
          look for patterns, it&apos;s in my nature. If we had a conversation
          about graphic design, I would touch on the elements of design, or
          essentially applied &apos;patterns&apos; that allow people to create
          visually appealing experiences. And what I find interesting is that
          patterns can also be applied to architecture, and of course software
          design.
        </p>
        <p>
          Personally I don&apos;t spend enough time on greenfield efforts where
          I can implement a lot of the classic patterns directly, so I wanted to
          share an actual applied real world use case. I don&apos;t believe
          memorizing common design patterns is enough, and I really make an
          effort to find practical cases where they could be applied.
        </p>
        <p>
          In this article I will illustrate how I had applied the visitor
          pattern on a past project. That particular effort involved applying an
          insane amount of business logic documented by somewhere around 70
          pages of densly packed flowcharts. The resulting code base was equally
          verbose, full of decision points, business rule implementation, and
          edge cases. Anyone tasked with diving into the routine would be
          initially expected to perhaps be overwhelmed the implementation based
          on the mere amount of source code. The good news is, the source code
          is fairly well documented, the main entry point features a developer
          friendly &apos;start here&apos; title, a reference to the famous line
          &apos;dont panic&apos; (Hitchhikers guide to the galaxy), and
          explicitly mentions the visitor pattern as the applied approach for
          the effort. Aha, suddenly you have a starting point, a framework for
          understanding the overall theory behind thousands of lines of code.
        </p>
        <p>
          The pattern is not necessarily langauge/framework specific, but we
          will hit on examples in Typescript and Java in this article.
        </p>

        <p>
          Let&apos;s take a look at how any why we apply this pattern in a real
          world scenario. I will attempt to provide just enough domain
          background to put the example into context, but not enough to infringe
          on any IP related to previous employers. The source provided is a
          simplified version of the actual implementation, however it captures
          the essence of the applied pattern.
        </p>

        <h2>
          Introducing or perhaps re-introducing the chain of reponsibility
          pattern
        </h2>

        <p>
          So we will be modeling the &apos;chain of responsibilty pattern&apos;
          for this solution. Let&apos;s dive into what example that is, the
          advantages, and what makes this a good use case.
        </p>

        <p>
          A few quick searches for this pattern yields descriptions implying
          that this pattern a good approach for applying a flexible and
          extensible chain of handlers to process requests. I particularly like
          the definition &apos;This pattern allows for a chain of objects to
          process a request, with each object in the chain having the
          opportunity to handle the request or pass it along to the next object
          in the chain&apos;.
        </p>

        <blockquote>
          Chain of Responsibility is a behavioral design pattern that lets you
          pass requests along a chain of handlers. Upon receiving a request,
          each handler decides either to process the request or to pass it to
          the next handler in the chain.{" "}
        </blockquote>

        <p>
          I won&apos;t attempt to go into a great level of detail about the
          pattern in this article, as there is a lot of excellent content out
          there that does quite an excellent job of doing this already.{" "}
          <Link href="https://softwarepatternslexicon.com/mastering-design-patterns/behavioral-design-patterns/chain-of-responsibility-pattern/">
            I highly recommend this link
          </Link>{" "}
          has a great write up on this pattern, and numerous others.
        </p>

        <p>
          In short, we have some type of parent process that delegates
          processing to a series of smaller dedicated units that handle the
          processing details. We can refer to the parent process as a
          &apos;client&apos;, and each unit applying the logic as a
          &apos;handler&apos;. by defining an interface that represents the
          contract between the client and all the handlers, we can establish a
          level of decoupling between the functional areas.
        </p>

        <h2>The domain problem</h2>
        <p>
          So a little bit of background on my past project. This was an effort
          in the beverage manufacturing space, specific the wine industry. This
          was for a large organization, which produced a very large volume of
          consumer products. The manufacturing steps involved combining wine
          from numerous sources, performing many manufacturing steps from the
          time the original grapes were harvested until the finished goods are
          packaged into the consumer ready bottle.
        </p>
        <p>
          Attempting to provide enough background here to create an applied
          example, but won&apos;t waiste any time on specifc details, in the
          interest of keeping things concise, and respect for ip related to
          previous employers. The spirit here is just provide a real world
          example of an applied pattern.
        </p>
        <p>
          A key requirement was to track varietal information. We need to know
          if the wine is a cabernet, merlot, or a chardonnay. We also need to
          know which region it originated from, which vinyard, etc. For what are
          referred to as &apos;mixed reds&apos;, the origins for any finished
          goods may be quite very numerous. So numerous that it is common to
          encounter a particular batch that has hundreds of records associated
          with it, and at some point we reach a threshold where the information
          begins to become irrelevant, and a requirement to summarize the
          records arises, for which the algorithm or process to perform the
          summarization is the focus of this article.
        </p>
        <p>
          For example, bottling 50,000 gallons of red wine would require
          gathering grapes from many different locations, as it is unlikely that
          a single location or vinyard would be unlikely. Additionally, wine
          from different locations may be blended for a desired flavor and price
          point, and of course labelling claims. Wine bottled as &apos;Sonoma
          county&apos; means that the origins originated from that location, and
          product labeled as &apos;california&apos; is a much more course
          grained definition. The number of records indicating the origins for
          the first case would be inheritly fewer than in the second. There does
          come a point where it does not make sense to keep an excessive amount
          of origin or varietal related data. For example, if we stage wine into
          that 50,000 gallon tank, we may not be concerned with the fact that
          100 gallons or .2% is not as relevant as tracking the amount of the
          final result is red, or from a particular region, etc. There is the
          point of diminishing return, where the information basically becomes
          irrelevant. For our purposed, let&apos;s call that number 200. So if
          we transfer wine from different sources into a common tank.
        </p>
        <p>
          In summary, there are a lot of steps in the wine manufacturing process
          (at scale), we collect varietal related information each step of the
          way, and sometimes we end up with too much information, and we need to
          summarize individual records to keep within a reasonable threshold of
          information.
        </p>

        <h3>Reducing the noise</h3>
        <p>
          So at a very high level, we need to start combining records into more
          generic pieces of information. As previously mentioned, more granular
          records can be combined into a more generic record. So if we have a
          record that represents a very small percentage of the overall
          contents, with very specific information, we can potentially say that
          particular record, and other similar ones, could be simply condensed
          into a single record which represents the fact that is &apos;red wine
          from california&apos; or perhaps just &apos;red wine&apos;.
        </p>
        <p>
          The same idea could be applied to candy. For example, if a particular
          batch of chocolate contains 99.9999% generic white sugar, and the
          remaining percent could be considered &apos;organic sugar&apos;. The
          fact that such a small percentage is non organic could be considered
          noise, and we can merge the two records. The inverse is true, so if
          the product is labeled as &apos;organic sugar&apos; or perhaps
          &apos;pure cain sugar&apos;, there is probably a legal requirement
          that at least a certain percentage of the overall sugar content is not
          only &apos;sugar&apos; but also &apos;organic&apos;. Yes, that is
          correct, 100% does not really mean 100% in the labeling world in all
          cases, but rather &apos;pretty damn close to 100%&apos;.
        </p>
        <p>
          So approaching the process of taking a large number of records, and
          combining the records with the smallest percentages into more generic
          records involves looping, one big giant loop, starting with the
          smallest percentage, and gradually increasing the threshold in a very
          conservating manner in effort to preserve the overall integretity is
          the approach. In this particular case, there is an additional set of
          rules that need to be applied that pertain to how and where to handle
          the process of combining or &apos;rolling up&apos; granular records
          into more course grained records also exist. These rules also have an
          order or precidence, and are applied in order of least destructive to
          more destructive. So, we have essentialy two loops executing, and
          inner and an outer, working together in the least destructive manner,
          in order to maintain as much precision as possible, until the desired
          threshold is met.
        </p>
        <p>
          The actual logic related to how things are combined are not relevant
          for the purpose of this excersize,, the important thing to remember is
          that there were around 12 in the actual implementation. So, lot&apos;s
          of looping, lot&apos;s of rules potentially applied for combining
          them. Each rule may or may not be applied based on the current
          scenario. Lot&apos;s of potential for a big ball of messy
          implementation logic and associated technical debt, and like how to we
          set ourselves up for unit testing, and minimize the effort related to
          future changes in logic?
        </p>

        <h2>Designing a solution</h2>

        <p>Let&apos;s whip up a class diagram for illustration purposes.</p>

        <p>
          So first we establish an entry point, separation of responsibilities
          applied, we just accept an collection of records. Something like,
          accept a bunch of records, attempt to see if we actually need to do
          any work, and create an outer loop.
          &apos;VarietalCompressionService&apos; is the main entry point into
          this overall process.
        </p>

        <p>
          Next we establish an interface, a decoupling between the main loop and
          the other moving pieces responsible for performing the actual work.
          &apos;Rule&apos; is the interface that all the individual rules will
          implement. This establishes a level of abstraction between the main
          orchestration piece and the individual rules. Anything considered a
          rule basically accepts a series of records, and a percentage
          threshold, and returns a potentially modified series of records.
          Essentially that is all the two roles (the main orchestration process
          and the actors that aply the actual logic) care about.
        </p>

        <h3>Throwing out a life raft</h3>
        <p>
          the logic here is to large to contain within a single file, at best a
          series of files, one for an orchestration piece, and one for each
          handler or unit responsible for performing logic. personally, if i
          were to inherit this piece of logic, I would look for an entry point,
          and start there.
        </p>
        <CodeSnippet srcCode={getHeaderComments()}></CodeSnippet>

        <h3>The actual implementation</h3>
        <p>
          So we have an outer loop, gradually increasing the percentage
          threshold, and an inner loop, iterating through a series of rules,
          each rule implementing a common interface. Each rule gets a chance to
          apply its logic, if applicable, and the process continues until we
          reach the desired threshold.
        </p>

        <CodeSnippet srcCode={getJavaExample()}></CodeSnippet>

        <h3>A few observations</h3>
        <p>
          The percentage thresholds in the outer loop are defined as constants,
          small tweak in the event that we may need to alter this behavior.
        </p>
        <p>
          Rules link to each other, however are are themselves decoupled as they
          maintain the level of abstraction via their shared common interface.
          reordering them, adding or removing new rules becomes a simple linked
          list type operation.
        </p>
        <p>
          Breaking down the core logic (rules) results in smaller more testable
          units. by externalizing a lot of the details provided to the rules, we
          inheritely can mock data to inject into implementations, we make the
          process of applying testing much easier to facilitate.
        </p>
        <p>
          The &apos;client&apos; or main orchestration piece is fairly concise,
          easy to read, and understand at a high level. It does define the
          rules, and the order they execute in, however the rules operation
          independantly of each other, which allows updates to be performed in
          an isolated manner. Changes the the logic may be esaily applied, and
          even changes to the order of execution or addition/removal of rules
          can be performed with minimal impact to the overall process.
        </p>

        <h3>The resulting Java implementation</h3>
        <p>
          The following is an implementation in Java. I will skip the Node
          implementation as it would be redundant.
        </p>
        <CodeSnippet srcCode={getJavaExample()}></CodeSnippet>

        <h2>Conclusion</h2>
        <p>
          Apologies up front for any unintended transgretions into the domain
          project, my intent was to give the proper level of background to
          support a real world example. My goal was to apply a concrete
          implementation of a design pattern, in this case the &apos;chain of
          responsibility&apos; pattern. I personally don&apos;t feel that there
          is enough real world examples of applied usage of these, a lot has to
          do with IP (totally get it).
        </p>

        <p>
          Design patterns are a powerful tool in a software engineers toolbox.
          Understanding them, and more importantly, understanding when and how
          to apply them is a skill that takes time to develop. I hope this
          article has provided some insight into a real world application of the
          chain of responsibility pattern.
        </p>

        <p>
          There are numerous potential approaches towards this particular
          problem, however by applying the appropriate pattern we align with a
          more consistent, best practice based approach.
        </p>

        <p>
          This approach might appear to be overkill, however in the actual
          implementation, the level of complexity and numerous rules made this a
          very practical approach. From a business perspective, the rules are
          subject to change, and new ones may be added over time. By applying
          this pattern, we set ourselves up for easier maintenance and
          scalability in the future. A very common scenario is one where where
          something is &apos; built &apos; and a seemingly simple request for a
          change comes along, which is percieved as a small change. In reality,
          when dealing with software that is not optimally designed, even a
          small change can have far reaching implications, and can result in a
          significant amount of rework. By applying design patterns, we can
          mitigate some of these risks, and make our software more adaptable to
          change.
        </p>

        <p>
          It&apos;s fairly easy to get lost in a world of day to day coding,
          implementing boilerplate logic such as servicing CRUD operations, etc.
          I would encourage everyone to take a step back from time to time, and
          think about the bigger picture, the architecture, and how design
          patterns can be applied to create more maintainable, testable, and
          scalable solutions. There is a difference between writing code to
          support a service and perhaps writing the source that actually is
          behind the application server that powers the service. Dig deeper...
          challenge yourself!
        </p>

        <p>Recommended links</p>
        <ul>
          <li>
            <Link href="https://softwarepatternslexicon.com/mastering-design-patterns/behavioral-design-patterns/chain-of-responsibility-pattern/">
              https://softwarepatternslexicon.com/mastering-design-patterns/behavioral-design-patterns/chain-of-responsibility-pattern/
            </Link>
          </li>
        </ul>
      </Fade>
    </ArticleTemplateLayout>
  );
}
