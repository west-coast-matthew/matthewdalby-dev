"use client";

import { useEffect, FC } from "react";
import { X } from "lucide-react";
import styles from "./ImageModal.module.scss";

export interface ModalImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface ImageModalProps {
  isOpen: boolean;
  image: ModalImage | null;
  onClose: () => void;
}

export const ImageModal: FC<ImageModalProps> = ({ isOpen, image, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !image) return null;

  return (
    <div className={styles["modal-overlay"]} onClick={onClose}>
      <div className={styles["modal-container"]} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={styles["close-button"]}
          aria-label="Close modal"
        >
          <X className={styles["close-icon"]} />
        </button>

        {/* Image Container */}
        <div className={styles["image-container"]}>
          <img
            src={image.src}
            alt={image.alt}
            className={styles["modal-image"]}
          />
        </div>

        {/* Caption/Description */}
        {(image.title || image.description) && (
          <div className={styles["caption-panel"]}>
            {image.title && <h3 className={styles["caption-title"]}>{image.title}</h3>}
            {image.description && (
              <p className={styles["caption-description"]}>{image.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
