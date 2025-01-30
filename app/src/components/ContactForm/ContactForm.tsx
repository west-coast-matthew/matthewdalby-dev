"use client";

import { FC, useState } from "react";
import styles from "./ContactForm.module.scss";
import Img from "../../../public/icons/thumbs-up-icon.svg";
import cx from "classnames";
//import MouseImg from '../../../public/icons/mouse.svg';

const ContactForm: FC = ({}) => {
  const [loading, setLoading] = useState(false);
  const [wasPosted, setWasPosted] = useState(false);
  const [displaySubscribeOptIn, setDisplaySubscribeOptIn] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    // Prevent the form from submitting the traditional way
    e.preventDefault();

    // Don't submit twice
    if (loading) {
      return;
    }

    // 👇 A nice little track to get all the form values as an object
    const form = e.target as HTMLFormElement;
    const formValues = Object.fromEntries(new FormData(form).entries());

    setLoading(true);
    setWasPosted(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      });

      setLoading(false);

      // Reset the form values after a successful submission
      form.reset();
    } catch (err) {
      console.error(err);
      alert("An error occurred while sending your message...");
      setLoading(false);
    }
  };

  const getForm = () => {
    return (
      <form onSubmit={onSubmit}>
        <div>
          <input type="text" name="name" placeholder="Your Name" required />
        </div>
        <div>
          <input
            type="text"
            name="email"
            placeholder="Email Address"
            required
          />
        </div>
        <div>
          <textarea name="message" placeholder="Comments" required />
        </div>
        <div className={styles["newsletter-opt-in-panel"]}>
          <input
            type="checkbox"
            id="newsletter-opt-in"
            name="optIn"
            value="true"
            onClick={() => {
              setDisplaySubscribeOptIn(!displaySubscribeOptIn);
            }}
          />
          <label htmlFor="newsletter-opt-in">Sign up for my newsletter</label>
          {displaySubscribeOptIn && <Img class={styles["fade-in"]} />}
        </div>
        <button disabled={loading} type="submit">
          Reach Out!
        </button>
      </form>
    );
  };
  return (
    <div className={styles["contact-form"]}>
      {wasPosted ? (
        <div className={cx(styles["confirmation-message"], styles["fade-in"])}>
          <h3>Thank You!</h3>
        </div>
      ) : (
        getForm()
      )}
    </div>
  );
};

export default ContactForm;
