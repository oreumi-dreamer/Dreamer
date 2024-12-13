"use client";

import styles from "./Loading.module.css";
import useTheme from "@/hooks/styling/useTheme";

export default function Loading({ type }) {
  const { theme } = useTheme();

  if (type === "small") {
    return (
      <div className={styles["loading-small"]}>
        <div></div>
      </div>
    );
  } else if (type === "full") {
    return (
      <div
        id="loading-wrapper"
        className={styles["loading-container"]}
        data-theme={theme}
      >
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
