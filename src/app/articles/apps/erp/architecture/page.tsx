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
        <p>
          This application was modeled after a real world project I had worked
          on. I wanted to address a lot of the technical debt encountered during
          the original effort. Given an A for effort, business constraints, and
          technical limitations at the time the tech foundation was originally
          authored, the results from the implementation left a lot of room for
          improvement.
        </p>

        <p>
          Without any formal constraints, my efforts here are intended to
          address a few technical debt encountered by the original design. Here
          are a few of
        </p>

        <h2>A system overview</h2>
        <p>First let&apos;s take a look at the high level requirements</p>
        <ul>
          <li>
            Ability to record requests for work (work orders) and manage the
            state during the lifecycle
          </li>
          <li>
            Ability to calculate the resulting contents of a storage unit (tank)
            after an operation
          </li>
          <li>Ability to trace operations historically</li>
          <li>
            Ability to provide administrative type maintenence of seldom
            changing data
          </li>
        </ul>

        <p>
          All user interfaces are implemented in React, and will communicate
          with a series of APIs via REST calls. In addition to servicing
          requests from the UI, requests for inventory calculations are handled
          over a messaging bus as they are handled in an asynchrous manner due
          to the potentially long running nature of the calls. For example,
          updating a work order issued 90 days ago may impact thousands of
          movements which have occurred after that date, and the resulting
          calculations make take in upwars of five minutes to complete.
        </p>

        <p>
          The decision to utilize React over Angular was just a matter of
          personal preference. In reality, angular has a lot of penetration
          within the enterprise space.
        </p>

        <h2>General project structure</h2>
        <p>
          Whereas the original application was implemented as a monolith
          application, the decision was made in this effort to divide the
          application into several individual projects. There a lot of
          conversations floating around out there that are focused on a single
          project vs. a microservice approach. In my opinion, this is a false
          argument, this is not an all or nothing option. There are all levels
          in between deconstructing an applicaion into separate
          projects/deployable units.
        </p>

        <p>
          Based on a lot of reflection, I decided on the following project
          structure. The naming convention follows a common prefix, following by
          a middle token, and then either an &apos;api&apos; or &apos;ui&apos;
          suffix, indicated if the module is either an front end or back end
          project. And finally, givne the fact we are attempting two independent
          stack implementations, every project will finally be annotated with
          either an &apos;java&apos; or &apos;node&apos; suffix.
        </p>

        <table>
          <th>
            <td>Project Name</td>
            <td>Description</td>
          </th>
          <tr>
            <td>erp-core</td>
            <td></td>
          </tr>
          <tr>
            <td>erp-entity-mgmnt-api</td>
            <td></td>
          </tr>
          <tr>
            <td>erp-entity-mgmnt-ui</td>
            <td></td>
          </tr>
          <tr>
            <td>erp-work-order-mgmnt-api</td>
            <td></td>
          </tr>
          <tr>
            <td>erp-work-order-mgmnt-ui</td>
            <td></td>
          </tr>
          <tr>
            <td>erp-composition-mgmnt-api</td>
            <td></td>
          </tr>
        </table>

        <p>
          The core modules immediately become an apparent need as there is a lot
          of code that is shared across all modules.
        </p>

        <h2>Notable points between Java and Node implementations</h2>
        <p>
          Given the history of Java, major market penetration in the enterprise
          space, years ahead of the node ecosystem, there has been a lot of time
          for the dust to settle. The Spring framework has become an de-facto
          standard, so when I jump onto Java projects, Spring is an assumption,
          and that allows me to make a lot of assumptions about project
          structure. Node in contrast, slower to evolve initially, much more
          opionated, and moving at a faster pace. Don&apos;t shoot the messenger
          here, just a few observations. I would be hard pressed to pick a
          favorite/preferred stack, everything is project specific. Again, this
          effort will implement a solution in both stacks.
        </p>

        <p>
          From a Java perspective, Spring (Spring MVC, Spring Data (JPA), Spring
          Messaging) make up a familliar proven stack. When it comes to the Node
          implmentation, this get a little more opinionated. Express/TypeORM
          consists of most of the effective stack.
        </p>

        <p>
          My hopes are that this effort is not interpreted as an set in stone
          perspective on my part, just how I would author an application in both
          stacks.
        </p>

        <h2>The persistence tier</h2>
        <p>
          This application, as most enterprise applications are defined, has a
          direct dependency on a relational database. While there are no
          shortage of use cases for other persistent stores, such as Mongo, the
          key driver here is that there is a reporting requirement which would
          in theory make use of third party applications for business
          intelligence type functions, most of which rely on well established
          RDBMS technology.
        </p>

        <p>
          From a Java perspective, Spring data is sort of a defacto choice. As
          per Node, a decision was made to use TypeORM. There are a number of
          options available, and a lot of opinions to match. I personally like
          TypeORM as it supports annotations(referred to as decorators in
          Typescript).
        </p>

        <p>
          A lot of effort has been put into validation on the entities. I
          believe this is a quite often overlooked aspect of application
          development.
        </p>

        <h2>Separation of tiers</h2>
        <p>
          In both stacks, the source is split into 3 tiers, which is a common
          practice, often referred to as <i>three tier architecture</i>. This is
          a common practice.
        </p>

        <h2>
          Making the case for establishing a dependency on an messaging engine
        </h2>
        <p>
          A core function of the application is the calculation of the
          composition of the contents of a given tank after a operation has been
          performed. For example, when contents from two tanks are merged into a
          single destination tank, where the origins from each of the source
          tanks are from different orchards, we need to calculate what
          percentage is associated with each origin in the new destination tank.
        </p>

        <p>
          While this operation typically does not take a long of time, making a
          change at some past point in time requires recalculation of every
          movement that is impacted by that historical change. That scenario
          could be considered a potential long running operation, and therefore
          is executed in an asynchrous manner.In order to service these
          requests, a dedicated project was established, and a messaging bus was
          used to coordinate requests.
        </p>

        <h2>Controller Design</h2>
        <p>
          REST is the standard protocol for all API implementations. There are a
          lot of discussions around REST vs GraphQL. My personal take is that
          REST works really well, until you hit cases where it does not work,
          and then GraphQL becomes a great option. So I have a tendency to
          default to REST as an option, unless there is a strong reason to avoid
          it.
        </p>
        <p>
          I have a well defined opinion on what a controller, or REST endpoint
          should be responsible for. Basically they should map a request to an
          entry point into business logic, and that is essentially about it.
          Lightweight, and purpose specific. Avoid placing any logic into
          controllers, or at least as minimal as possible. Any references to the
          http request object should be converted into data structures prior to
          calling the service tier. The service tier should be completely
          unaware of the fact the originating call we the result of an HTTP
          request.
        </p>

        <p>
          In both stack implementations, certain logic such as exception
          handling and authentication is handled via what is referred to as
          <i>middleware</i> or <i>filters</i>. The concept basically is in
          reference to a central point where logic is placed in a place where it
          is applied at a global level.
        </p>

        <h2>Support for administrative functions</h2>
        <p>
          As with many applications, there are certain functions that could be
          described as administrative, where a dedicated group of users performs
          occasional updates to certain sets of data. For instance, in an
          ecommerce scenario, managing products, product categories, etc. would
          be performed by a role with special security, whereas most users of
          the system would be consumers and perform operations though other
          interfaces. Projects related to this functionality were established
          using the naming convention &apos;entity-mgmnt&apos;, and as the name
          implies, their purpose is to manage these entities. Details for these
          modules are covered in part 4 and part five of this series.
        </p>
      </Fade>
    </ArticleTemplateLayout>
  );
}
