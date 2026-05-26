import { Fade } from "react-awesome-reveal";
import styles from "../page.module.scss";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hired Gun - Matthew Dalby",
  description: "A brief introduction.",
};

export default function HiredGun() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles["main-content"]}>
          <Fade delay={50} duration={100}>
            <h1>Hired Gun</h1>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </Fade>
        </div>
      </main>
    </div>
  );
}
