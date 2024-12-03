import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <input type="text" className={styles["footer-search-inp"]} />
      <article className={styles["recommend-wrap"]}>
        <p className={styles["recommend-title"]}>추천 DREAMER</p>
        <div className={styles["recommend-list"]}></div>
      </article>
      <section className={styles["footer-policy"]}>
        <p>개인정보 어쩌구</p>
      </section>
    </footer>
  );
}
