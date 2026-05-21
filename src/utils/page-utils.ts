import { cfg, getSelTopic } from "@/services/api-service.service";

/**
 * Static/direct lookup helper function for article page components.
 * This avoids passing state via HTTP headers/middleware.
 */
export function getArticleData(topicPath: string, articleLink: string) {
  const topic = getSelTopic(topicPath, cfg);
  const selArticle = topic?.articles?.find((a) => a.link === articleLink);
  return {
    selPath: `/articles${topicPath}${articleLink}`,
    selArticle,
  };
}

