import { FC } from "react";

import styles from './FooterPanel.module.scss';
import ReactLogo from "../FooterIcon/ReactLogo";
import { Fade, Slide } from "react-awesome-reveal";
import JavaLogo from "../FooterIcon/JavaLogo";
import SpringLogo from "../FooterIcon/SpringLogo";

const NavBar:FC =()=>{
    
    return(
        <div className={styles['footer-panel']}>
            <Fade>
                <Slide direction="up">
                    <div className={styles['name-reference']}>Matthew Dalby</div>

                    <div className={styles['icon-tray']}>
            
                        <div>
                            <ReactLogo />
                        </div>
                        <div>
                            <SpringLogo />
                        </div>
                        <div>
                            <JavaLogo />
                        </div>

                    </div>
                    
                    <div className={styles['']}>
                        Software Engineer, Technologist, Amature Chef Hack.
                    </div>
                </Slide>
            </Fade>
        </div>
    )
}

export default NavBar;