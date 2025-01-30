import styles from "./articles-listing.module.scss";

import { headers } from "next/headers";
import BlogTopicNavPanel from "@/components/BlogTopicNavPanel/BlogTopicNavPanel";
import cx from "classnames";
import { Metadata } from "next";
// import { getTopics } from '@/services/api-service.service';
import TopicDisplayCell from "@/components/TopicDisplayCell";
import Topic from "@/types/topic.type";
import { TOPICS } from "@/constants/app.constants";

/**
 * Template for displaying tops or sub topics. Be default, the './articles' link will
 * be routed here, however for a specific set of URLs, intended to display sub topics, the
 * functionality is the same, and so via the config we perform server side redirects, overriding
 * the default routing behavior and use this same template.
 *
 *
 * TODO: Make metadata dynamic?
 */
export const metadata: Metadata = {
  title: "Matthew Dalby: Articles",
  description: "Technical Blog Topics",
};

export default async function ArticlesPage() {
  const headersList = headers();
  const topicsJson: string = (await headersList).get(TOPICS) || "[]";
  const topics: Array<Topic> = JSON.parse(topicsJson);

  const loadArticleCategories = () => {
    const results = topics?.map((topic: Topic, index) => {
      return (
        <div key={index}>
          <TopicDisplayCell key={index} topic={topic} path="???" />
        </div>
      );
    });

    return results;
  };

  return (
    <div className={styles["main-panel"]}>
      <h1 className={cx(styles["subtitle"], styles["dropdown-fade-in"])}></h1>
      <h2 className={cx(styles["anim-fade-in"], styles["subtitle"])}></h2>

      <BlogTopicNavPanel />

      <div className={styles["listing-content"]}>{loadArticleCategories()}</div>
    </div>
  );
}
