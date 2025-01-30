import styles from "./ArticleListingCell.module.scss";
import { FC } from "react";
import Link from "next/link";
import Article from "@/types/article.type";
import { formatDate, formatLink } from "@/utils/string-utils.utils";

export interface Props {
  article: Article;
  link: string;
}

const ArticleListingCell: FC<Props> = ({ article, link }) => {
  return (
    <div className={styles["article-listing-cell"]}>
      <Link href={`${formatLink(link)}`}>
        <div className={styles["article-title-panel"]}>
          <div>
            <h1>{article.title}</h1>
          </div>
          <div>{formatDate(article.postedDate)}</div>
        </div>
        <div>{article.summary}</div>
      </Link>
    </div>
  );
};

export default ArticleListingCell;
