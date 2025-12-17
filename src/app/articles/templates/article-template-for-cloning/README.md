# Creating new articles

## Background
A common use case for authoring is the definition of blog/articles for existing topics. All articles are served via the default behavior of Next JS routing. This process involves creating a directory under the ./src/app/articles under any of the parent folders representing topics. The file 'page.tsx' located in this directory is intended to be cloed into the new directory for the article, simply start adding content. All additional logic for accessing the selected topic, and article meta data is already externalized.

## Overview of process
1. Create a new directory under the ./src/apps/articles folder structure under the corresponding topic for the new article.
2. Add a new article definition in the ./src/services/api-service.ts file which will allow the article/topic browse page
3. Modify the meta related information as appropriate on the new article page and begin adding in content.