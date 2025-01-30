import { Metadata } from "next";
import { parseHeaders } from "@/utils/page-utils";
import ArticleTemplateLayout from "@/app/articles/article-template";
import { Fade } from "react-awesome-reveal";

export const metadata: Metadata = {
  title: "Matthew Dalby: Articles: API Design: Exception Handling",
};

export default async function ArticlePage() {
  const { selPath, selArticle } = await parseHeaders();

  return (
    <ArticleTemplateLayout selPath={selPath} selArticle={selArticle}>
      <Fade>
        <p>
          I have been an advocate of jira for quite some time. Every
          orgarnization seems to use it differently in some manner, however it
          gets the job done no matter what.
        </p>

        <p>
          I personally despise repetative data entry, and especially entering a
          large number of tickets one by one. Defining tickets in CSV format,
          and then importing them in bulk is my go to approach.
        </p>

        <p>
          The setting I typically work in involves a PM (Project Manager)
          interfacing with stakeholders to define the requirements, and then
          creating a set of tickets in Jira.
        </p>

        <p>
          Jira integration with an IDE is a powerfull tool for developers as it
          provides the ability to convert &apos;todo&apos; comments into Jira
          tickets from within the environment.
        </p>

        <p></p>
      </Fade>
    </ArticleTemplateLayout>
  );
}
