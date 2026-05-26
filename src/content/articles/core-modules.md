---
title: "ERP Demo: (Part 3) Defining the core modules"
date: "December 31, 2024"
excerpt: "Implementing a home for shared code"
readTime: "1 min read"
category: "ERP Demo"
---

With a decision made to separate the server side functionality into a
          series of projects, this drives a conversation about how to handle
          shared code. With microservice implementations in their purest
          interpretation, the code between the various services is independant.
          A downside to this approach is the duplication of code. Another option
          is to create an shared library for use across projects.
        

        

          A *common* or *core* library was estalished as a location to
          share source code. Deciding which code to centralize into this shared
          module is somewhat of a complicated subject. Too little centralization
          of code, there is a risk of duplication, too much, and then you have
          created a monolith. The approach used on this project is that after an
          initial set of shared functionality is established in the core module,
          code from other projects is only migrated into a core module once it
          becomes referenced in more than project.
        

        

## Prime candidates for inclusion into the shared module

        

          The following areas of functionality are natural candidates for
          inclusion into the core module.
        

        

          * Security

          * Common util functions

          * Exception definitions

          * Shared constants
