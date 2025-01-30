

import React, { FC } from 'react';
import { Fade } from 'react-awesome-reveal';
//import Img from '../../../public/icons/arrow-up.svg';
import styles from './TopPositionCTA.module.scss';

const FadeIn:FC = ()=>{

  return (
    <Fade>
      <div className={styles['cta']}>
        <a href="#">
          <div>
           Img
          </div>
          <div>
            Top
          </div>
        </a>
      </div>    
    </Fade>
    
  );
  
}

export default FadeIn;