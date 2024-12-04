import React from "react";
import styles from "@/components/profile/Profile.module.css";

export default function Profile() {
  return (
    <>
      <main className={styles["profile-main"]}>
        <section className={styles["profile-container"]}>
          <article className={styles["profile-wrap"]}>
            <h2 className="sr-only">프로필</h2>
            <div className={styles["profile-img"]}></div>
            <div className={styles["profile-name-wrap"]}>
              <div className={styles["profile-name"]}>DREAMER</div>
              <span className={styles["profile-id"]}>@DREAMER</span>
            </div>
            <button className={styles["follow-btn"]}>팔로우</button>
            <dl className={styles["profile-info"]}>
              <dt>게시물</dt>
              <dd>9개</dd>
              <dt>팔로우</dt>
              <dd>0명</dd>
              <dt>팔로워</dt>
              <dd>999명</dd>
            </dl>
            <div className={styles["profile-bio"]}>
              안녕하세요 지니입니당~ ✌️😎
            </div>
          </article>
        </section>
        <section className={styles["posts-container"]}>
          <h2 className="sr-only">게시물</h2>
          <article className="post-wrap">
            <h3 className={`${styles["post-title"]} ${styles["include-img"]}`}>
              당장 만나~🎵
            </h3>
            <div className={styles["post-text"]}>
              나는 오늘 꿈에서 친구를 만났다. 친구와 놀이터에 가서 놀았다. 놀고
              있는데 외계인이 침공했다. 너무 무서웠다. 국가는 외계인 침공에
              대항해야 할 것이다. 국가는 무엇을 하는가 우리의 세금은 잔뜩
              가져가면서 침공에 대한 방안에는 무엇이 있는가 내일까지
              작성해오세요.
            </div>
            <dl className={styles["post-btn-container"]}>
              <dt>
                <button>
                  <img src="/images/star.svg" alt="반짝" />
                </button>
              </dt>
              <dd>99+</dd>
              <dt>
                <button>
                  <img src="/images/message.svg" alt="댓글" />
                </button>
              </dt>
              <dd>99+</dd>
            </dl>
            <dt>
            <button>
                  <img src="/images/more.svg" alt="댓글" />
                </button>
            </dt>
          </article>
        </section>
      </main>
    </>
  );
}
