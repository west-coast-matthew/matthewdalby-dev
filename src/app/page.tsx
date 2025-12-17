import { Fade } from "react-awesome-reveal";
import styles from "./page.module.scss";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Matthew Dalby: Software Engineer",
  description:
    "A technical blog focusing on React, Java, and Node technology stacks. Tutorials, articles, and real world software examples. Opinions and advice on various aspects of software development.",
};

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles["main-content"]}>
          <Fade delay={50} duration={100}>
            <h1>Welcome</h1>

            <p>
              After a lot of reservation, I decided to finally start a personal
              blog, and here we are. I wanted to share personal reflections on
              technology, side projects, and touch a bit on cooking. There is no
              shortage of people covering technical content out there, and I was
              reluctant to &apos;add to the pile&apos;, however after writing
              articles for personal reflection, I decided that there would be
              some value in sharing them.
            </p>

            <p>
              If you are looking for how I would implement a &apos;real
              world&apos; application, take some time to visit the &apos;ERP
              Demo&apos; section. I have put a lot of time into creating a real
              world application mostly for the purposes of personal growth,
              however also to share techniques and a discussion on software
              architecure.
              <Link href="/articles/inventory-tracking-system">
                Learn more about my enterprise tracking app.
              </Link>
            </p>

            <p></p>

            <p>
              If you want to learn a bit more more about me,{" "}
              <Link href={"/about"}>
                <span className={styles["link"]}>
                  you can find out a bit more about me here
                </span>
              </Link>{" "}
            </p>

            <p>
              Hiring?, I am actively looking for a new project(s) to call home,
              full time would be ideal, however will to work as a hired gun on a
              part time or contract basis. Bypass a mountain of applications,
              and{" "}
              <Link href={"/hire-me"}>
                <span className={styles["link"]}>view my elevator pitch.</span>
              </Link>
            </p>
          </Fade>
        </div>
      </main>
    </div>
  );
}
