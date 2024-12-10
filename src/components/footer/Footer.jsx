import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* <input
        type="text"
        className={styles["footer-search-inp"]}
        name="footer-search"
      /> */}
      <article className={styles["recommend-wrap"]}>
        <h2 className={styles["recommend-title"]}>추천 DREAMER</h2>
        <div className={styles["recommend-list"]}></div>
      </article>
      <section className={styles["footer-policy"]}>
        <ul>
          <li>
            <Link href="/terms">이용 약관</Link>
          </li>
          <li>
            <Link href="/privacy">
              <strong>개인정보 처리방침</strong>
            </Link>
          </li>
        </ul>
        <p>
          Copyright © 2024 DREAMER.
          <br />
          All rights reserved.
        </p>
      </section>
    </footer>
  );
}
