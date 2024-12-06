"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/profile/Profile.module.css";
import PostList from "./PostList";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";

export default function Profile({ userName }) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  const changeFollow = () => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      isFollowing: !currentProfile.isFollowing,
      followersCount: currentProfile.isFollowing
        ? currentProfile.followersCount - 1
        : currentProfile.followersCount + 1,
    }));
  };

  const toggleFollow = async () => {
    if (!isLoggedIn) {
      router.push("/"); // 로그인 페이지로 이동
      return;
    }

    changeFollow();

    try {
      const res = await fetchWithAuth(`/api/account/follow/${profile.id}`);
      if (!res.ok || res.status !== 200) {
        throw new Error("팔로우 실패");
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      changeFollow();
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      const res = await fetchWithAuth(
        `/api/post/read/${userName}?summary=true`
      );

      let data = null;
      if (res.ok) {
        data = await res.json();
        setPosts(data);
        setProfile({
          name: data.userName,
          id: data.userId,
          bio: data.bio,
          length: data.length,
          profileImageUrl: data.profileImageUrl,
          followersCount: data.followersCount,
          followingCount: data.followingCount,
          isMyself: data.isMyself,
        });
      }

      setLoading(false);
    };

    getProfile();
  }, [userName]);

  if (loading) {
    return <div>로드 중...</div>;
  }

  if (!posts) {
    return <div>사용자를 찾을 수 없습니다.</div>;
  }

  return (
    <>
      <main className={styles["profile-main"]}>
        <section className={styles["profile-container"]}>
          <article className={styles["profile-wrap"]}>
            <h2 className="sr-only">프로필</h2>
            <img
              src={
                profile.profileImageUrl
                  ? profile.profileImageUrl
                  : "/images/rabbit.svg"
              }
              className={styles["profile-image"]}
              width={160}
              height={160}
              alt={profile.name + "님의 프로필 이미지"}
            />
            <div className={styles["profile-info"]}>
              <div className={styles["profile-name-wrap"]}>
                <div className={styles["profile-name-id"]}>
                  <div className={styles["profile-name"]}>{profile.name}</div>
                  <div className={styles["profile-id"]}>@{profile.id}</div>
                </div>
                {profile.isMyself ? (
                  <button className={`${styles["profile-btn"]}`}>
                    프로필 수정
                  </button>
                ) : profile.isFollowing ? (
                  <button
                    onClick={toggleFollow}
                    className={`${styles["profile-btn"]} ${styles.active}`}
                  >
                    팔로잉
                  </button>
                ) : (
                  <button
                    onClick={toggleFollow}
                    className={`${styles["profile-btn"]}`}
                  >
                    팔로우
                  </button>
                )}
              </div>
              <dl className={styles["profile-stat"]}>
                <dt>게시물</dt>
                <dd>{profile.length}개</dd>
                <dt>팔로우</dt>
                <dd>{profile.followersCount}명</dd>
                <dt>팔로워</dt>
                <dd>{profile.followingCount}명</dd>
              </dl>
              <div className={styles["profile-bio"]}>{profile.bio}</div>
            </div>
          </article>
        </section>
        <section className={styles["posts-container"]}>
          <h2 className="sr-only">게시물</h2>
          <PostList
            posts={posts.posts}
            styles={styles}
            isLoggedIn={isLoggedIn}
          />
        </section>
      </main>
    </>
  );
}
