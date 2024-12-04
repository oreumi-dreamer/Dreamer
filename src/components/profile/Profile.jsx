import React from "react";
import styles from "@/components/profile/Profile.module.css";

export default function Profile() {
  return (
    <>
      <main className={styles["profile-main"]}>
        <section className={styles["profile-container"]}>
          <div className={styles["profile-wrap"]}>
            <div className={styles["profile-img"]}></div>
            <div className={styles["profile-info"]}>
              <span className={styles["profile-name"]}>DREAMER</span>
              <span className={styles["profile-id"]}>@DREAMER</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
