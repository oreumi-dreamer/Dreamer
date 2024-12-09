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
            <Image
              src="/images/more.svg"
              alt="더보기"
              width={40}
              height={40}
              className={styles["more-btn"]}
            />
          </section>
          <section className={styles["post-content"]}>
            <p className={styles["post-text"]}>
              <div>나는 오늘 꿈에서 친구를 만났다.</div>
              <div>친구와 놀이터에 가서 놀았다.</div> 놀고 있는데 외계인이
              <div>침공했다. 너무 무서웠다.</div>
              <div>국가는 외계인 침공에 대항해야 할 것이다.</div>
              <div>국가는 무엇을 하는가 우리의 세금은 잔뜩 가져가면서</div>
              <div>
                침공에 대한 방안에는 무엇이 있는가 내일까지 작성해오세요.
              </div>
              <div>그림</div>
              <div>이런식으로</div>
            </p>
            <div className={styles["post-img-wrap"]}>
              <div className={styles["post-img"]}></div>
              <div className={styles["post-img"]}></div>
              <div className={styles["post-img"]}></div>
              <div className={styles["post-img"]}></div>
              <div className={styles["post-img"]}></div>
            </div>
          </section>
          <section className={styles["post-btn-content"]}>
            <button>
              <Image src="/images/star.svg" alt="반짝" width={40} height={40} />
            </button>
            <button className={styles["btn-label"]}>99+ 반짝</button>
            <button>
              <Image
                src="/images/message.svg"
                alt="댓글"
                width={40}
                height={40}
              />
            </button>
            <button className={styles["btn-label"]}>99+ 댓글</button>
            <button>
              <Image
                src="/images/share.svg"
                alt="공유하기"
                width={40}
                height={40}
              />
            </button>
            <button className={styles["mark-btn"]}>
              <Image
                src="/images/mark.svg"
                alt="스크랩"
                width={40}
                height={40}
              />
            </button>
          </section>
        </article>
      </main>
    </>
  );
}
