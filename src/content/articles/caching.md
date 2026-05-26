---
title: "REST: Thoughts on Caching"
date: "January 19, 2025"
excerpt: "Making use of HTTP header cache control directives"
readTime: "2 min read"
category: "API Design"
---

## Introduction

        

          Caching is an often overlooked topic when it comes to API design. For
          hobby level projects, or for applications in corporate environments
          with modest user bases you can probably get away with not addressing
          this aspect, however for high usage cases, it is critical to take this
          into consideration.
        

        

          There are numerous options for caching, but I am going to address HTTP
          based API designs, specifically REST APIs as they seem to be popping
          up all over the place. I am going to pretty much just focus on
          utilizing http cache control headers here, as it is an easy win when
          it comes to optimizing data retrieval efforts.
        

        

          Caching does come at a cost, specifically one of complexity. What do
          you cache, and for how long? What is an appropriate strategy for
          performing refreshes?
        

        

## Understanding data

        

          When approaching a new application, I start with the underlying data
          structure. Generally you can classify data into three groups, sets
          that change frequently, semi-frequently, and infrequently.
        

        

          For data that infrequently changes, such as product categories or
          color options, these become natural candidates for caching.
        

        

## How browsers handle cache control directives

        

Let's

        

## Caching Options

        

## Understanding caching headers

        

          The HTTP protocol provides some great options for annotating responses
          with data related to what expectations we can place on when data may
          be considered stale.
        

        

          It is important to note that by providing cache related information in
          the response headers it is mearly a hint for the client or any proxies
          between both endpoints. For cases where you have direct control over
          the client, there is an opporunity to optimize requests, however if
          you are implementing an external API, there is no guarantee the
          consumer will utilize them.
        

        

## Summary
