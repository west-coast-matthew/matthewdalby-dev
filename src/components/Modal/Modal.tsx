import { FC, ReactNode } from "react";
import styles from "./Modal.module.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string; // Optional title for the modal
  subTitle?: string; // Optional subtitle for the modal
}

const Modal: FC<Props> = ({
  isOpen,
  onClose,
  children,
  title = "",
  subTitle,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles["modal"]}>
      <div className={styles["modal-overlay"]} onClick={onClose}>
        <div
          className={styles["modal-content"]}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles["modal-header-panel"]}>
            <div className={styles["title"]}>
              <div>{title}</div>
              <div>{subTitle}</div>
            </div>
            <div className={styles["close-button"]} onClick={() => onClose()}>
              X
            </div>
          </div>

          <div className={styles["modal-body"]}>{children}</div>
          <div className={styles["modal-footer"]}></div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
