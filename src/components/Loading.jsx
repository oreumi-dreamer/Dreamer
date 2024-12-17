"use client";

import styles from "./Loading.module.css";

export default function Loading({ type }) {
  if (type === "small") {
    return (
      <div className={styles["loading-small"]}>
        <div></div>
      </div>
    );
  } else if (type === "full") {
    return (
      <div id="loading-wrapper" className={styles["loading-container"]}>
        <div className={styles.loading}>
          <div></div>
        </div>
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
