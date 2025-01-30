import Topic from "@/types/topic.type";
import Article from "@/types/article.type";
import { parse } from "date-fns";

/**
 * 
 * @param articles 
 */
export const formatActiveArticles = (articles:Array<Article> | undefined):Array<Article>=>{

    if(!articles){
        return [];
    }

    return articles.filter((article)=>{
        return article.active;
    }).sort((b:Article, a:Article) => {
        return a.postedDate.getTime() - b.postedDate.getTime()});
}

/**
 * 
 * @param topics 
 * @returns 
 */
export const filterActiveTopics = (topics:Array<Topic>):Array<Topic>=>{
    return topics.filter((topic)=>{return topic.active}).sort((a,b)=>{
        if (a.title < b.title) {
            return -1;
        }
        if (a.title > b.title) {
            return 1;
        }
        return 0;
    });
}

/**
 * Retrieve a list of all top level topics.
 */
export const getAllActiveTopics = ():Array<Topic>=>{
    return filterActiveTopics(cfg);
} 

/**
 * Retrieve a selected topic via a given path. Path represents a hierarchy, delimited by 
 * the '/' character. For example, given the following data struture
 * 
 * Item 1
 *  Item 1.1
 *  Item 1.2
 *      Item 1.2.1
 *      Item 1.2.2
 *  Item 1.3
 * 
 * Item 2
 *  Item 2.1
 *  Item 2.2
 * 
 * The specified path '/Item1/Item 1.2/Item 1.1.1', the element returned would be 1.1.1.
 * 
 * @param path 
 * @param topics 
 * @returns 
 */
export const getSelTopic = (path: string, topics: Topic[]): Topic | undefined => {
  const tokens = path.trim().slice(1,path.length).split('/');
  const target = tokens[0];
  let selTopic: Topic | undefined;

  for (const topic of topics) {
    
    if (topic.link == `/${target}`) {
      selTopic = topic;
      break;
    }
  }

  if (!selTopic) {
    return undefined;
  }

  if (tokens.length === 1) {
    return selTopic;
  }

  // Use optional chaining to safely access children
  return getSelTopic('/'+ tokens.slice(1).join('/'), selTopic.children ?? []);
};

/*
export const isPathATopicReference(path:string, cfg:Array<Topic>):boolean=>{
    return true;
}*/

/*
export const isPathAnArticleReference(path:string, cfg:Array<Topic>):boolean=>{
    return true;
}*/

/**
 * Master configuration
 */
export const cfg:Array<Topic> = [
    { title: 'API Design', link: '/api-design', summary: '(Mostly) REST based API related', active: true, articles: [
        {
            title: 'Effective REST Controller Design', link: '/designing-controllers', summary: 'Patterns for real world REST APIs.', postedDate: parse('2025-01-01', 'yyyy-MM-dd', new Date()), active: true,
        },
        {
            title: 'REST: Exception Handling', link: '/exception-handling', summary: 'A standardized approach to exception handling', postedDate: parse('2025-01-01', 'yyyy-MM-dd', new Date()), active: true,
        }
    ]},
    { title: 'Applications', link: '/apps', summary: 'Side projects...', active: true, articles: [], children: [
        { title: 'ERP Demo', link: '/erp', summary: 'A real world application example', active: true, articles: [
            {
                title: 'ERP Demo: An Introduction', link: '/introduction', summary: 'An introduction to the project', postedDate: parse('2025-01-01', 'yyyy-MM-dd', new Date()), active: true,
            },
            {
                title: 'ERP Demo: (Part 1) Understanding the Problem Domain', link: '/problem-domain', summary: 'Background on the domain problem at hand', postedDate: parse('2025-01-01', 'yyyy-MM-dd', new Date()), active: true,
            },
            {
                title: 'ERP Demo: (Part 2) System Architecture', link: '/architecture', summary: 'Technical design decisions', postedDate: parse('2025-01-01', 'yyyy-MM-dd', new Date()), active: true,
            },
            {
                title: 'ERP Demo: (Part 3) Defining the core modules', link: '/core-modules', summary: 'Implementing a home for shared code', postedDate: parse('2025-01-01', 'yyyy-MM-dd', new Date()), active: true,
            },
            {
                title: 'ERP Demo: (Part 4) Entity management api', link: '/entity-management-api', summary: 'Initial module for managing various entities', postedDate: parse('2025-01-01', 'yyyy-MM-dd', new Date()), active: true,
            },
            {
                title: 'ERP Demo: (Part 5) Entity management-ui', link: '/entity-management-ui', summary: 'Initial module for managing various entities (user interface)', postedDate: parse('2025-01-01', 'yyyy-MM-dd', new Date()), active: true,
            }

        ] }
    ]},
    { title: 'Software Engineering', link: '/software-engineering', summary: 'Thoughts/obervations of the tech industry', active: true, articles: [
        {
            title: 'Let\'s Build A Blog', link: '/blog-design', summary: 'How I made this blog.', postedDate: parse('2025-06-10', 'yyyy-MM-dd', new Date()), active: true,
        },
        {
            title: 'Auditing Complex Processes', link: '/complex-process-auditing', summary: 'Transitioning complex processes from a black box', postedDate: parse('2024-07-06', 'yyyy-MM-dd', new Date()), active: true,
        },
        {
            title: 'DSL Based Code Generation', link: '/dsl-based-code-generation', summary: 'An experiment in reversing an RDMBs into ORM source', postedDate: parse('2024-06-18', 'yyyy-MM-dd', new Date()), active: true,
        },
        {
            title: 'Jira IDE Integration', link: '/jira-ide-integration', summary: 'Experiences in integrating Jira with IDEs', postedDate: parse('2024-06-18', 'yyyy-MM-dd', new Date()), active: true,
        },
    ]},
    { title: 'Node.js, Typescript', link: '/node-typescript', summary: 'Thoughts/obervations of the tech industry', active: true, articles: [
        {
            title: 'Creating shared modules with node', link: '/creating-shared-modules', summary: 'Developing shared modules in Node.js', postedDate: parse('2024-06-18', 'yyyy-MM-dd', new Date()), active: true,
        },
        {
            title: 'Node REST API Boilerplate', link: '/node-api-boilerplate', summary: 'Developing a REST API with a shared module', postedDate: parse('2024-06-18', 'yyyy-MM-dd', new Date()), active: true,
        },
    ]},
];