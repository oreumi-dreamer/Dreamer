import Image from "next/image";
import styles from "./Loading.module.css";

export default function Loading({ type }) {
  if (type === "small") {
    return (
      <div className={styles["loading-small"]}>
        <div></div>
      </div>
    );
  } else {
    return (
      <main className={styles.loading}>
        <div></div>
      </main>
    );
  }
}
