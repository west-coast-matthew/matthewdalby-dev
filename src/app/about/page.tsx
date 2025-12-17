import styles from './about.module.scss';
import cx from 'classnames';
import headshot from '../../../public/headshot.png';
import Image from 'next/image';
import ContactForm from '@/components/ContactForm';
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

            <Image src={headshot} width="100" height="100" alt="Headshot Photo"/>
            
            <p>Hello my name is Matthew! I am an seasoned full-stack software engineer with 15+ years of tinkering, building, optimizing, and of course, fixing code. It started when I was age 10, a hobby that turned into a career, there seems to be always something to keep me engaged. I have worked for startup mode, high growth, and enterprise organizations. These experiences have helpd to form a unique personal perspective on technology.</p>

            <p>I have learned a tremedous amount from past mentors and online resources. I wanted to contribute back at some point, while improving my writing style, so I started this blog....</p>

            <p>When not behind a keyboard, you can find me pursuing my other interests in art or cooking, or just hanging out with my children. I apply an engineering perspective towards most of my hobbies. As a continual learner, I enjoy pushing myself past boundaries.</p>  

          <Fade>
          <h3>Technologies</h3>
            <p>I have focused for the better part of the last decade working in web based applications. I have intentionally not established a primary focus on &apos;<i>front or backend</i> &apos; technologies. I prefer a full stack approach.
            More ownership of the overall effort, greater impact.
            </p>

            <div className={cx(styles['skillset_'], styles['skills-panel'])}>
              <ul>
                <li>React</li>
                <li>Java/Spring</li>
                <li>NextJS</li>
                <li>Javascript/Typescript</li>
              </ul>
            </div>

            </Fade>


            <Fade><h3>Links</h3></Fade>
            <Fade>
              <div className={styles['links-panel']}>
                <div>GitHUB</div>
                <div>
                  <Link href='https://github.com/west-coast-matthew/' target="_blank">
                  <span className={styles['link']}>https://github.com/west-coast-matthew/</span>
                  </Link>
                  <br/>
                </div>
                <div>LinkedIn</div>
                <div>
                <Link href='https://www.linkedin.com/in/matthewdalby/' target="_blank">
                <span className={styles['link']}>
                  https://www.linkedin.com/in/matthewdalby/
                  </span>
                  </Link>
                </div>
                <div>
                  Resume
                </div>
                <div>
                  <Link href="/about/resume">
                  <span className={styles['link']}>Click Here</span></Link>
                </div>
              </div>
            </Fade>

            <Fade>
            <h3>Lets Get in Touch !</h3>
            <p>
              Feel free to reach out with me via social media or shoot me over an email with the below form. 
              I am working on an newsletter in the near future, so you can optionally sign up for 
              updates!
            </p>

            <p>
              If you are looking for part time help, or a resource to jumpstart a new project, I would love to get in touch and learn more about your specific needs and offer my services...
            </p>

            <ContactForm />
            </Fade>

          </div>

        </div>
      </div>
    );
  }
  