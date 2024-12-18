"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/profile/Profile.module.css";
import PostList from "./PostList";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import ProfileEdit from "./ProfileEdit";
import { useSelector } from "react-redux";
import ProfileInfo from "./ProfileInfo";
import { Button, ConfirmModal, Divider } from "../Controls";
import Loading from "../Loading";
import PostModal from "../modal/PostModal";
import WritePost from "../write/WritePost";

export default function Profile({ userName, write }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const mainRef = useRef(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = user?.exists ? true : false;

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
      setIsLoginModalOpen(true);
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
          isFollowing: data.isFollowing,
          isMyself: data.isMyself,
          birthDate: data.birthDate,
        });
      }

      setLoading(false);
    };

    getProfile();
  }, [userName]);

  const handleModalClose = () => {
    setSelectedPostId(null);
  };

  useEffect(() => {
    setIsShowModal(!!selectedPostId);
  }, [selectedPostId]);

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  useEffect(() => {
    if (write) {
      handleWriteBtnClick();
    }
  }, [write]);

  const [prevPage, setPrevPage] = useState("");
  const handleWriteBtnClick = () => {
    setPrevPage(window.location.pathname);
    setIsWriteModalOpen(true);
  };
  const closeWriteModal = () => {
    setIsWriteModalOpen(false);
    if (prevPage) {
      router.push(prevPage);
    } else {
      handleActiveBtn("홈");
    }
  };

  const loginModalOpen = () => {
    setIsLoginModalOpen(true);
  };

  const loginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  if (loading) {
    return (
      <main className={styles["profile-main"]}>
        <Loading />
      </main>
    );
  }

  if (!posts) {
    return (
      <main id="no-posts" className={`${styles["no-posts"]} no-posts`}>
        <p>
          <span>
            사용자를 찾을 수 없습니다 <img src="/images/invalid.svg" alt="" />
          </span>
        </p>
      </main>
    );
  }

  const Posts = ({ setSelectedPostId }) => {
    if (!posts.length && profile.isMyself) {
      return (
        <section className={styles["no-posts"]}>
          <p>당신의 꿈을 들려주세요!</p>
          <Button
            className={styles["write-post-btn"]}
            highlight={true}
            onClick={handleWriteBtnClick}
          >
            글 쓰러 가기
          </Button>
        </section>
      );
    } else if (!posts.length) {
      return (
        <section className={styles["no-posts"]}>
          <p>아직 {profile.name}님이 들려준 꿈이 없어요!</p>
        </section>
      );
    } else {
      return (
        <section className={styles["posts-container"]}>
          <h2 className="sr-only">게시물</h2>
          <PostList
            posts={posts}
            setPosts={setPosts}
            styles={styles}
            isLoggedIn={isLoggedIn}
            setSelectedPostId={setSelectedPostId}
            isMyself={profile.isMyself}
          />
        </section>
      );
    }
  };

  return (
    <>
      <main className={styles["profile-main"]} ref={mainRef}>
        <section className={styles["profile-container"]}>
          {isEdit ? (
            <ProfileEdit
              profile={profile}
              setIsEdit={setIsEdit}
              setProfile={setProfile}
              styles={styles}
            />
          ) : (
            <ProfileInfo
              profile={profile}
              toggleFollow={toggleFollow}
              setIsEdit={setIsEdit}
              styles={styles}
            />
          )}
        </section>
        <Divider />
        <Posts setSelectedPostId={setSelectedPostId} />
      </main>
      <PostModal
        postId={selectedPostId}
        isShow={isShowModal}
        onClose={handleModalClose}
      />
      {isWriteModalOpen && (
        <WritePost
          isWriteModalOpen={isWriteModalOpen}
          closeWriteModal={closeWriteModal}
        />
      )}
      {isLoginModalOpen && (
        <ConfirmModal
          message="로그인이 필요합니다. 로그인 하시겠습니까?"
          isOpen={loginModalOpen}
          closeModal={loginModalClose}
          onConfirm={() => router.push("/")}
        />
      )}
    </>
  );
}
