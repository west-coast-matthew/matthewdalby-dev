import styles from './HeaderPanel.module.scss';
import Link from 'next/link';
import menuCfg from '../../config/menu.json';
import Logo from '../Logo/Logo';

const HeaderPanel = ()=>{

    const getMenuItems = ()=>{
        return menuCfg.map(menuItem=>{

            if(!menuItem.active){
                return;
            }
            return (
                <div key={menuItem.title} className={styles['menu-item']}>
                    <Link href={menuItem.link}>{menuItem.title}</Link>
                </div>
            )
        })
    }

    return(
        <div className={styles['header-panel']}>
            <Link href="/">
                <Logo/>
            </Link>
            <div className={styles['menu-item-container']}>
                {
                    getMenuItems()
                }
            </div>
        </div>
    )
}

export default HeaderPanel;