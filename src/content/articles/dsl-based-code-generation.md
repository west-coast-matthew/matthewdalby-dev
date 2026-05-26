---
title: "DSL Based Code Generation"
date: "June 17, 2024"
excerpt: "An experiment in reversing an RDMBs into ORM source"
readTime: "3 min read"
category: "Software Engineering"
---

# 

Work smarter, not harder...

      
        

## An introduction

        

          Traditional approaches to software development involve a lot of manual
          effort. Regardless of the particular language, or tech stack,
          it's easy to take note of the amount of repetative, boilerplate
          code that comes into play for performing certain tasks, especially
          when it comes to creating ORM related code. Whenever possible, I look
          for options to automate the development process as much as possible.
          Lately there has been a lot of talk about the role of AI in assisting
          in these , but I have using generative strategies for over a decade.
        

        

          In this article, I will talk about a strategy for reverse engineering
          a relational database into a DSL or *Domain Specific Language*,
          from which point code generation could be implemented to produce
          source code artifacts.
        

        

          I have also developed a project, available on my GitHub account
          (git@github.com:west-coast-matthew/blog_rdbms_dsl_generator.git) as a
          concrete implementation. The implementation is in Java, however the
          concept may be applied to a Node stack as well (I will take a stab at
          this in a future point).
        

        

          The real use case here is one where you are migrating an existing
          product from one stack to another. I faced this issue on a past
          project where we were looking at migrating 350+ tables into a new ORM.
          By estimates this would have required an estimated 2 FT resources and
          around 6 months of effort. using this approach, I was able to reduce
          the process down by a factor of only a few weeks and a single
          resource.
        

      

      
        

## Domain Specific Languages

      

      
        

## An applied approach

        

          As I previously mentioned, I created an application that demonstrates
          this concept, available on Github at
          git@github.com:west-coast-matthew/blog_rdbms_dsl_generator.git.
        

        

          The goal of this project is to read meta data from a relational
          database, and then generate a JSON representation of each table onto
          the local file system.
        

        

### Architectual Design

        

[Overview || Overview || /article-content/se/rdbms-to-dsl/dsl-generator-class-model.png]

        

          When modeling the application, I put a though cycles into the design,
          which resulted to provide a layer of decoupling between the specifics
          of what the source of the data (MySQL, Postgres, Mongo) from the main
          routine. Interfaces were created for operations such as obtaining meta
          information from a specific source, the DSL format, and final
          destination of the code artifacts.
        

        

          I decided implement this project in Java, however the concepts should
          transfer over to Node stacks as well. There is no value detailing how
          to setup a Java based project, however, let's look at the file
        

        

          The role of consuming data from a source falls under the interface
          Consumer, source code related to where the resulting DSL is output
          falls under the role of Publisher, and the remaining logic on the
          details of transferring data from a source to some destination assumes
          the role Generator.
        

        

Top level interfaces were developed for each of the three roles. 

        

### Defining a DSL model

        

          During the first step of the process, data from a source is translated
          into a neutral format, which then is passed over the boundaries of the
          other two roles.
        

        

### Implementing the consumer

        

The decision to use a

        

### Implementing the generator

        

### Implementing the publisher

        

### 

        

### Next steps

      

      
        

## In conclusion

        

          While there are options out there for reversing a schema into ORM
          implementations, I mean why roll your own? The important take away
          here is that we have migrated the object (using the daatab as the
          single source of truth) into a neutral format
