import { Metadata } from "next";
import { parseHeaders } from "@/utils/page-utils";
import ArticleTemplateLayout from "@/app/articles/article-template";
import CodeSnippet from "@/components/CodeSnippet";
import { getArticleContent } from "@/app/articles/api-design/designing-controllers/code-examples";
import Link from "next/link";

/**
 * Represents an 'individual' article.
 *
 * todo:
 *  - implement an HOC to handle the layout while we just specify content here... =or= should we
 * apply a custom selected <template className=""></template>
 */

export const metadata: Metadata = {
  title: "Matthew Dalby: Articles: API Design: Effective REST conroller design",
};

export default async function ArticlePage() {
  const { selPath, selArticle } = await parseHeaders();

  return (
    <ArticleTemplateLayout selPath={selPath} selArticle={selArticle}>
      <h3>Introduction</h3>
      <p>
        I have been working with APIs for over two decades. Here I want to share
        my thoughts on basically cross application protocols related to how
        applications talk to each other, with really specific context to
        designing REST APIs. I will briefly touch on a little history here, but
        just to help frame things. The goal of this article is to give some
        opinion common beast pratices, anti-patterns, with the goal of just
        driving a thought process. At the end of the day, there is no right
        anwser and really any solutions are just super relevant to a
        project/requirements specific scenario.
      </p>

      <p>
        If you are especially reading this from the perspective of a dedicated
        role where you are focused on consuming data from a frontend perspective
        (React, Angular, name it...) then we are probably making assumptions on
        we just &apos;consume&apos; stuff from a backend via JSON under most
        common use cases.
      </p>

      <p>
        So a problem domain exists in where we need to have multiple systems
        working together, communicating across different operating systems,
        languages, that creates unique problem. Like how to we even approach
        this? If this browser to APi backend, internal system to internal or
        perhaps external partners? There are two contrasting approaches here,
        light coupling vs closer coupled approaches. The attempt of making two
        different &apos;things&apos; work together is nothing new, however there
        is a level of informamilty or lack of that comes into play. Distributed
        systems are hard to build, especially when truly distributed
        transactions come into play.
      </p>

      <p>
        The scope of my thoughts here are primarily focused on a generalized
        approach to defining REST based APIs. So like, what works, what does
        not, and there is a strong assumption that we are focuced on a lot of
        basc use case, and where I see them break down. This really focused on a
        common use case, i.e. where we perform REST based calls from an
        assumption that we default to JSON and a nature of very CRUD based
        operarations.
      </p>

      <p>
        I could elaborate for a bit more on remote system protocols (Soap, EDI,
        EJB, OpenRPC, RMI, GrahpQL, RMI), language implementations, blah blah
        blah, we are just focusing on Vanillia common use case REST stuff here.
        Long history of &apos;how to talk to other stuff between systems&apos;,
        let&poss focus on JSON over generally regonized REST interfaces here.
      </p>

      <h3>Fast/vs matainianable</h3>
      <p>
        Let &apos; take a look at a few examples, common content for how to
        create APIs...
      </p>

      <CodeSnippet
        srcCode={getArticleContent("basic-rest-contoller.examples")}
      ></CodeSnippet>
      <i>
        Not building rockets here, the above is a few snippets of &apos;hello
        world&apos; examples of basic entry points for REST controllers. that is
        enough to get anyone up and running, however by any measurable means,
        not an real world example. Not trying to oversimply here, however a few
        steps further and we are making calls here to the persistence tier, the
        beginnings of a storm are introduced here for more logic.
      </i>

      <p>
        I am not going to knock anyone for POC work at this level, but the point
        here is this is not production ready code. Startup, get it, however like
        way, way to manytimes this makes it into production (actually if you are
        a startup trying to hit market, pm me, ther eis an easier way).
      </p>

      <p>
        The goal here is to focus on more longer term matinainable
        implementations, yes with an investment on proper design, but more often
        then not, I observe bad API implementations based on poor practices, not
        lack of resources
      </p>

      <p>
        This article will focus on a three tiered approach, which reflects a
        modular design, separation of concearns, empahsis on testability.
      </p>

      <h3>Controllers/Routers/Entry point definitions</h3>

      <p>
        Unapoligetically, I support thin, lightweight controller logic. This is
        irrelvant of any stack implementation, focus on separation of concearns.
        From my perspective, we separate concearns and the entrypoint into an
        API enpoint should contain minimal logic.
      </p>

      <p>
        Simply put, controllers (routes in node.js ) or pick your flavor of
        system to system entrypoints are by nature intended to be light weight,
        interceptors of requests, delgating things to other area of code
        (separating concearns). Deceptively so, a necessary evil. Imagine
        getting on a plane, in a foriegn country, and I mean you don&apos;t
        neccarily speak the language. You get there, the staff involved gets is
        all figured out
      </p>

      <p>
        Exposing request and response related data to service level logic should
        be avoided. Details of how the data is staged should be abstracted from
        the service tier. While I have personally observed HttpRequest types
        arguments in the Java world passed to services, this has typically
        served as a sign of larger architectual issues.
      </p>

      <h3>Exception Handling</h3>
      <p>
        Over a series of past projects, I have been able to observe a few
        different approaches towards reporting exceptions. While there is no
        real standard for reporting exceptions, the HTTP status codes are a good
        start. The RFC 9457 proposal looks promising, I am not completely sold
        at this point. Returning 200 status codes when an operation fails is,
        well bad. I have seen this implemented in more projects than I care to
        admit. The HTTP Fetch API natively handles response codes, where non 200
        block codes are treated as actual exceptions, as they should be.
        Let&apos;s take a look at an example.
      </p>

      <CodeSnippet
        srcCode={getArticleContent("fetch-request-example")}
      ></CodeSnippet>
      <i>An example of an exception masked by an 200 response code</i>

      <p>
        So the above example illustrates uneccessary logic required for
        exception handling. In my opinion, a hack, a sign of an unstable code
        base, and possibly that you may want to find a new gig as this is an
        early sign of potentially larger technical issues. Sending a message
        indicating an status code is bad practice as the codes, messages, would
        require effort to transmit and remain consistent across all calls. Worse
        yet, in the above example, this approach was not consistently
        implemented across the application, and the codes were not implemented
        in a consistent manner.
      </p>

      <p>
        As a personal preference, I practice strict adherence to HTTP status
        codes, with the addition of request headers as appropriate to provide
        additional details as appropriate
      </p>

      <p>
        You can find some related information
        <Link href="/articles/api-design/exception-handling">
          &nbsp;in this posting on exception handling.
        </Link>
      </p>

      <h3>Separation of concerns</h3>
      <p>
        Controllers should be lightweight/anemic. Logic should be delegated to a
        &apos;service&apos; tier. They should be concearned with translating the
        payload into some type of structure that does not reflect the transport
        mechanism.
      </p>

      <h3>Pagination by default</h3>
      <p>
        When requesting data, pagination should be a core consideration. I would
        recommend defaulting to that approach, and making exceptions on an as
        needed basis. This is especially true when wokring on greenfield
        projects, where data is not present and expected to grow. Avoid future
        Jira tickets, and take an proactive approach towards design.
      </p>

      <h3>Request Validation</h3>
      <p>
        Validation &apos;should&apos; be performed as early as possible in the
        request process. It really makes no sense to send invalid data to a
        service tier, which may result in invalid results or harder to interpret
        exceptions. Identify bad input as early as possible, and send
        descriptive messages back to the client.
      </p>

      <p>
        Java does a great job of performing validation on requests. Validation
        logic may be applied on the object itself via annotations. Let&apos;s
        take a look at an example.
      </p>

      <CodeSnippet
        srcCode={getArticleContent("spring-bean-validation")}
      ></CodeSnippet>
      <i>Implementing controller level request validation</i>

      <p>
        The above example illustrates catching invalid exceptions early on in
        the request process. The annotations provide a clean mechanism for
        defining validation logic. In the Node.js world, there are other
        options, but not a clear direct equivelent to this approach. This will
        require a bit more work.
      </p>

      <h3>Make use of cache directives</h3>
      <p>
        An often overlooked aspect of API design is defining the relevancy of
        the data. The topic of real time data, server side pushes, etc. could be
        considered &apos;sexy&apos; and attract a lot of attention, however
        optimizing caching strategies does not get enough attention in my
        opinion.
      </p>

      <p>
        There is a lot of HTTP header level standards out there such as
        &apos;Cache-Control&apos; that may be utilized for optimizing data
        retrieval. While it is true that these are essentially hints to the
        client, they are low effort. Yes, it&apos;s true that more than likely
        you are deploying to the cloud, and scaling is fairly easy to implement,
        resources do cost money.
      </p>

      <p>
        The web API fetch command natively respects the cache related headers
        passed from API responses, so for web based clients (i.e. Javascript)
        you inherit cache control for essentially free. As a personal
        observation, I rarely see the use of cache related headers applied.
      </p>

      <p>
        Take for example an high traffic ecommerce site. Product categories
        represent a set of data that seldomly changes. It makes natural sense to
        indicate to the client that the information seldomly changes.
      </p>

      <CodeSnippet
        srcCode={getArticleContent("cache-control-examples")}
      ></CodeSnippet>
      <i>Explicitly indicating to the client that data is safe to cache</i>

      <h3>Summary</h3>

      <ul>
        <li>
          Keep controllers as lightweight as possible, delegating operations to
          other tiers as appropriate.
        </li>

        <li>
          Maintain strict adherence to the correct HTTP status codes, especially
          when reporting exceptions.
        </li>
        <li>Perform request validation as early as possible</li>
        <li>Make use of cache directives as appropriate.</li>
      </ul>
    </ArticleTemplateLayout>
  );
}
