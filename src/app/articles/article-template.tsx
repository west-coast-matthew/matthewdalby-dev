import cx from "classnames";
import styles from "@/app/articles/articles-listing.module.scss";
import articleDetailStyles from "./article-detail.module.scss";
import BreadcrumbPanel from "@/components/Breadcrumb";
import React, { ReactNode } from "react";
import Article from "@/types/article.type";
import { Fade } from "react-awesome-reveal";
import TopPositionCTA from "@/components/TopPositionCTA";
import { formatDate } from "@/utils/string-utils.utils";

/**
 *
 */
interface TemplateLayoutProps {
  children: ReactNode;
  selPath: string;
  selArticle?: Article | undefined | null;
}

const ArticleTemplateLayout: React.FC<TemplateLayoutProps> = ({
  children,
  selPath,
  selArticle,
}) => {
  return (
    <div className={styles["main-panel"]}>
      <BreadcrumbPanel path={selPath} />

      <h1 className={cx(styles["subtitle"], styles["dropdown-fade-in"])}>
        {selArticle?.title}
      </h1>
      <h2 className={cx(styles["anim-fade-in"], styles["subtitle"])}>
        {selArticle?.summary}
      </h2>
      <div className={articleDetailStyles["article-detail"]}>
        <div className={articleDetailStyles["posted-date"]}>
          Posted on {formatDate(selArticle?.postedDate)}
        </div>

        <div className={articleDetailStyles["listing-content"]}>{children}</div>

        <div className={articleDetailStyles["cta-panel"]}>
          <Fade>
            <TopPositionCTA />
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default ArticleTemplateLayout;
