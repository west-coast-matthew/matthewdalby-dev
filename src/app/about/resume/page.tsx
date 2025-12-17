import styles from '../about.module.scss';
import cx from 'classnames';
import { Fade } from 'react-awesome-reveal';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Matthew Dalby: About Me',
  description: 'Learn more about Matthew Dalby, a full-stack software engineer with 15+ years of experience in React, TypeScript, Java, and Spring. Passionate about building scalable web applications and sharing knowledge through his tech blog.'
}

export default function AboutPage() {

    return (
      <div className={styles['main-panel']}>
        <div className={styles['about-panel']}>
          <h1 className={cx(cx(styles['subtitle'],styles['dropdown-fade-in']))}>Matthew Dalby</h1>
          <h2 className={cx(styles['subtitle'],styles['anim-fade-in'])}>Software Engineer, Technologist, Amature Chef Hack</h2>

          <div className={styles['about-panel']}>

          <Fade>
          <h3>Hiring?</h3>

            <p>
                I am activively looking for a full time role, please feel to reach out if you are 
                hiring! I am also open to contract work, part time, or if you need an occasional
                helping hand!
            </p>

            <Link href="/resume-mdalby-2025.pdf" target="_blank">
              <span className={styles['link']}>Click here to download</span>
            </Link>
            <br/>
          </Fade>

          </div>

        </div>
      </div>
    );
  }
  