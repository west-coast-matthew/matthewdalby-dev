import styles from "./TopicDisplayCell.module.scss";
import cx from "classnames";
import { FC } from "react";
import Link from "next/link";
import Topic from "@/types/topic.type";
import { formatLink } from "@/utils/string-utils.utils";

/**
 * TopicDisplayCell
 *
 * Used to display available article categories.
 *
 */
export interface Props {
  topic: Topic;
  path: string;
}

const TopicDisplayCell: FC<Props> = ({ topic, path }) => {
  return (
    <div className={cx(styles["topic-display-cell"], styles["no-link"])}>
      <Link href={`/${formatLink(path)}`}>
        <div className={styles["upper-section"]}></div>
        <div className={styles["lower-section"]}>
          <h2>{String(topic.title)}</h2>
          <p>{topic.summary}</p>
        </div>
      </Link>
    </div>
  );
};

export default TopicDisplayCell;
