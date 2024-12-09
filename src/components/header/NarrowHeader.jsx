"use client";

import React from "react";
import styles from "./NarrowHeader.module.css";
import Link from "next/link";

export default function NarrowHeader() {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>
        <Link href="/">
          <img src="/images/logo-moon.svg" alt="DREAMER" />
        </Link>
      </h1>
      <button
        className={`${styles["mode-toggle-btn"]} ${styles["light-mode"]}`}
      >
        모드토글btn
      </button>
      <div className={styles["header-btn-container"]}>
        <nav>
          <ul className={styles.nav}></ul>
        </nav>
      </div>
    </header>
  );
}
