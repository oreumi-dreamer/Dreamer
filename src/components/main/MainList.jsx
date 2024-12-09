import React from "react";
import styles from "./MainList.module.css";
import Image from "next/image";

export default function MainList() {
  return (
    <>
      <main className={styles["main-container"]}>
        <h2 className="sr-only">게시글 목록</h2>
        <article className={styles["main-post-wrap"]}>
          <section className={styles["post-user-info"]}>
            <Image
              src="/images/rabbit.svg"
              alt="프로필 사진"
              width={49}
              height={49}
            />
            <div className={styles["user-name"]}>JINI</div>
            <div className={styles["user-id"]}>@jini</div>
            <time className={styles["posting-time"]}>2시간 전</time>
            <Image src="/images/more.svg" alt="더보기" width={40} height={40} />
          </section>
          <section className={styles["post-content"]}></section>
          <section className={styles["post-btn-content"]}></section>
        </article>
      </main>
    </>
  );
}
