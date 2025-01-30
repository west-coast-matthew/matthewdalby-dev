import { ARTICLES, SEL_ARTICLE, SEL_PATH, SEL_TOPIC, TOPICS } from "@/constants/app.constants";
import Topic from "@/types/topic.type";
import { headers } from "next/headers";
import { parseArticleFromString, parseArticlesFromString, parseTopicFromString, parseTopicsFromString } from "./string-utils.utils";
import Article from "@/types/article.type";

/**
 * Given the fact that pages are templates for articles, and that we are passing 
 * references to path, articles, topics, etc from where they are defined in middleware,
 * and added into the headers, we need to retrieve them from them and rehydrate them into 
 * objects. This method centralized that logic so that it is not duplicated in each 
 * page template. 
 */
export const parseHeaders = async ()=>{

    const headersList = headers();
    const selPathRef = (await headersList).get(SEL_PATH);
    const selPath = selPathRef ? selPathRef : 'none';

    let topics:Topic[] = [];
    const topicsJson = (await headersList).get(TOPICS);
    if(topicsJson){
        topics = parseTopicsFromString(topicsJson);
    }
    
    let articles:Array<Article> = [];
    const articlesJson = (await headersList).get(ARTICLES);
    if(articlesJson){
        articles = parseArticlesFromString(articlesJson); 
    }

    let selTopic:Topic|null = null;
    const selTopicJson = (await headersList).get(SEL_TOPIC);
    if(selTopicJson){
        selTopic = parseTopicFromString(selTopicJson);
    }

    let selArticle:Article|null = null;
    const selArticleJson = (await headersList).get(SEL_ARTICLE);
    if(selArticleJson){
        selArticle = parseArticleFromString(selArticleJson);
    }

    return{
        topics: topics,
        articles: articles,
        selTopic: selTopic, 
        selArticle: selArticle,
        selPath: selPath
    }

}