# My Tech Blog

## Overview 
This project is a nextjs based application that serves as my personal blog. This is a 'hand rolled' blog implementation, where minimal blog entry related meta data is stored in JSON format. The project illustrates an example of my nextjs related work, however may also be repurposed for other blog type implementations.

There are no external dependencies such as a database, cms system, etc, so this is self contained.

At the time of this updated README, there actually is an article within the project that details the design and development process if you would like to get a better understanding. 

The following are a few keys points of the implemnentation:

* Self contained application
* Article meta information is centralized for management purposes
* Actual blog posting/articles are created via the standard JSX definition files for maximum content control
* Full effort made to minimize redudendant code at the page level
* Centralized logic for retrieving article meta information within middleware where it is passed as variables to the pages to streamline logic and reduce repetative code.
* Unit testing for utility methods
* Constants defined in dedicated files in order for long term maintenance
* As much logic as possible has been removed at the page level, with the intent to just have the physical tsx template pages to just focus on content.


## Starting the application

Starting in the local dev environment:

`yarn run dev`


## Managing article/blog entry content

Current implementation requires topics and blog entries to be defined in an central JSON document. At some future point this will be in a dedicated file, but the process for creating a new blog posting ( a common use case) the following steps are required.
1. Modify the config file json (pretty self explanitory
2. Create the folder structure as required under the standard nextjs naming conventions (i.e. /src/app/topic-name/article-name/page.tsx
3. Copy logic from an existing page, then create relevant content in the page.

## TODO:
1. Migrate away from strategy where topic and article related information is passed from middleware to page elements via appending to the header. We should be able to bind the objects without marshalling/unmarshalling data between JSON formats as header values must be declared as strings and not objects. This will be a cleaner approach. Documentation implies we can do this, however am hitting a snag and I need to look into an already existing ticket on this.
2. Migrate config to external JSON file, currently it lives in a service.
3. Make slugs dynamic at the page level
4. Investigate if we can make the route overrides in the next config file dynamic (should be possible)
5. Integrate with a monitoring product such as Sentry
6. Add in metrics for usage. Ideally I would like to track time spend reading articles.
7. Add in ability for users to rate articles
8. Potentially add ability for user's to add comments, which would introduce a requirement to introduce an external dependancy to store the comments.


## History
8/2024
	Original implementation. Functional, however quick and dirty.

6/2025 
	Major refactor, code consolidation at the page level.