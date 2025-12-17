import styles from './Logo.module.scss';
import { FC } from 'react';

const HeaderLogo: FC = ()=>{

    return(
        <>
            <div className={styles['header-logo']}>
                Matthew M Dalby
            </div>
        </>
    )

}

export default HeaderLogo;