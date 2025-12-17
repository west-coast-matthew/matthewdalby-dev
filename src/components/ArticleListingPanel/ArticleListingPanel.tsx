import cx from 'classnames';
import styles from './ArticleListingPanel.module.scss';
import { FC } from 'react';
import ArticleListingCell from '../ArticleListingCell/ArticleListingCell';
import TopPositionCTA from '../TopPositionCTA';
import { Fade } from 'react-awesome-reveal';
import Topic from '@/types/topic.type';
import Article from '@/types/article.type';
import { formatActiveArticles } from '@/services/api-service.service';

/**
 * ArticleListingPanel
 *  
 *  Component used to display a collection of provided articles based on a selected 
 *  category. 
 * 
 * 
 */
export interface Props{
    topic?:Topic;
}

const ArticleListingPanel:FC<Props> = async({topic})=>{
    
    const getArticleSummaries = (articles?:Array<Article>)=>{
        
        if(!articles){
          return [];
        }

        return formatActiveArticles(articles).map((article: Article, index)=>{
            return(<>
            
            <ArticleListingCell key={String(index)} article={article} link={`/articles/${topic?.link}${article.link}`}/>
            </>
               
            )
        });
    }

    if(!topic){
      return (
        <div>No Topic!</div>
      )
    }

    return (
    <div className={styles['main-panel']}>wwwwwwwwww
      <h1 className={cx(styles['subtitle'],styles['dropdown-fade-in'])}>{topic.title}</h1>
      <h2 className={cx(styles['anim-fade-in'],styles['subtitle'])}>{topic.summary}</h2>
      
      <div className={styles['listing-content']}>

          <div className={styles['article-listing-panel']}>

            <div className={styles['topics-list-panel']}>
                [x Available Topics]
                { getArticleSummaries(topic.articles) }
            </div>

        </div>


      { /* Provides jump to the top section*/ }
      <Fade><TopPositionCTA/></Fade>
      
      </div>

    </div>
  );
}

export default ArticleListingPanel;