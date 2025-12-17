"use client";

import { FC, useState } from "react";
import styles from "./CodeSnippet.module.scss";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import cx from "classnames";

export interface Props {
  srcCode: string;
}

export const CodeSnippet: FC<Props> = ({ srcCode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className={styles["code-snippet"]}>
      <div onClick={toggleExpanded} className={styles["toggle-button"]}>
        {isExpanded ? "- Show Less" : "+ Show More"}
      </div>

      <div
        className={cx({
          [styles.expanded]: isExpanded,
        })}
      >
        <div
          className={cx(
            styles["code-content"],
            isExpanded ? styles["expanded"] : ""
          )}
        >
          <SyntaxHighlighter
            language="javascript"
            style={oneDark}
            showLineNumbers
          >
            {srcCode}
          </SyntaxHighlighter>
        </div>
      </div>

      <div onClick={toggleExpanded} className={styles["toggle-button"]}>
        {isExpanded ? "- Show Less" : "+ Show More"}
      </div>
    </div>
  );
};

export default CodeSnippet;
