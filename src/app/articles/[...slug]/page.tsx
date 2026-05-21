import styles from "./topic-article-list-template.module.scss";
import { Metadata } from "next";
import Topic from "@/types/topic.type";
import TopicDisplayCell from "@/components/TopicDisplayCell";
import BreadcrumbPanel from "@/components/Breadcrumb";
import ArticleListingCell from "@/components/ArticleListingCell/ArticleListingCell";
import { notFound } from "next/navigation";
import { cfg, getSelTopic, filterActiveTopics, formatActiveArticles } from "@/services/api-service.service";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = "/" + slug.join("/");
  const selTopic = getSelTopic(path, cfg);

  return {
    title: selTopic ? `Matthew Dalby: Articles: ${selTopic.title}` : "Matthew Dalby: Articles",
    description: selTopic?.summary || "Technical Blog Topics",
  };
}

export default async function Template({ params }: PageProps) {
  const { slug } = await params;
  const path = "/" + slug.join("/");
  const selTopic = getSelTopic(path, cfg);

  if (!selTopic) {
    notFound();
  }

  const topics = selTopic.children ? filterActiveTopics(selTopic.children) : [];
  const articles = selTopic.articles ? formatActiveArticles(selTopic.articles) : [];
  const selPath = "/articles" + path;

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
