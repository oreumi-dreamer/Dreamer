"use client";

import React, { useState, useEffect } from "react";
import styles from "@/components/profile/Profile.module.css";
import PostList from "./PostList";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";

export default function Profile({ userName }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const res = await fetchWithAuth(
        `/api/post/read/${userName}?summary=true`
      );

      let data = null;
      if (res.ok) {
        data = await res.json();
      }

      setProfile(data);
    };

    getProfile();

    setLoading(false);
  }, [userName]);

  if (!profile) {
    return <div>사용자를 찾을 수 없습니다.</div>;
  }

  if (loading) {
    return <div>로드 중...</div>;
  }

  return (
    <>
      <main className={styles["profile-main"]}>
        <section className={styles["profile-container"]}>
          <article className={styles["profile-wrap"]}>
            <h2 className="sr-only">프로필</h2>
            <img src="/images/rabbit.svg" alt="프로필 이미지" />
            <div className={styles["profile-info"]}>
              <div className={styles["profile-name-wrap"]}>
                <div className={styles["profile-name-id"]}>
                  <div className={styles["profile-name"]}>JINI</div>
                  <div className={styles["profile-id"]}>@jini</div>
                </div>
                <button className={`${styles["profile-btn"]} ${styles.active}`}>
                  팔로잉
                </button>
              </div>
              <dl className={styles["profile-stat"]}>
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
            </div>
          </article>
        </section>
        <section className={styles["posts-container"]}>
          <h2 className="sr-only">게시물</h2>
          <PostList posts={profile.posts} styles={styles} />
        </section>
      </main>
    </>
  );
}
