import { filterActiveTopics, formatActiveArticles, getSelTopic } from "@/services/api-service.service";
import Article from "@/types/article.type";
import Topic from "@/types/topic.type";
import { parse } from 'date-fns';
import { assert, assertType, test } from "vitest";

test('Identify is a link references an topic',()=>{
    const cfg:Array<Topic> = loadMockConfig();

    assert(cfg!=null);
    assert(cfg.length==4);
})

test('Identify is a link references an article',()=>{
    
})

test('Filter active topics',()=>{
    const cfg:Array<Topic> = loadMockConfig();
    let result:Array<Article>;

    result = formatActiveArticles(undefined);
    assert(result!=null);
    assert(result.length==0);

    result = formatActiveArticles(cfg.at(2)?.articles);
    assert(result!=null);
    assert(result.length==2, `expected length of 2, received ${result.length}`);
    assert(result[0].title==='article 2');
    assert(result[1].title==='article 1');

})

test('Filter active articles',()=>{
    const cfg:Array<Topic> = loadMockConfig();
    
    const result = filterActiveTopics(cfg);
    assert(result!=null);
    assert(result.length==3)

})

test('Get selected target',()=>{
    const cfg:Array<Topic> = loadMockConfig();
    let selTopic:Topic|undefined;

    selTopic = getSelTopic('/topic1', cfg);
    assert(selTopic!=null,`unable to locate topic for 'topic1'`);
    assert(selTopic?.link==='/topic1', selTopic?.link);
    selTopic = getSelTopic('/topic2',cfg);
    assert(selTopic!=null);
    assert(selTopic?.link==='/topic2');
    selTopic = getSelTopic('/topic3',cfg);
    assert(selTopic!=null);
    assert(selTopic?.link==='/topic3');
    assert(selTopic.articles!=null);
    assert(selTopic.articles.length==3);
    selTopic = getSelTopic('/topic4',cfg);
    assert(selTopic!=null);
    assert(selTopic?.link==='/topic4');
    selTopic = getSelTopic('/topic4/topic4.1',cfg);
    assert(selTopic!=null);
    assert(selTopic?.link==='/topic4.1');

})

export const loadMockConfig = ():Array<Topic>=>{
    const cfg:Array<Topic> = [
        { title: 'topic 1', link: '/topic1', summary: '', active: true},
        { title: 'topic 2', link: '/topic2', summary: '', active: false},
        { title: 'topic 3', link: '/topic3', summary: '', active: true, articles:[
            { title: 'article 1', link: '', summary: '', postedDate: parse('2025-01-01','yyyy-MM-dd',new Date()), active: true },
            { title: 'article 2', link: '', summary: '', postedDate: parse('2025-02-08','yyyy-MM-dd',new Date()), active: true },
            { title: 'article 3', link: '', summary: '', postedDate: parse('2025-03-09','yyyy-MM-dd',new Date()), active: false }
        ]},
        { title: 'topic 4', link: '/topic4', summary: '', active: true,
            children:[
                { title: 'topic 4.1', link: '/topic4.1', summary: '', active: true, articles:[
                    { title: 'article 4', link: '', summary: '', postedDate: parse('2025-01-01','yyyy-MM-dd',new Date()), active: true },
                    { title: 'article 5', link: '', summary: '', postedDate: parse('2025-01-01','yyyy-MM-dd',new Date()), active: true }        
                ]},
                { title: 'topic 4.2', link: '/topic4.2', summary: '', active: true, articles:[
                    { title: 'article 6', link: '', summary: '', postedDate: parse('2025-01-01','yyyy-MM-dd',new Date()), active: true },
                    { title: 'article 7', link: '', summary: '', postedDate: parse('2025-01-01','yyyy-MM-dd',new Date()), active: true },
                    { title: 'article 8', link: '', summary: '', postedDate: parse('2025-01-01','yyyy-MM-dd',new Date()), active: true },
                    { title: 'article 9', link: '', summary: '', postedDate: parse('2025-01-01','yyyy-MM-dd',new Date()), active: false }
                ]}
            ]
        }
    ];
    
    return cfg;
}