---
title: "Auditing Complex Processes"
date: "July 5, 2024"
excerpt: "Transitioning complex processes from a black box"
readTime: "12 min read"
category: "Software Engineering"
---

## Introduction

      
        

          I have had my fair share of experience designing, implementing, and
          supporting large sets logic. And by large, I mean roughly anything
          that could be flowcharted in perhaps a dozen pages or more meets that
          criteria. If you find yourself writing, supporting, or enhancing a
          process that might seem overwhelming, this article is for you. Here
          are a few examples of applications that might meet this criteria.
        

        

          * Complex tax calculations

          * A routine that performs composition calculations on a product

          * A process for calculating payments based on a large set of variables

          * A loan offer calculation routine (we will be using this as an
            example)

        

        

          This level of complexity presents a challege as you are essentially
          building a black box. By default, developers might make use of
          logging, however the traditional approach does not really fit well
          into scenarios where you need an in depth detail about the decisions
          were made for a given transaction.
        

        

          In this article I will talk a bit about my personal experience, and
          the solution that I learned to apply towards these types of cases. For
          the purposes of illustration, I will throw in an demo application. I
          have learned 'a thing or two' through my experience, and
          wanted to share that.
        

        

          A project is available on GitHub{" "}
          [
            https://github.com/west-coast-matthew/blog-process-monitoring
          ](https://github.com/west-coast-matthew/blog-process-monitoring){" "}
          which illustrates the concepts discussed in this article. The project
          is a Node/Typescript application, however the concepts can be applied
          to other stacks as well.
        

      

      
        

## Tackling my first complex business logic routine

        

          At an early point in my career, maybe about 5 years in (they call that
          mid level these days) I jumped on a large rewrite of a well
          established legacy application. It was the largest for that purpose in
          the world, written for the largest company in that industry space in
          the world. I admit, this was a bit intimidating at the time, but I was
          young, confident, and really proficient at what I was doing, ready to
          tackle the world. I could only define the experience as something I
          was completely unprepared for, lessons learned are the focus of this
          article.
        

        

          My experience in that scenario started out with a very well intended
          attempt to document a legacy process, we ended up producing a 40 page
          flowchart document, tighly packed with edge cases. As a visual person,
          I ended up taping the consecutive pages together which resulted in
          something like a somewhere a 30 ft document. Although a bit hard to
          physically manage, this worked for me as I am a very visual person.
          The document became a visual aide for my peers to give me a well
          intended hard time, a series of references to myself and the
          'captain of the Titanic' were common.
        

        

          A drilled forward with with my efforts, we have a hard deadline of
          around 6 months to implement, test, and ship, single developer, no
          pressure right? I built the routine to spec, composed of granular,
          purposefull specific methods, each backed by well thought out unit
          level tests.
        

        

          If the immediate ask was to build something acording to a spec, to
          replicate an legacy process, then I would call the teams efforts
          successfull. It compiled, unit tests passed, manual testing passed,
          and we obtained business sign off. Life seemed good, mission
          accomplished!
        

        

          Fast forward a few months later, we were hit with a barrage of support
          related questions. In contrast to the legacy application we had
          replaced and the set audience, the rewrite was part of larger effort,
          a larger user base, new feature requests, and changes in business
          processes resulted in an unanticipated level of support related
          issues.
        

        

          Support for the routine began to approach a full time role for at
          least to FTEs, my self included. Researching what had happened became
          like a full time effort, no bueno.
        

      

      
        

## A revised approach

        

          On the project I had mentioned above I found myself responding to
          frequent requests to results of various transactions. This was a time
          consuming process as I had only basic logging instrumented into the
          application. There was no way to debug the issue locally as the data
          was only in production, so I realized on going through large sets of
          log entries, with each request taking in upwards of 2 hours or more.
          These painfull sessions quickly drove me to pause and reflect on the
          black box we had sucessfully deployed.
        

        

          As a result of rethinking the implementation, I came up with a concept
          for bringing a higher level of visibility into the application. The
          solution involved instrumenting the application with an
          'agent' which aggregated information from events ocurring
          during each transaction. The events were stored in an hierarchal
          format, and then published into an easy to digest format, a format
          which allowed an analyst with no technical knowledge to clearly and
          concisely review any given translation.
        

        

### The problem with traditional logging

        

          Traditional logging is flat, with each entry ocurring in sequence.
          This is fine for scenarios where it is appropriate to search for a
          series of tighly related entries for basic troubleshooting. When
          performing functions such as auditing a complex process, you typically
          will find yourself looking at a larger set of information, and the
          limitations of linear logging events become apparrent.
        

        

[Logging Approaches || Logging Approaches || /article-content/se/business-logic-monitoring/bpm-logging.png]

        

### Utilizing Agents

        

          An alternate approach towards auditing transactions is to utilize an
          agent. The agent is responsible for intercepting events during any
          given transaction, storing them for the duration of the request, after
          which point the events are published to an final destination where
          they are ready for consumption. Instead of storing events in a linear
          sequential manner, the agent collects them in an structured manner.
        

        

          In some cases an process operates in an isolated manner, where all
          calculations occur within a single process. The agent could easily be
          deployed with the process it si monitoring itself. In other cases a
          process performs calculations which are dependant on information
          derived from APIs. While we cannot gather information from third party
          APIs, however we can apply this strategy to instances where the higher
          level operation is conducted across different processes exposes as
          internal facing APIs. For those scenarios, an agent would be
          instruented into each independant process, and a messaging bus would
          be used to share the events with a common agent responsible for
          translating them into a final report, illustrated as follows.
        

        

[Multiple agent scenario || Multiple agent scenario || /article-content/se/business-logic-monitoring/bpm-architecture.svg]

        

          Next, we will take a look at an application simulating a lengthy set
          of logic in order to illustrate how this approach to auditing could be
          applied.
        

      

      
        

## An Example Implementation

        

          I am going to present an example of an concept application which
          performs a fair amount of business logic. Our example application
          takes place in the financial domain. Essentially a routine than is
          responsible for calculating loan terms based on a number of factors.
          In addition to an applicants income to debt ratio, address validation,
          criminal background checks, and other checks are performed. We
          won't be implementing the actual logic in this effort, so the
          services required to perform these actions are basically stubs,
          however enough to emulate what could be considered a complex process.
        

        

The application can be found at the following Github URL.

        [
          https://github.com/west-coast-matthew/blog-process-monitoring
        ](https://github.com/west-coast-matthew/blog-process-monitoring)

        

          The entry point to the application is located at
          ./src/loan-app-processor.ts. The *processLoanApplication* method
          serves as the main entry point. You will notice in this method simply
          generates a unique id for the current transaction, and then puts the
          transaction into a context which is shared for the duration of the
          operation. Since the example application is a Node/Typescript
          implentation, we are working with *AsyncLocalStorage*, however
          for Java based apps, *ScopedValue* and *ThreadLocal* would
          be used. In either case, the concept is the same, by pinning a
          reference to an value or object into a request scope, we avoid the
          requirement to pass it as an argument between methods, which would
          cloud up the code base.
        

        

[code]
(loan-app-processor.ts)

// Process entry point
export const processLoanApplication = (app:LoanApplication):LoanApplication =>{
    console.log(`attempting to process new application.`);

    const transactionId:string = AuditAgent.initTransaction();
    storage.run({ transactionId: transactionId }, () => {
        processLoanApplicationInternal(app);
    });

    return app;
}

...finally{
    AuditAgent.endTransaction();
    return app;
}
[/code]

        

          Starting at line 9 in the above snippet, we iniitate the process, at
          which the transaction id resides in a context shared across the
          request. The higher level of operations is encapsulated by a
          try/catch/finally clause, and line 17 in the snippet illustrates a
          point where the auditing agent recieves notification that the series
          of operations have terminated, initiating the events need to be
          translated into the final report.
        

        

### The agent implementation

        

          The *src/monitoring/* folder contains agent related files
          consisting of the agent (audit-agent.ts) and another file responsible
          for translating the event data (publisher.ts) into the final report.
          The agent itself works with a data structure (.ts) to store event
          information. You will note that the data structure is an hierarchy of
          objects, with each branch representing a group
        

        

          Let's breakdown the overall process. A main method
          (processLoanApplicationInternal) is wrappered by the entry point. The
          main method in turn acts as an conductor, calling a series of
          services, each responsible for a specialized function, such as
          performing a calculation, or callig an API. The key take away is that
          there are a series of logic points, each of which could be considered
          a high level step in a series of events. Additionally, each high level
          step also could be further broken down into sub steps. Events are
          associated within a group, which provdes the ability to organize them
          more clearly for analysis. Keep in mind, there is just enough logic in
          the application for the purposes of illustration, in a real world
          application we would be dealing with much more logic, collecting
          hundreds of data points, so organization is key. This will become more
          clear after viewing the example reports below.
        

        

[code]
export const validateAddress = (address:Address)=>{
    try{
        AuditAgent.initGroup('Address validation');
     
        // Basic string checks
        assertAttributePresent('Street',address.street);
        assertAttributePresent('City',address.city);
        assertAttributePresent('State',address.state);
        assertAttributePresent('Postal Code',address.postalCode);

        // Emulate an API call to an address service API
        mockApiCall();

        AuditAgent.recordMessage(`Applicant address for ${address.street},${address.city} is considered valid.`);
        
    }
    finally{
        AuditAgent.endCurrentGroup();
    }
}
[/code]

        

          The about source is an example of how the transaction boundaries are
          established around a unit of work. Line 22 reflects the interaction
          with the audit agent. Basically only an message is sent to the agent.
          The caller, in this case *AddressValidationService* needs only to
          communicate with the agent in a static manner, and the agent itself is
          responsible for associating the message with the current transaction
          id. The interaction itself is pretty straightforward, but you will
          note there is a modesto amount of work required to setup the
          transaction boundary. It is a tradeoff between enhanced visibility and
          a cleaner code base.
        

        

### Publishing reports

        

          This implementation uses HTML for the final report output. PDF is
          another option, however I would take into consideration the fact that
          in the event your reports span multiple pages (as was the case on many
          of my previous projects) presenting information in a top to bottom
          format may result in an overwhelming amount of information. HTML
          provides the ability to apply CSS and Javascript functions that would
          allow the consumer to expand and contract entries at each level for
          easier readability.
        

        

[Final Transaction Report || Final Transaction Report || /article-content/se/business-logic-monitoring/final-report.png]

        

          The above example illustrates a detailed snapshot of the series of
          events. Internal compliance, anaysts, external regulatory agencies can
          all easily interpret the decisions made during the given process
          execution. This does require domain knowledge, however not any real
          level of technical expertise, placing the information of the right
          audience.
        

        

          Again, this is a simplified version to illustrate a concept, however
          real world scenarios can easily run multiple pages, with each section
          potentially containing dozens of messaging entries. Would strongly
          encourage anyone to explore options to implment functionality to
          collapse columns in order the user to start analysis at a high level,
          and then expand/drill down on an as needed basis (I should probably
          roll this into my demo at some future point).
        

        

          The publishing is performed the file
          './src/monitoring/publoisher.ts'. In this implementation, I
          decided to use a templating library (handlebars) to translate the
          event data structure into the final HTML report. In the past I have
          also taken an approach where the report data was initially serialized
          into XML, and then an XSLT translation was performed in order to
          produce the final output.
        

      

      
        

## Summary

        

          After learning my lesson the hard way after my first attempt at
          tackling a complex business logic process, and the refactoring, this
          has really changed by attitude towards system design. When I identify
          project that meet my definition of 'complex business logic',
          I immediately raise up the topic of auditing, which usually drives the
          larger conversation.
        

        

          Keep in mind that large complex processes are hard to test and
          validate. There is a natural assumption from the perspective of others
          that if the results do not match the expected inputs (assuming they
          are correct in the first place), is some type of software bug. Raising
          visibility into the hands of the stakeholders is critical. In the case
          of my previous experiences, hundreds of millions of dollars were on
          the line, this type of visibility becomes paramount to answering
          questions where a lot of capitol is on the line. For other scenarios,
          operating under tight regulatory compliance constraints, an inability
          to validate transactions can lead to financial and even criminal
          consequences.
        

        

          I hope this article, and the accompanying project drives a though
          process on how this approach on the projects you are engaged with in
          the future. With software impacting a lot of aspects of our every day
          lives, by promoting discussions on best practices in this industry
          helps the overall effort for the industry to produce more reliable
          software.
