import React from "react";
import styles from "./Header.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>
        <Link href={"#"}>
          <img src="/images/logo-full.svg" alt="dreamer logo" />
        </Link>
      </h1>
      <button className={styles["mode-toggle-btn"]}>
        <div className={styles["toggle-switch"]}></div>
      </button>
      <div className={styles["header-btn-container"]}>
        <nav>
          <ul className={styles.nav}>
            <li className={styles["nav-item"]}>
              <button className={`${styles.home} ${styles.active}`}>홈</button>
            </li>
            <li className={styles["nav-item"]}>
              <button className={styles.search}>검색</button>
            </li>
            <li className={styles["nav-item"]}>
              <button className={styles.message}>메시지</button>
            </li>
            <li className={styles["nav-item"]}>
              <button className={styles.alarm}>알림</button>
            </li>
            <li className={styles["nav-item"]}>
              <button className={styles.wright}>글쓰기</button>
            </li>
          </ul>
        </nav>
        <button href={"#"} className={styles["profile-btn"]}>
          <img src="/images/basic-profile.svg" alt="프로필사진" />
          <p>JINI</p>
        </button>
        <button className={styles.more}>더보기</button>
      </div>
    </header>
  );
}
