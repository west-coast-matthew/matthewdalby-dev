import styles from "./Breadcrumb.module.scss";
import Link from "next/link";
import { FC } from "react";

export interface Props {
  path?: string | undefined | null;
}

const BreadcrumbPanel: FC<Props> = ({ path }) => {
  if (path === "none") {
    return (
      <div className={styles["breadcrumb-panel"]}>
        <div>Articles</div>
      </div>
    );
  }

  const safePath = path ?? "/";
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

  return <div className={styles["breadcrumb-panel"]}>{breadcrumbs}</div>;
};

export default BreadcrumbPanel;
