import Article from "@/types/article.type";
import Topic from "@/types/topic.type";

/**
 * Given an URL, ensure that it does not contain double forward slashes.
 * 
 * @param link 
 * @returns 
 */
export const formatLink = (link:string)=>{
    let res = link.replace('none','/articles').replace(/\/\/+/g, '/');
    res  = res.replaceAll("/articles/articles/", "/articles");
    return res;
}

/**
 * Given an URL, return the URL minus the last token. This is usefull when attempting to 
 * get the URL of the topic for a specified article.
 * 
 * @param reqUrl 
 */
export const getParentUrl = (reqUrl:string) =>{
    const parts = reqUrl.split('/');
    parts.pop();
    return parts.join('/');
}

/**
 * Given an URL that references an article, get the portion of the URL that 
 * references the article.
 * 
 * @param reqUrl 
 * @returns 
 */
export const getSelArticleTitleFromUrl = (reqUrl:string)=>{
    const tokens = reqUrl.split('/');
    return tokens[tokens.length-1];
}

/**
 * 
 * @param topicStr 
 * @returns 
 */
export const parseTopicFromString = (topicStr:string):Topic=>{
    return JSON.parse(topicStr, (key, value) => {
       if (key === 'postedDate') {
           return new Date(value);
       }
       return value;
   })
}

/**
 * 
 * @param topicStr 
 * @returns 
 */
export const parseTopicsFromString = (topicStr:string):Array<Topic>=>{
    return JSON.parse(topicStr, (key, value) => {
       if (key === 'postedDate') {
           return new Date(value);
       }
       return value;
   })
}

/**
 * 
 * @param topicStr 
 * @returns 
 */
export const parseArticleFromString = (jsonStr:string):Article=>{
    
    return JSON.parse(jsonStr, (key, value) => {
       if (key === 'postedDate') {
           return new Date(value);
       }
       return value;
   })
}

/**
 * 
 * @param topicStr 
 * @returns 
 */
export const parseArticlesFromString = (jsonStr:string):Array<Article>=>{
    return JSON.parse(jsonStr, (key, value) => {
       if (key === 'postedDate') {
           return new Date(value);
       }
       return value;
   })
}

/**
 * Format a date object for display purposes.
 */
export const formatDate = (selDate:Date|undefined):string =>{
    if(!selDate){
        return '';
    }
    
    return selDate.toLocaleString('default', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}