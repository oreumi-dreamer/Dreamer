import React from "react";
import styles from "./PostModal.module.css";
import Image from "next/image";
import Link from "next/link";

export default function PostModal() {
  return (
    <>
      {/* <div className={styles.dimmed}></div> */}
      <dialog className={styles["post-modal"]} open>
        <section>
          <h2 className="sr-only">글 본문 정보 및 내용 확인</h2>
          <header>
            <Image></Image>
            <p>
              {"JINI"}
              <Link href="/">@jini</Link>
            </p>
            <span className={styles.time}>2시간전</span>
          </header>
        </section>
        <section>
          <h2 className="sr-only">댓글 작성 및 확인</h2>
        </section>
      </dialog>
    </>
  );
}
