"use client";

import styles from "./Loading.module.css";

export default function Loading({ type, className }) {
  if (type === "small") {
    return (
      <div className={styles["loading-small"]}>
        <div></div>
      </div>
    );
  } else if (type === "full") {
    return (
      <main id="loading-wrapper" className={styles["loading-container"]}>
        <div className={styles.loading}>
          <div></div>
        </div>
      </main>
    );
  } else if (type === "miniCircle") {
    return (
      <div className={`${styles["loading-mini"]} ${className}`}>
        <div></div>
      </div>
    );
  } else {
    return (
      <div className={styles.loading}>
        <div></div>
      </div>
    );
  }
}
