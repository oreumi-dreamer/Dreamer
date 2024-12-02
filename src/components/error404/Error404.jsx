import React from "react";
import styles from "./Error404.module.css";
import Link from "next/link";

export default function Error404() {
  return (
    <div className={styles["page-wrap"]}>
      <h1 className={styles.logo}>
        <Link href={"#"}>
          <img src="/images/logo-404.svg" alt="logo" />
        </Link>
      </h1>
      <p className={styles["page-not-found"]}>페이지를 찾을 수 없습니다.</p>
      <button className={styles["go-back-btn"]}>이전 페이지로</button>
    </div>
  );
}
