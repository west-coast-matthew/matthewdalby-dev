import { FC } from "react";
import styles from "./UmlClassDiagram.module.scss";

const UmlClassDiagram: FC = () => {
  return (
    <div id="animation-container" className={styles["animation-container"]}>
      <iframe src="/sample/index.html"></iframe>
    </div>
  );
};

export default UmlClassDiagram;
