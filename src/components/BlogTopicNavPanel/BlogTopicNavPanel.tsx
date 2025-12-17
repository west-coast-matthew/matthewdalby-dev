// import Link from 'next/link';
import styles from './BlogTopicNavPanel.module.scss';
import {FC} from 'react';

/**
 * BlogTopicNavPanel:
 * 
 * Used to display all blog topion
 * 
 * @returns 
 */
const BlogTopicNavPanel:FC = ()=>{
    /*
 
                <li><Link href='/blog/software-engineering'>Software Engineering (2 articles)</Link></li>
                <li><Link href='/blog/rest-design'>REST Design (2 articles)</Link></li>
                <li><Link href='/blog/ui'>UI (2 articles)</Link></li>
                <li><Link href='/blog/misc'>Misc (2 articles)</Link></li>
                <li><Link href='/blog/hydroponics'>Hydroponics (2 articles)</Link></li>
                
    */
    return(
        <div className={styles['blog-topic-nav-panel']}>
            <ul>
               
            </ul>
        </div>
    )
}

export default BlogTopicNavPanel;