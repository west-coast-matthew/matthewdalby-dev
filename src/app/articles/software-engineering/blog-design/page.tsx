import { Metadata } from "next";
import { parseHeaders } from "@/utils/page-utils";
import ArticleTemplateLayout from "@/app/articles/article-template";

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
      <h2>Introduction!</h2>
      <p>
        After a lot of reservation I finally started this tech blog. I wanted to
        formalize thoughts based on some notes I have been creating for personal
        reflection, and also share it back with the community. With some much
        content out there, I was a bit gunshy to add to the pile, and I did not
        have any real desire to push out a lot of trivial ‘how to’ articles as a
        cheap attempt to present myself as an expert.{" "}
      </p>
      <p>
        After some reflection, I decided to roll out a Node Js based solution,
        which makes sense as I spend a lot of time in React/Typescript these
        days. This article will focus on the design decisions and implementation
        details.
      </p>
      <p>
        I made the conscious decision to not work with a CMS product, including
        headless options. I wanted to maintain maximum control over the page
        layouts. I am not a stranger to wordpress, however I did not want to be
        limited by existing plugins, and certainly had no desire to get back
        into the business of creating custom implementations. Nothing against
        wordpress, however this was a great opportunity to start a greenfield
        Next js project and keep my skills sharp.
      </p>
      <p>
        My initial attempt was essentially an MVP, with the goal of just getting
        the application up and running. What became immediately apparent was the
        amount of duplicate code that resulted from copying and pasting code at
        the page level. This drove me towards an major refactor, with a focus on
        centralizing logic, the end goal is to create lightweight pages for each
        blog posting.
      </p>
      <h2>Initial Concepts</h2>
      <p>
        I usually start ideas on 8x10 copy paper, or sometimes even the
        occasional napkin. Rough quick iterations help me to kickstart off an
        idea. Since this is a side project, I can afford to be rough, no need
        for figma here as there is no real need for collaboration. I often find
        myself going through several rough iterations for any given project,
        progressing from really rough to slightly more legible versions. Rapid
        successions of draft allow me to develop the idea in a more rapid
        fashion, and avoid focusing on the overall appearance. In this case,
        this took around an hour or two, with most focus on an initial set of
        articles and topics, with the main takeaway that I needed a single page
        responsible for listing articles and topics, and a strategy for the
        actual blog posting/articles.
      </p>
      <p>
        In terms of a UI experience, I put a few cycles into that over the
        course of a few evenings. When it comes to UI, I tend to get very
        analytical and selective. Given a formal background in a past lifetime,
        I progressed through a series of free and paid templates until I
        narrowed down a few options. After a brief intermission, I returned a
        few night later to make a final decision. There is an art to iterating
        through concepts until a final design is reached, however that falls
        beyond the scope of this article.
      </p>
      <p>
        Ultimately I was able to locate a paid template, from which I plucked
        out some of the design elements. I was impressed with the look and feel,
        but did not feel like throwing down $100+ dollars for a template I would
        trim down and use a small fraction of. Given this approach, I ended up
        hand rolling the css, which also helps me to keep my skillset up to
        speed.
      </p>
      <h2>Modeling articles and topics</h2>
      <p>
        The object model behind the site consists of Articles and Topics. A
        pretty basic concept. Upon iniitial conceptualization, I identified a
        requirement to nest Topics in order to better organize articles. A key
        driver for this was some of the content I related to some of the
        applications I wanted to share, particularly a concept around an ERP
        application I am working on. There are a lot of examples of boilerplate
        applications out there, twitter clones, e-commerce applications,
        facebook clones, but I wanted to provide an example of more of a real
        world application, and go into a lot of details about the design. My
        vision of the level of content exceeded what would be appropriate to put
        into a single posting, so it made sense to group a series of articles
        related to that effort under a dedicated sub-topic.
      </p>
      <p>
        Given such a simple object model, it was a no brainier to model
        everything in JSON. After some initial thoughs about storing the data in
        Mongo, I decided to keep the content in a local file for the sake of
        simplicity. Should I outgrow this in the future, it would really require
        minimal effort, so there is no realy technical debt.
      </p>
      <h2>Centralizing logic</h2>
      <p>
        A major concearn was minimizing logic across the article pages. By
        default, each article is driven by an individual file, so duplication of
        code was an initial concearn. This drove the decision to migrate a lot
        of the common operations into the middleware layer. Most of the heavy
        lifting is performed there (retrieving topic and article related
        information), and then is made available at the page level.
      </p>
      <p>
        This approach introduced a small challenge as there are a few options
        when sharing data with the pages. Ideally, the URL provides enough
        information to retieve any requested information. Ideally I wanted to
        pass data from the middleware via the request context, however was
        unscessfull. For the initial version, I decided to bypass the issues I
        was experiencing with this approach and use an option where the JSON
        data was serialized into a string, appended to the headers object
        associated with the request, and then reconsitituted at the page level.
      </p>
      <h2>Implementing topic and blog listing pages</h2>
      <p>
        A single page (./app/articles/templates/page.tsx) was created which was
        responsible for allowing the user to navigate to any given article.
      </p>
      <h2>Implementing blog pages</h2>
      <p>
        Whereas a single page was defined for navigation related operations,
        each actual article requires it&apos;s own unique file. This is presents
        a challenge when it comes to avoiding duplicate code. The details
        related to rehydrating topic and article information stored in the
        headers requires so boilerplate logic, that is required by each page.
        Let&apos;s take a look at the logic.
      </p>
      [example here]
      <p>
        This gets a little messy as there are conditional checks as the related
        calls need to perform null checks, and these operations are performed in
        an async manner. As a result, the code was refactored until a utility
        method, almost resembling a call to a React hook.
      </p>
      [example here]
      <p>
        After an initial page implementation for an article, I was able to
        identify common elements that each article would need to display,
        including displaying a posted date, title, description for each article.
        With some additional refactoring, I was able to externalize most of this
        content into a shared template, reducing the requirements for creating
        each article page down to really just related content for any given
        specific article.
      </p>
      <p>
        A template was created with the intent of cloning it for each new
        article instance. The file is locsted under
        ./src/apps/templates/article-template.tsx.
      </p>
      <h2>Shipping the final product</h2>
      <p>
        I decided to go with a cheap hosting service, around $5 a month. This
        gets the job done. Technically I already had one in place, so the blog
        becomes another process behind Ngix working as an reverse proxy. In
        terms of a deployable unit, bulding a Docker container made sense as it
        does in most cases as this helps to reduce any runtime dependencies.
      </p>
      <p>
        Finally, a github workflow was established to automate the build
        process. This helps to streamline the overall deployment process. This
        might seem like overkill, however I consider it a best practice, and
        frees my time up to work on other things (every bit helps).
      </p>
    </ArticleTemplateLayout>
  );
}
