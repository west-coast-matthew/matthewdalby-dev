import { FC } from "react";
import styles from "./MovementSequenceExample.module.scss";

const UmlClassDiagram: FC = () => {
  return (
    <div id="animation-container" className={styles["animation-container"]}>
      <iframe src="http://localhost:3000/sample/index.html"></iframe>
    </div>
  );
};

export default UmlClassDiagram;
