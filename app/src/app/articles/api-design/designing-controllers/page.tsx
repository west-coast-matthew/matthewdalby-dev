
import { Metadata } from 'next';
import { parseHeaders } from '@/utils/page-utils';
import ArticleTemplateLayout from '@/app/articles/article-template';

/**
 * Represents an 'individual' article.
 * 
 * todo:
 *  - implement an HOC to handle the layout while we just specify content here... =or= should we 
 * apply a custom selected <template className=""></template>
 */

export const metadata: Metadata = {
  title: 'Matthew Dalby: Articles: API Design: Exception Handling'
}

export default async function ArticlePage() {
  
  const {selPath, selArticle} = await parseHeaders();
  
  return (
    <ArticleTemplateLayout selPath={selPath} selArticle={selArticle}>
      
      designing controllers blog article... content here

    </ArticleTemplateLayout>
    
  );

}

