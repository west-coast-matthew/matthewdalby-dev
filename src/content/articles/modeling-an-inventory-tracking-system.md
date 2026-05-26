---
title: "Modeling an Inventory Tracking System"
date: "June 13, 2025"
excerpt: "A deep dive into modeling an inventory system used in the beverage manufacturing process"
readTime: "20 min read"
category: "Software Engineering"
---

## Introduction

      

        I wanted to create a side project to keep my tech skills sharpened, and
        also to provide an example of my work (employers tend to want to see
        this kind of thing). I decided to skip all the usual ecommerce, twitter
        clone, social media type examples and work with a more real world
        example. After some carefull thought, I decided to revist an actual past
        project I had worked on in the past where our team was responsible for
        implementing an ERP type system, specifically one responsible for entry
        of work orders, and updating inventory related information.
      

      

        So basically this project models the internals of tracking activity
        during a beverage manufacturing process. We need to support the ability
        to select a given piece of equipment, and gain visibility into all
        related recent activity. Additionally, in the event of a product recall,
        we need to support the requirement to trace all impacted products from a
        root cause for the recall. This is a good illustration of implementing
        logic beyond supporting simple CRUD operations, and the unit level
        testing efforts surrounding it.
      

      

        This past project particularly sparked my interest as there was a lot of
        technical debt associated with the project, inclusive or some bad design
        decisions, performance issues, and an outdated tech stack. In all
        fairness, a lot of effort went into the design, however at the time of
        the implementation (around the early 2000s) a lot of the technical
        options we take ever so for granted these days either did not exist or
        were in their infancy. These include widespread adoption of messaging
        queues, and the browser's inherit ability to make asnyc calls to
        API endpoints. Yes, that right, there was a time when Ajax type calls
        did not exist! The application was a monolith, packed full of complex
        business logic, and was anything but performant. Although the
        application was a true nightmare, the lessons learned I would describe
        as nothing short of an invaluable learning experience, worth it's
        weight in gold. It turns out, the system was the largest globally for
        that market space, driving mission critical operations for a fortune 500
        company, with all the complexities to match. Let's briefly dive
        into a few of the pain points.
      

      

### Large monolithic application

      

        The application consisted of just under 200 screens, supported by around
        300 tables in an RDBMS. Deployment was 'big bang', where the
        entire application was packaged and shipped during a promotion cycle.
      

      

### Overall poor performance

      

        Performance was an issue, and could be described as 'slow' and
        'slower'. This was a result of inneficient use of an ORM
        layer, inclusive of the mapping of persistent objects into value object
        equivilents. ORMs are fairly easy to implement, however without carefull
        thought, they can lead to inneficient interactions with data. In one
        common use case for example, it was common to observe 3,500+ queries
        issued to display around 150 records.
      

      

### Tightly coupled design

      

        As I had previously mentioned, this was a limitation of the tech
        available around the early 2000 period. State was managed on the server,
        not in the browser. An insane amount of work was required to track
        uncomitted chages as the user navigated through the application.
      

      

        Fast forward to an modern day architecture. This effort on my part is a
        chance to revisit what I affectionately refer to as 'the
        beast'. With modern tech options, and no upper level management to
        act as a bottlneck for decisions, I was pretty exited to take on a
        rewrite. Given that fact that this is a side effort, I will only be
        attempting to implement a subset of the functionality, however enough to
        illustrate the concept and demonstrate specific optimizations.
        Additionally, I will change the actual industry in which the system is
        designed for in order to preserve any potential IP on behalf of my
        former employer.
      

      

        Too keep things interesting, I decided to provide implementations in two
        different tech stacks, and I reserve the right possibly at some future
        point to perhaps add an Python implementation as well. I am very
        comfortable in Java/Spring and NodeJS/Express/TypeORM, so I decided to
        provide implementations in those two stacks. In order to make the most
        effective use of my time, I made use of a code generation framework I
        use to reduce boilerplate code. While AI/Vibe coding, etc. appears to be
        all the hype these days, I have been working with code generation
        technologies for over a decade, and the current AI solutions just quite
        are not there yet.
      

      

        Source for the project is available under my GitHub account at the
        following location
        [
          https://github.com/west-coast-matthew/blog-tank-tracing
        ](https://github.com/west-coast-matthew/blog-tank-tracing)
      

      

## An overview of the domain problem

      

        This application is targeted for the beverage manufacturing space. Raw
        materials are basically purchased, for which a series of operations are
        performed, until finished consumer good are produced. For illustration
        purposes, we will design the system for an imaginary organization that
        produces various fruit juices. In addition to recording operations,
        tracking work status, and calculating inventory levels we need to
        support very strict legal compliance work flows. This includes
        maintaining the ability to historically track product origins, which
        components were used during the manufacturing process, which lots they
        are associated with. This is critical for scenarios where a product
        recall comes into play, this requires very accurate recording of all
        activity, as peoples health may be at risk. This may not seem very sexy,
        however this involves the use of data structures, and within hte scope
        of my efforts some performance optimizations to meet the needs of of a
        somewhat unique use case.
      

      

        I will go into a bit more details about the domain problem for the
        purposes of providing just enough background to understand my design
        decisions, but feel free to skip ahead to the following sections that
        address the more implementation specific details.
      

      

### Work orders

      

        This should be a familliar in the manufacturing space, this should be a
        familliar concept, however I will touch on this a bit. Basically a work
        order is just a record of an operation, or some type of work to be
        performed.
      

      

Work orders assume the following states:

      

        draft->ready->in progress->completed->validated / cancelled
      

      

        The general series of steps should be relatively self explanitory, with
        the golden path resulting in a final state (validated) where the record
        is essientially frozen or archived. It's worth understanding the
        difference between the two main final steps in the work flow, completed
        and validated. As the name implies, completed work orders are
        essentially done, however they are not moved into the final validated
        state until a dedicated compliance role reviews, and potentially makes
        adjustments before the final sign off.
      

      

### The general manufacturing process

      

        I have no specific experience with the manufacturing process for fruit
        juice, however I will attempt to apply what I have learned from the wine
        industry to conceptualize the workflow. Primarily raw goods are aquired
        by the manufacturer. An example of this would be oranges, apples,
        grapes, etc. These materials are washed, and juice is extracted. Initial
        pasturization and filtering is performed, and then a series of
        additional steps are performed before the product reaches it's
        final state. It is important to note that raw materials are aquired in
        large batches, and then stored in large long term containers. The actual
        pace of producing the end product is performed in an just in time manner
        in order to minimize the wherehouse space required to store finished
        goods. This is an efficient model as products are manufactured against
        projected demand models. Storing unfinished goods in bulk is cheaper and
        easier to control then letting finished goods sit in a wherehouse.
      

      

        During the overall manufacturing process, content is moved between a
        series of tanks, as various operations are performed, until they reach
        the final consumer packaged state. The transition of content between
        tanks is referred to as movements, essentially a step in the overall
        process, each driven by a unique work order. It is important to
        understand this process as we can assume that there is a minimum of a
        dozen or so steps or movemements beteen initial aquisition of fruit
        until a final product is produced. We are moving at scale, where
        hundreds of operations are performed on a daily basis, and many
        operations are closely related. Each tank starts at an initial empty
        state, and will return to an empty state at some future point, however
        the point at time in which a
      

      

        1. Oranges are delivered by several truck loads where they sit in a large
          bin

        2. The oranges are washed, and then they juice is extracted via a
          crushing process, the resulting juice is stored temporarily in a large
          bulk storage tank

        3. The juice is then pasturized in smaller batches as the equipment
          responsible for this has a smaller capacity that the original bulk
          storage tank. At some point, once this step is completed, then
          pasturized juice ends up in yet another bulk storage tank temporarily

        4. From this point, the juice is divided with the intent of ultimately
          ending up in one of three final consumer products: with pulp, low
          pulp, and no pulp with calcium additive. the contents of the bulk
          storage tank at this stage marks the beggining of separate paths
          through the physicial set of subsequent tanks through the
          manufacturing process. Think of this as a fork in the road, where the
          original oranges from a common orchard begin individual journeys to
          their final state. It's entirely possible the juice intened for
          the pulp product makes it from the orchard to a retail shelf in a
          manner of a few weeks, while the other variants may take in upwards of
          6 months to reach that final state.

      

      

        The take away here is that as different end consumer products go through
        different steps, although they originate from a common origin, the
        further down the manufacturing process, the more variables come into
        play. Should there be a salmonilla outbreak from the originating orchard
        (purchase lot), we need to establish associations for essentially every
        branch of anything that happened down the line needs to be identified in
        order to effectively perform a product recall. The entire set of
        activity from the first until the last transaction falls into scope. In
        another example, perhaps at some point mid level in the manufacturing
        process, a recall is performed against an ingredient addition that was
        only performed on one of the branches of the manufacturing process. In
        that second example, only a subset of related activity would fall under
        scope of a recall in that instance. This point should illustrate the
        importance of establishing the series of operations, and requirement to
        retroactively identify the origins of product at some given point in
        time.
      

      

### The Resulting Object Model

      

Let's take a look at the object model, which is as follows.

      

[Object Model UML Diagram || UML Class Diagram (Click to explore) || /article-content/se/inv-tracking-system/class-diagram.svg]

      

## Tracing Activity

      

        So given the above problem at hand, we need to track what is happening
        not only for any given selected activity, but other related operations.
        Additionally, we need to support the ability to trace historical
        activity in the case that there is a product recall.
      

      

        From an object modeling perspective, the work order is considered the
        cornerstone of the system, for which, everything is driven from. That
        said, just take a look at the relational model.
      

      

        Work orders consist of one or more movements. Quite often this means
        that a request for the contnents of one tank to be moved into a series
        of destination tanks, or the inverse where the contents of multiple
        tanks are joined into a final destination. Each individual movement
        consists of a source and destination, usually two different physical
        locations, but sometimes recorded as the same. Take into consideration a
        case of where something is pasturized. This step in the process involves
        a single piece of equipment, a tank where the contents are heated to a
        set temperature, maintained for a period of several hours, and then
        transferre dto a refridgerated unit.
      

      

        The concept of a movement consists of two movement segments. This is
        true for general use cases where content is transferred between two
        physical locations, and also for cases where a there is no physical
        movement. It's worth noting that at a movement level, there is a
        requested number of gallons to be moved, however in real life there are
        potential slight losses as a result of the pumpin gprocess.
        Additionally, when dealing with temperature changes, liquids expand and
        contract, so two additional fields have been added to the movement
        segment entity 'adj_prev_gallons' and
        'adj_after_gallons' to allow an operator to override physical
        measurements. This background is provided only to introduce a level of
        complexity into the project that creates a requirement for additional
        business logic, establishing enough meat on the bones to inroduce
        dedicated logic and creating the requirement for unit testing to
        validate execution against those cases.
      

      

        hopefull hit the right level of background to introduce some domain
        specific requirements, enough to make the project interesting, I am not
        shooting for an simple CRUD based project here.
      

      

        Once an work order is completed, validated, reaching it's final
        assumed state, the resulting state of the tank/piece of equipment needs
        to be calculated. At a high level perspective, a weighted average. For
        example, a work order is initiated to move 400 gallons from one source,
        and 600 gallons from another source into a common destination....
      

      

        The devil is in the details here as if an adjustment is made
        retroactively spanning back let's say 6 months, then this can
        impact thousands of transactions, we need to roll back the clock, not
        only recaulculate that operation from that given point in time, but from
        a time perspective moving forward update every impacted transaction.
        Lot's of recalculations, a fair amount of processing power, and an
        default dependance on an general ORM approach creates a performance
        issue, I will touch on that a bit later in my decision making process.
      

      

[Time cost analysis for retrieving ata || Click to expand || /article-content/se/inv-tracking-system/sample-movement-sequence.png]

      

        So given the above diagram, the 'operation sequence'
        illustrates a series of operations, it is implied as an potentially
        infiniate amount, but let's call 5,000 an example of the number of
        times data is fetched during the process osf servicing a given request.
      

      

        The 'Request iteration sequence' section details what happens
        at each step in the overall process. It is hard to assign exact times
        for each individual step, there are a lot of potential variables that
        come into play, but I will attempt to generalize efforts as follows:
      

      

        * X represents processing time, generally consistent.

        * Y represents the network hit. This can be a variable, however based on
          my past observations, this can take 2-5 MS as a safe assumption. A
          small, almost insificant amount of time, however the key point here is
          that each operation adds up in the larger scope of things.

        * Z represents the variable time for the relational store to handle the
          external process request. So worst case scenario, file IO operation,
          however a lot of relational database will self tune or support the
          ability to definitively tune request operations.

      

      

        At first glance we notice the contrast between both approaches, we skip
        the round trip network hits, and the internal processing of the request
        to access data. With an in memory based approach, we essentially
        eliminate a few steps required to stage the data for the parent
        operation. Performance is good, really good.
      

      

        Imagine a use case where the data required for a decision point
        traverses a graph of objects, resulting in a series of queries as a
        result of the lazy instantiation based approach towards accessing the
        data. In this case, around 10 calls to the database to retrieve the
        entire object needed to apply logic towards. So if the network hit to
        retrieve the data and then map it into a an object wrapper takes around
        5ms, and on average 10 calls are made, we are looking at around 50ms per
        individual operation, and when processing 1,000 operations withing a
        larger transaction, then that adds up to around 50,000 ms, or five
        seconds. This is represented by the Y and Z time allocations in the
        'ORM based approach' represented in the diagram. In contrast,
        the 'in memory' approach skips the Y and Z steps.
      

      

        This might seem to be a trivial amount of time, however the actual
        project that this effort is based was exponentially more complex, and
        handling requests such as processing six months worth of data would
        result in transactions running in upwards of 45 minutes, which was a
        significant performance hit, enough to merit an alternate in memory
        based approach.
      

      

        The act of loading data into memory comes at a cost of complexity,
        introducing additional requirements such as synchronization, and
        potential memory limits, however if we are shooting for high
        performance, and the size of the data set is within reason, then this
        approach towards loading and storing the data makes a lot of sense.
      

      

## Optimizing for performance

      

        ORM techology is great, however it can lead to performance issues if not
        used carefully. In this case, we are dealing with a large number of
        transactions, so from first hand experience, I can attest to the fact
        that performance can be a real issue. The ability to lazy load data from
        a programming perspective, and although a single database call may take
        a few milliseconds, when you multiply that by thousands of transactions,
        the performance impact can be significant.
      

      

        In order to avoid the performance issues in the past, I decided to take
        an approach where data is bulk loaded into memory, from which point all
        operations are perfomed on the in memory model. We can make assumptions
        about the size of the data, and it is reasonable to assume that we can
        comfortably fit the entire data set in memory.
      

      

        During the initial load process, we can safely some of the data through
        operations such as Model.findAll(), this works well for entities which
        have no relations, however for entities which do have relations are
        loaded directly via SQL, and then manually marshelled into model
        instances. This does require quite a bit of heavy lifting, but offers an
        optimized way to load the data.
      

      

[Modeling a sequence of movements || Click to expand || /article-content/se/inv-tracking-system/tracing-in-memory-loading.png]

      

## Project structure

      

        The supporting project for this article is Node.js based, however the
        concepts apply to other stacks. At a future point, I will attempt to
        provide a java implementation for further illustrate the fact that the
        concepts are universal.
      

      

        There was a fair amount of heavy lifting that went into loading and
        staging the in memory data structure, so a dedicated file was
        established for this purpose (./src/services/entity-load.service.ts). In
        addition to loading the data, we need to map the data into it's
        final format, so an additional file
        (./src/services/entity-mapping-service.ts) was created to suit that
        purpose. Finally, a third file was created in order to actually handle
        the requests for tracing operations
        (./src/services/inv-tracking.service.ts).
      

      

        With each of these files reaching a few hundred lines, it made sense to
        divide them into purpose specific units.
      

      

## Unit testing

      

        Implementing what could be condsidered 'complex' business
        logic is hard to get right, and hard to provide that it works. This is a
        gold case for unit level testing, which involves staging the data for
        the operations. The decision was made to use a mock based approach
        towards staging the data. This provides greater control over the staging
        the required data for various use cases.
      

      

        The level of effort to stage data and perform testing was fairly
        sustantial. So we have around just under 1k lines of code to test and
        around the same lines of code allocated towards staging mock data and
        testing.
      

      

        I have covered enough ground in this article so I won't go into
        further detail a per the testing aspects as I cover this in another
        article.
      

      

## Tracing movements

      

        So one of the top level use cases is to accept an reference to something
        that had ocurred at specific point in time and then identify all
        associated activity with the targeted piece of equipment.
      

      

        The file responsible for handling tracing activity
        (inv-tracking-service.ts) exposes the high level method
        'getMovementSequenec' which is used to retrieve associated
        activity for a selected piece of equipment and point in time. Based on
        the arguments, we navigate to the first event for the targeted piece of
        equipment, and then proceed forward historically until the final or last
        recorded event. For example, If contents from three individual tanks
        were pumped into an empty tank, and any one of the movements were passed
        into the trace method, the method would return all of the movments as
        they represent a series of related events.
      

      

        The data structure that represents each movement is referred to as an{" "}
        *MovementSummary*, which essentially is an object that contains a
        denormalized collection of data for an activity for ease of consumption.
        The MovementSummary functions as a node in a *Linked List*, where
        each MovementSummary instance contains pointers to the previous and next
        elements in the sequence of events.
      

      **Identifying the first or original movement in a sequence**
      

[code]
export const traceBackwards = (
  tankId: number,
  mvmntRef?: Movement | undefined
): Movement => {
  if (!mvmntRef || mvmntRef == undefined) {
    throw Error(`Method must accept a value for the 'movement' argument`);
  }

  // So if the referenced movement did not actually involve a physical
  // transfer (which would be the case in a cooling operation), then
  // we look at the 'source' side of the movement.
  if (!mvmntRef.isActualMovement()) {
    // If there is nothing more to trace, then the referenced movement
    // is the last in the chain.
    if (!mvmntRef.source?.prevMvmnt) {
      return mvmntRef;
    }

    return traceBackwards(tankId, mvmntRef.source?.prevMvmnt?.movement);
  }

  // If the current movement reference represents a movement into
  // the referenced tank, and that tank was empty prior to the operation,
  // than we have identified the initial movement.
  if (!mvmntRef.dest) {
    throw Error(
      `Referenced movement has no destination information associated with it.`
    );
  }

  if (!mvmntRef.dest.tank) {
    throw Error(
      `Referenced movement has no destination tank information assigned.`
    );
  }

  if (mvmntRef.dest.tank.id == tankId && mvmntRef.dest.previousGallons < 1) {
    return mvmntRef;
  }

  // At this point, the current movement reference does not refer to the original
  // movement, so we need to recurse to identify that original movement.
  // Basically we recurse until the 'initial' movement is found.
  return traceBackwards(tankId, mvmntRef.source?.movement);
};
[/code]

      

        The above example is the code responsible for accepting an movement
        within a series of related movements, and then identifying the first
        moement in the series. This would be the point in time where the tank
        was originally empty. This is the initial step in the process of
        identifying a sequence of movements. As the object structure contains FK
        relations to other movements, the traceBackwards method utilizes
        recursion to perform the tracing operation.
      

      

        The next steps in the process involve repeating the process in a similar
        manner where a recursive trace is perform from the initial point in the
        sequence of movements until the final or last recorded movement is
        encountered.
      

      

        The intent of tracing is to provide an summary of all the related
        operations. The data of interest lives across 7 objects, and from the
        consumer's perspective is not necessarily important, so we take the
        resulting movements that are identified and convert them into a
        flattened value object for simplified consumption.
      

      **The Movement value object**
      

[code]
export interface MovementSumary {
  workOrderId: number;
  workOrderNumbr: string;
  completionDate: Date;
  validationDate?: Date;
  movementId: number;
  sourceTankId: number;
  sourceTankName: string;
  destTankName: string;
  destTankId: number;
  origRequestGallons: number;
  sourceBeforeGallons: number;
  sourceAfterGallons: number;
  destBeforeGallons: number;
  destAfterGallons: number;
  prevActivity: MovementSumary;
  nextActivity: MovementSumary;
}
[/code]

      

## Conclusion

      

        I hope that this article sparks some interest and provides an insight
        into how I have attempted to tackle the problem of modeling an inventory
        tracking system. The GitHub project is fully functional, inclusive of a
        comprehensive set of unit tests.
      

      

        All too often I see developers publishing projects that are basically
        CRUD based applications with a few extra bells and whistles, so I wanted
        to showcase a real world project, that otherwise would not be possible
        as most of the code I have produced during my career is proprietary in
        nature, and is typically IP that belongs to an employer.
      

      

        Source for this project can be located on GitHub
        [
          https://github.com/west-coast-matthew/blog-tank-tracing
        ](https://github.com/west-coast-matthew/blog-tank-tracing)
