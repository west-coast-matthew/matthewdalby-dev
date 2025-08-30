import { NextRequest, NextResponse } from "next/server";
import {
  cfg,
  getAllActiveTopics,
  getSelTopic,
} from "./services/api-service.service";
import {
  ARTICLES,
  SEL_ARTICLE,
  SEL_PATH,
  SEL_TOPIC,
  TOPICS,
} from "./constants/app.constants";
import { filterActiveTopics } from "./services/api-service.service";
import { getParentUrl } from "./utils/string-utils.utils";

/**
 *
 *
 * @param request
 * @returns
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathName = request.nextUrl.pathname;
  const subPath = pathName.replace("/articles/", "/");
  response.headers.set(SEL_PATH, pathName);

  console.log(`middleware: intercepting request....`);

  // Handle case where we just need to retrieve all topic level topics and display them
  if (pathName === "/topics") {
    const topics = filterActiveTopics(cfg);

    console.log(
      `middleware: displaying all topics, url is follows`,
      request.url
    );
    console.log(`middlware: displaying all topics, pathName`, pathName);
    //const altResponse = NextResponse.rewrite(
    new URL("/articles/templates/", request.url);
    //);
    response.headers.set(TOPICS, JSON.stringify(topics));
    const topLevelTopics = getAllActiveTopics();
    response.headers.set(TOPICS, JSON.stringify(topLevelTopics));
    return response;
  }
  // Handle cases where we display either sub topics, or articles for a selected topic/sub
  // topic or article
  else if (pathName.startsWith("/articles")) {
    console.log(`middleware: displaying articles for a selected topic....`);

    const altResponse = NextResponse.rewrite(
      new URL("/articles/templates", request.url)
    );
    altResponse.headers.set(SEL_PATH, pathName);

    /**
     * Attempt to select the selected topic based on the requested URL. In the event
     * it cannot be located, then we assume the url references an article.
     */
    const selTopic = getSelTopic(subPath, filterActiveTopics(cfg));

    // Handle use cases where a topic (either a parent, or a sub topic) was selected.
    if (selTopic) {
      const selTopicJson = selTopic ? JSON.stringify(selTopic) : "{}";

      //altResponse.headers.set(SEL_TOPIC, selTopicJson);
      altResponse.headers.set(SEL_TOPIC, selTopicJson);
      if (selTopic?.children) {
        const topicsJson = selTopic?.children
          ? JSON.stringify(selTopic?.children)
          : "[]";
        altResponse.headers.set(TOPICS, topicsJson);
      }

      if (selTopic?.articles) {
        const articlesJson = selTopic?.articles
          ? JSON.stringify(selTopic?.articles)
          : "[]";
        altResponse.headers.set(ARTICLES, articlesJson);
      }
      return altResponse;
    }
    // Handle other cases where an article was selected.
    else {
      console.log(`middleware: article selected....`);
      // Get parent topic and set reference.
      const parentTopicUrl = getParentUrl(subPath);
      const articleParentTopic = getSelTopic(parentTopicUrl, cfg);
      const parentTopicJson = articleParentTopic
        ? JSON.stringify(articleParentTopic)
        : "{}";
      response.headers.set(SEL_TOPIC, parentTopicJson);

      const tokens = pathName.split("/");
      const articleLink = tokens[tokens.length - 1];
      let selArticle = undefined;
      selArticle = articleParentTopic?.articles?.find((article) => {
        return article.link === `/${articleLink}`;
      });
      if (!selArticle) {
        // todo: customize message on redirect (what page failed...?)
        return NextResponse.rewrite(new URL("/404", request.url));
      }

      response.headers.set(SEL_ARTICLE, JSON.stringify(selArticle));

      return response;
    }
  }
  console.log(`middleware: no match, default handler....`);
  return response;
}

export const config = {
  matcher: ["/articles/:path*", "/topics"],
};
