---
title: "Effective REST Controller Design"
date: "January 4, 2025"
excerpt: "Patterns for real world REST APIs."
readTime: "8 min read"
category: "API Design"
---

### Introduction

      

        I have been working with APIs for over two decades. Here I want to share
        my thoughts on basically cross application protocols related to how
        applications talk to each other, with really specific context to
        designing REST APIs. I will briefly touch on a little history here, but
        just to help frame things. The goal of this article is to give some
        opinion common beast pratices, anti-patterns, with the goal of just
        driving a thought process. At the end of the day, there is no right
        anwser and really any solutions are just super relevant to a
        project/requirements specific scenario.
      

      

        If you are especially reading this from the perspective of a dedicated
        role where you are focused on consuming data from a frontend perspective
        (React, Angular, name it...) then we are probably making assumptions on
        we just 'consume' stuff from a backend via JSON under most
        common use cases.
      

      

        So a problem domain exists in where we need to have multiple systems
        working together, communicating across different operating systems,
        languages, that creates unique problem. Like how to we even approach
        this? If this browser to APi backend, internal system to internal or
        perhaps external partners? There are two contrasting approaches here,
        light coupling vs closer coupled approaches. The attempt of making two
        different 'things' work together is nothing new, however there
        is a level of informamilty or lack of that comes into play. Distributed
        systems are hard to build, especially when truly distributed
        transactions come into play.
      

      

        The scope of my thoughts here are primarily focused on a generalized
        approach to defining REST based APIs. So like, what works, what does
        not, and there is a strong assumption that we are focuced on a lot of
        basc use case, and where I see them break down. This really focused on a
        common use case, i.e. where we perform REST based calls from an
        assumption that we default to JSON and a nature of very CRUD based
        operarations.
      

      

        I could elaborate for a bit more on remote system protocols (Soap, EDI,
        EJB, OpenRPC, RMI, GrahpQL, RMI), language implementations, blah blah
        blah, we are just focusing on Vanillia common use case REST stuff here.
        Long history of 'how to talk to other stuff between systems',
        let&poss focus on JSON over generally regonized REST interfaces here.
      

      

### Fast/vs matainianable

      

        Let ' take a look at a few examples, common content for how to
        create APIs...
      

      

[code]
// node.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Hello World!`);
});

// java
@RestController
public class GreetingController {

@GetMapping("/hello")
    public String sayHello() {
        return "Hello from Spring Boot REST!";
    }

// python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello World"}
[/code]

      *
        Not building rockets here, the above is a few snippets of 'hello
        world' examples of basic entry points for REST controllers. that is
        enough to get anyone up and running, however by any measurable means,
        not an real world example. Not trying to oversimply here, however a few
        steps further and we are making calls here to the persistence tier, the
        beginnings of a storm are introduced here for more logic.
      *

      

        I am not going to knock anyone for POC work at this level, but the point
        here is this is not production ready code. Startup, get it, however like
        way, way to manytimes this makes it into production (actually if you are
        a startup trying to hit market, pm me, ther eis an easier way).
      

      

        The goal here is to focus on more longer term matinainable
        implementations, yes with an investment on proper design, but more often
        then not, I observe bad API implementations based on poor practices, not
        lack of resources
      

      

        This article will focus on a three tiered approach, which reflects a
        modular design, separation of concearns, empahsis on testability.
      

      

### Controllers/Routers/Entry point definitions

      

        Unapoligetically, I support thin, lightweight controller logic. This is
        irrelvant of any stack implementation, focus on separation of concearns.
        From my perspective, we separate concearns and the entrypoint into an
        API enpoint should contain minimal logic.
      

      

        Simply put, controllers (routes in node.js ) or pick your flavor of
        system to system entrypoints are by nature intended to be light weight,
        interceptors of requests, delgating things to other area of code
        (separating concearns). Deceptively so, a necessary evil. Imagine
        getting on a plane, in a foriegn country, and I mean you don't
        neccarily speak the language. You get there, the staff involved gets is
        all figured out
      

      

        Exposing request and response related data to service level logic should
        be avoided. Details of how the data is staged should be abstracted from
        the service tier. While I have personally observed HttpRequest types
        arguments in the Java world passed to services, this has typically
        served as a sign of larger architectual issues.
      

      

### Exception Handling

      

        Over a series of past projects, I have been able to observe a few
        different approaches towards reporting exceptions. While there is no
        real standard for reporting exceptions, the HTTP status codes are a good
        start. The RFC 9457 proposal looks promising, I am not completely sold
        at this point. Returning 200 status codes when an operation fails is,
        well bad. I have seen this implemented in more projects than I care to
        admit. The HTTP Fetch API natively handles response codes, where non 200
        block codes are treated as actual exceptions, as they should be.
        Let's take a look at an example.
      

      

[code]
fetch ('http://myapi.com')
.then((rawData)=>rawData.json())
.then((jsonData)=>{
	
	if(jsonData.status=="error"){

		...
	}

});
[/code]

      *An example of an exception masked by an 200 response code*

      

        So the above example illustrates uneccessary logic required for
        exception handling. In my opinion, a hack, a sign of an unstable code
        base, and possibly that you may want to find a new gig as this is an
        early sign of potentially larger technical issues. Sending a message
        indicating an status code is bad practice as the codes, messages, would
        require effort to transmit and remain consistent across all calls. Worse
        yet, in the above example, this approach was not consistently
        implemented across the application, and the codes were not implemented
        in a consistent manner.
      

      

        As a personal preference, I practice strict adherence to HTTP status
        codes, with the addition of request headers as appropriate to provide
        additional details as appropriate
      

      

        You can find some related information
        [
          &nbsp;in this posting on exception handling.
        ](/articles/api-design/exception-handling)
      

      

### Separation of concerns

      

        Controllers should be lightweight/anemic. Logic should be delegated to a
        'service' tier. They should be concearned with translating the
        payload into some type of structure that does not reflect the transport
        mechanism.
      

      

### Pagination by default

      

        When requesting data, pagination should be a core consideration. I would
        recommend defaulting to that approach, and making exceptions on an as
        needed basis. This is especially true when wokring on greenfield
        projects, where data is not present and expected to grow. Avoid future
        Jira tickets, and take an proactive approach towards design.
      

      

### Request Validation

      

        Validation 'should' be performed as early as possible in the
        request process. It really makes no sense to send invalid data to a
        service tier, which may result in invalid results or harder to interpret
        exceptions. Identify bad input as early as possible, and send
        descriptive messages back to the client.
      

      

        Java does a great job of performing validation on requests. Validation
        logic may be applied on the object itself via annotations. Let's
        take a look at an example.
      

      

[code]
@PostMapping
public String submitForm(@Valid @RequestBody Product produce, BindingResult bindingResult) {
    
    if (bindingResult.hasErrors()) {
        // Handle validation errors
        ...

    }
    
    ...
}
[/code]

      *Implementing controller level request validation*

      

        The above example illustrates catching invalid exceptions early on in
        the request process. The annotations provide a clean mechanism for
        defining validation logic. In the Node.js world, there are other
        options, but not a clear direct equivelent to this approach. This will
        require a bit more work.
      

      

### Make use of cache directives

      

        An often overlooked aspect of API design is defining the relevancy of
        the data. The topic of real time data, server side pushes, etc. could be
        considered 'sexy' and attract a lot of attention, however
        optimizing caching strategies does not get enough attention in my
        opinion.
      

      

        There is a lot of HTTP header level standards out there such as
        'Cache-Control' that may be utilized for optimizing data
        retrieval. While it is true that these are essentially hints to the
        client, they are low effort. Yes, it's true that more than likely
        you are deploying to the cloud, and scaling is fairly easy to implement,
        resources do cost money.
      

      

        The web API fetch command natively respects the cache related headers
        passed from API responses, so for web based clients (i.e. Javascript)
        you inherit cache control for essentially free. As a personal
        observation, I rarely see the use of cache related headers applied.
      

      

        Take for example an high traffic ecommerce site. Product categories
        represent a set of data that seldomly changes. It makes natural sense to
        indicate to the client that the information seldomly changes.
      

      

[code]
Java/Spring
public class CategoryController {

	@GetMapping("/productCategory")
	public String addHeader(HttpServletResponse response) {
	    response.setHeader("Cache-Control", "public, max-age=3600");
	    ...
	}

	...
}

Node.js
app.get('/productCategory', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600'); // Sets a custom header
  ...
});

Python/FastAPI

@app.get("/items/")
async def read_items(response: Response):
    response.headers["Cache-Control"] = "public, max-age=3600"
    ...
[/code]

      *Explicitly indicating to the client that data is safe to cache*

      

### Summary

      

        * Keep controllers as lightweight as possible, delegating operations to
          other tiers as appropriate.

        * Maintain strict adherence to the correct HTTP status codes, especially
          when reporting exceptions.

        * Perform request validation as early as possible

        * Make use of cache directives as appropriate.
