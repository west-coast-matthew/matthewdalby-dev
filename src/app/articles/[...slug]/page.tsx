import styles from "./topic-article-list-template.module.scss";
import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { redirect, notFound } from "next/navigation";
import Topic from "@/types/topic.type";
import TopicDisplayCell from "@/components/TopicDisplayCell";
import BreadcrumbPanel from "@/components/Breadcrumb";
import ArticleListingCell from "@/components/ArticleListingCell/ArticleListingCell";
import { cfg, getSelTopic, filterActiveTopics, formatActiveArticles } from "@/services/api-service.service";
import { getBlogPostBySlug } from "@/lib/blog-loader";
import PostClient from "@/components/Blog/PostClient";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Check if it's a new Markdown article
  if (slug.length === 1) {
    const post = getBlogPostBySlug(slug[0]);
    if (post) {
      return {
        title: `Matthew Dalby: Articles: ${post.title}`,
        description: post.excerpt,
      };
    }
  }

  const topicPath = "/" + slug.join("/");
  const selTopic = getSelTopic(topicPath, cfg);

  return {
    title: selTopic ? `Matthew Dalby: Articles: ${selTopic.title}` : "Matthew Dalby: Articles",
    description: selTopic?.summary || "Technical Blog Topics",
  };
}

export default async function Template({ params }: PageProps) {
  const { slug } = await params;

  // 1. Check if it's a new Markdown article (e.g. /articles/example-blog-entry)
  if (slug.length === 1) {
    const post = getBlogPostBySlug(slug[0]);
    if (post) {
      return (
        <PostClient
          post={post}
          backUrl="/articles"
          backLabel="Back to articles"
        />
      );
    }
  }

  // 2. Check if this is a legacy article URL pattern (e.g. /articles/api-design/caching)
  // and redirect it to the new flat markdown URL (e.g. /articles/caching) if the migrated post exists.
  if (slug.length > 1) {
    const leafSlug = slug[slug.length - 1];
    const post = getBlogPostBySlug(leafSlug);
    if (post) {
      redirect(`/articles/${leafSlug}`);
    }
  }

  // 3. Check if this is an old article that has been moved (e.g. /articles/api-design/caching)
  // we redirect them to /articles/old/api-design/caching as fallback to preserve SEO/bookmarks
  const oldArticlePath = path.join(process.cwd(), "src/app/articles/old", ...slug, "page.tsx");
  if (fs.existsSync(oldArticlePath)) {
    redirect(`/articles/old/${slug.join("/")}`);
  }

  // 3. Render old category/topic listing
  const topicPath = "/" + slug.join("/");
  const selTopic = getSelTopic(topicPath, cfg);

  if (!selTopic) {
    notFound();
  }

  const topics = selTopic.children ? filterActiveTopics(selTopic.children) : [];
  const articles = selTopic.articles ? formatActiveArticles(selTopic.articles) : [];
  const selPath = "/articles" + topicPath;

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
              link={`/articles/old${topicPath}/${article.link}`}
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

