import { FC } from "react";
import Image from 'next/image';
import styles from './ImageReference.module.scss';

export interface Props{
    imgRef: string;
    description?: string;
}

const ImageReference:FC<Props> = ({imgRef, description})=>{
    return (
        <div className={styles['image-reference']}>
            <Image 
        src={imgRef} 
        alt="Description of the image"
        width={600} 
        height={400}
      />
        <div className={styles['description']}>{description}</div>
        </div>
    )
}

export default ImageReference;