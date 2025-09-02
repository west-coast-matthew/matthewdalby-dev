import styles from "./Breadcrumb.module.scss";
import Link from "next/link";
import { FC } from "react";

export interface Props {
  path?: string | undefined | null;
}

function removeFirstToken(inputString: string): string {
  // Split the string into an array of tokens based on spaces
  const tokens = inputString.split(" ");

  // If there are no tokens or only one token, return an empty string or the string itself
  if (tokens.length <= 1) {
    return ""; // Or return inputString if you prefer to keep single-token strings
  }

  // Remove the first token by slicing the array from the second element
  const remainingTokens = tokens.slice(1);

  // Join the remaining tokens back into a string with spaces
  return remainingTokens.join(" ");
}

const BreadcrumbPanel: FC<Props> = ({ path }) => {
  if (path === "none") {
    return (
      <div className={styles["breadcrumb-panel"]}>
        <div>Topics</div>
      </div>
    );
  }

  // const safePath = path ? removeFirstToken(path) : "";

  const safePath = path ? path : "";

  const pathTokens = safePath.split("/").filter(Boolean);

  const breadcrumbs: Array<React.ReactElement> = [];
  let linkTrail = safePath.startsWith("/articles") ? "/" : "/articles/";
  pathTokens.forEach((curPath, index) => {
    linkTrail += curPath + "/";

    if (!curPath.startsWith("/articles")) {
      const label = decodeURIComponent(curPath)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      if (index == pathTokens.length - 1) {
        breadcrumbs.push(<span> / {label} </span>);
      } else {
        breadcrumbs.push(<Link href={`${linkTrail}`}> / {label} </Link>);
      }
    }
  });

  breadcrumbs.shift();
  breadcrumbs.unshift(<Link href={`/topics/`}> / Articles </Link>);

  return <div className={styles["breadcrumb-panel"]}>{breadcrumbs}</div>;
};

export default BreadcrumbPanel;
