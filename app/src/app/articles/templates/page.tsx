import styles from "./topic-article-list-template.module.scss";
import { Metadata } from "next";
import Topic from "@/types/topic.type";
import TopicDisplayCell from "@/components/TopicDisplayCell";
import BreadcrumbPanel from "@/components/Breadcrumb";
import ArticleListingCell from "@/components/ArticleListingCell/ArticleListingCell";
import { parseHeaders } from "@/utils/page-utils";

/**
 * Article navigation page
 *
 *    This page is responsible for displaying navigational UI elements, which allows the
 * user to view article related content. By default, the top level set of topics is displayed.
 * Topics, and their associated articles are modeled as an hierarchy, where any given
 * topic many include sub topics, and/or articles. Let's take a look at the following
 * example.
 *
 * Topic A
 *  Article 1
 *  Article 2
 * Topic B
 *  Article 3
 * Topic C
 *  Article 4
 *  Topic D
 *    Article 5
 *    Article 6
 *
 * Upon an initial request for the url './articles', links to the topics A, B, and C would be displayed, as
 * they are considered 'top level', as they have no 'parent' topics. Upon selecting either of the first
 * two topics (A or B), the corresponding child articles would then be displayed, however when the third
 * topic is selected (Topic C), then we present the user is a link to both the immediate child article 'article 4'
 * in addition to the child topic (D).
 *
 * The model supports 'infinite' levels of nesting, however in reality, the expectation is that only two
 * levels of nesting would be implemented. Given the 'apps' topic, I wanted to provide a series of articles
 * dedicated to the 'ERP' application, rather than just a single article on that effort as there is a
 * lot of ground to cover, and it is appropriate to break that content into multiple articles.
 *
 * This page IS NOT RESPONSIBLE for displaying an individual selected article.
 *
 */
export const metadata: Metadata = {
  title: "Matthew Dalby: Software Engineer",
  description:
    "A technical blog focusing on React, Java, and Node technology stacks. Tutorials, articles, and real world software examples. Opinions and advice on various aspects of software development.",
};

export default async function Template() {
  const { topics, selPath, articles } = await parseHeaders();

  const loadTopics = () => {
    if (topics.length === 0) {
      return <></>;
    }

    return (
      <div>
        <div className={styles["section-header"]}>
          ({topics.length}) Available topics
        </div>
        <div className={styles["topic-section-content"]}>
          {topics?.map((topic: Topic, index) => {
            return (
              <div key={index}>
                <TopicDisplayCell
                  key={index}
                  topic={topic}
                  path={`./${selPath}/${topic.link}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const loadArticles = () => {
    if (articles.length === 0) {
      return <></>;
    }

    return (
      <>
        <div className={styles["section-header"]}>
          ({articles.length}) Available articles
        </div>
        <div className={styles["article-section-content"]}>
          {articles.map((article, index) => (
            <ArticleListingCell
              key={String(index)}
              article={article}
              link={`${selPath}/${article.link}`}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div>
      <BreadcrumbPanel path={selPath} />

      <div className={styles["listing-content"]}>
        {loadTopics()}

        {loadArticles()}
      </div>
    </div>
  );
}
