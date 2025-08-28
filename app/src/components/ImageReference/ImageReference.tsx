import { FC } from "react";
import Image from "next/image";
import styles from "./ImageReference.module.scss";

export interface Props {
  imgRef: string;
  description?: string;
  height?: number;
  width?: number;
}

const ImageReference: FC<Props> = ({
  imgRef,
  description,
  height = 400,
  width = 600,
}) => {
  return (
    <div className={styles["image-reference"]}>
      <Image
        src={imgRef}
        alt="Description of the image"
        height={height}
        width={width}
      />
      <div className={styles["description"]}>{description}</div>
    </div>
  );
};

export default ImageReference;
