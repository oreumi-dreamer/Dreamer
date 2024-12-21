import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import useTheme from "@/hooks/styling/useTheme";
import { outsideClickModalClose } from "@/utils/outsideClickModalClose";
import WritePost from "../write/WritePost";
import ReportModal from "../report/Report";
import PostCard from "./PostCard";

const PostList = React.memo(function PostList({
  posts,
  setPosts,
  styles,
  isLoggedIn,
  setSelectedPostId,
  isMyself,
}) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalStyle, setModalStyle] = useState({});
  const [activePostId, setActivePostId] = useState(null);

  const modalRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (modalRef.current && buttonRef.current) {
      const cleanup = outsideClickModalClose(modalRef, buttonRef, () => {
        setIsOpen(false);
      });
      return () => {
        cleanup();
      };
    }
  }, [modalRef, buttonRef, isOpen]);

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [modifyPostId, setModifyPostId] = useState(null);
  const closeWriteModal = () => {
    setIsWriteModalOpen(false);
  };

  const modifyHandler = (postId) => {
    setModifyPostId(postId);
    setIsWriteModalOpen(true);
  };

  const togglePostPrivacy = async (postId, postIsPrivate) => {
    setIsOpen(false);
    try {
      const newPrivacyState = !postIsPrivate;

      setPosts((currentPosts) => ({
        ...currentPosts,
        posts: currentPosts.posts.map((post) =>
          post.id === postId ? { ...post, isPrivate: newPrivacyState } : post
        ),
      }));

      const response = await fetchWithAuth(`/api/post/private/${postId}`, {
        method: "GET",
      });

      const responseData = await response.json();

      if (responseData.success) {
        return responseData.isPrivate;
      } else {
        alert(`오류: ${responseData.error}`);
      }
    } catch (error) {
      console.error("비밀글 토글 중 오류 발생:", error);
    }
  };

  const handleSparkUpdate = useCallback((postId) => {
    setPosts((currentPosts) => ({
      ...currentPosts,
      posts: currentPosts.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              sparkCount: post.sparkCount + (post.hasUserSparked ? -1 : 1),
              hasUserSparked: !post.hasUserSparked,
            }
          : post
      ),
    }));
  }, []);

  const changeSpark = (postId) => {
    setPosts((currentPosts) => ({
      ...currentPosts,
      posts: currentPosts.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              sparkCount: post.sparkCount + (post.hasUserSparked ? -1 : 1),
              hasUserSparked: post.hasUserSparked ? false : true,
            }
          : post
      ),
    }));
  };

  let tomongStampUrl = "/images/tomong-stamp.png";

  if (
    theme === "dark" ||
    (theme === "device" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    tomongStampUrl = "/images/tomong-stamp-dark.png";
  }

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportId, setReportId] = useState(null);

  const handleReport = async (postId) => {
    setReportId(postId);
    setIsReportModalOpen(true);
  };

  /* PostCard 컴포넌트에 전달할 props */

  const modalProps = {
    isOpen,
    modalType,
    activePostId,
    modalRef,
    buttonRef,
    modalStyle,
  };

  const handlePostAction = useCallback((actionType, postId, ...args) => {
    switch (actionType) {
      case "modify":
        modifyHandler(postId);
        break;
      case "togglePrivacy":
        togglePostPrivacy(postId, args[0]);
        break;
      case "report":
        handleReport(postId);
        break;
    }
  }, []);

  const handleMoreClick = useCallback(
    (postId) => {
      const type = isMyself ? "isMyPost" : "isNotMyPost";

      if (!isOpen || activePostId !== postId) {
        setModalType(type);
        setIsOpen(true);
        setActivePostId(postId);
        setModalStyle({
          position: "absolute",
          bottom: "20px",
          right: "0px",
          zIndex: "1000",
        });
      } else {
        setModalType(null);
        setIsOpen(false);
        setActivePostId(null);
      }
    },
    [isMyself, isOpen, activePostId]
  );

  const handlePostSelect = useCallback((postId) => {
    setSelectedPostId(postId);
  }, []);

  return (
    <>
      {posts.posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isLoggedIn={isLoggedIn}
          styles={styles}
          tomongStampUrl={tomongStampUrl}
          onSparkUpdate={handleSparkUpdate}
          setPosts={setPosts}
          modalProps={modalProps}
          onPostAction={handlePostAction}
          onMoreClick={handleMoreClick}
          onPostSelect={handlePostSelect}
        />
      ))}
      {isWriteModalOpen && (
        <WritePost
          key={`${modifyPostId}-modify`}
          isWriteModalOpen={isWriteModalOpen}
          closeWriteModal={closeWriteModal}
          modifyId={modifyPostId}
        />
      )}
      {isReportModalOpen && (
        <ReportModal
          key={`${reportId}-report`}
          isOpen={isReportModalOpen}
          closeModal={() => setIsReportModalOpen(false)}
          postId={reportId}
        />
      )}
    </>
  );
});

export default PostList;
