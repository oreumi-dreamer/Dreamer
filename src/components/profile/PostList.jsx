import { useEffect, useState, useRef } from "react";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import useTheme from "@/hooks/styling/useTheme";
import { MyPost, OtherPost } from "../dropDown/DropDown";
import { outsideClickModalClose } from "@/utils/outsideClickModalClose";

export default function PostList({
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
  const postIsPrivate = posts.isPrivate;
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

  function handlePostMoreBtnClick(postId) {
    const modalType = isMyself ? "isMyPost" : "isNotMyPost";

    if (!isOpen) {
      setModalType(modalType);
      setIsOpen(true);
      setActivePostId(postId);

      if (buttonRef.current) {
        const position = {
          position: "absolute",
          bottom: "20px",
          right: "0px",
          zIndex: "1000",
        };
        setModalStyle(position);
      }
    } else {
      setModalType(null);
      setIsOpen(false);
      setActivePostId(null);
    }
  }

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

  const sparkHandle = async (postId) => {
    if (!isLoggedIn) return;
    changeSpark(postId); // 반짝 토글 시 UI 변경

    try {
      const res = await fetchWithAuth(`/api/post/spark/${postId}`);
      if (!res.ok || res.status !== 200) {
        throw new Error("반짝 실패");
      }
    } catch (error) {
      console.error("Error sparking post:", error);
      changeSpark(postId); // 반짝 실패 시 원래 상태로 복구
    }
  };

  let tomongStampUrl = "/images/tomong-stamp.png";

  if (
    theme === "dark" ||
    (theme === "device" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    tomongStampUrl = "/images/tomong-stamp-dark.png";
  }

  return (
    <>
      {posts.posts.map((post) => (
        <article
          className={styles["post-wrap"]}
          key={post.id}
          onClick={(e) => {
            const target = e.target.textContent;
            if (
              target !== "수정하기" &&
              target !== "삭제하기" &&
              target !== "공개글로 변경하기" &&
              target !== "비밀글로 변경하기" &&
              target !== "신고하기"
            ) {
              setSelectedPostId(post.id);
            }
          }}
        >
          {post.isTomong && (
            <img
              src={tomongStampUrl}
              className={styles["tomong-stamp"]}
              alt="해몽이 존재함"
            />
          )}
          <h3 className={`${styles["post-title"]}`}>
            {post.isPrivate && (
              <img
                src="/images/lock.svg"
                alt="비밀글"
                className={styles["private-post"]}
              />
            )}
            {post.title}
            {post.hasImages && (
              <img
                src="/images/image.svg"
                alt="이미지"
                className={styles["include-img"]}
              />
            )}
          </h3>
          <p className={styles["post-text"]}>{post.content}</p>
          <div className={styles["post-btn-container"]}>
            <button
              onClick={(e) => {
                e.stopPropagation(); // article 클릭 이벤트 방지
                sparkHandle(post.id);
              }}
            >
              <img
                src={
                  post.hasUserSparked
                    ? "/images/star-fill.svg"
                    : "/images/star.svg"
                }
                alt={post.hasUserSparked ? "반짝 취소" : "반짝"}
              />
              <span>{post.sparkCount}</span>
            </button>
            <button onClick={() => setSelectedPostId(post.id)}>
              <img src="/images/message.svg" alt="댓글" />
              <span>{post.commentsCount}</span>
            </button>
            {isOpen && modalType === "isMyPost" && activePostId === post.id && (
              <MyPost
                ref={modalRef}
                style={modalStyle}
                className={styles["more-modal"]}
                postId={post.id}
                postIsPrivate={post.isPrivate}
                togglePostPrivacy={() =>
                  togglePostPrivacy(post.id, post.isPrivate)
                }
              />
            )}
            {isOpen &&
              modalType === "isNotMyPost" &&
              activePostId === post.id && (
                <OtherPost
                  ref={modalRef}
                  style={modalStyle}
                  className={styles["more-modal"]}
                />
              )}
            <button>
              <img
                src="/images/more.svg"
                alt="더보기"
                ref={buttonRef}
                onClick={(e) => {
                  e.stopPropagation(); // article 클릭 이벤트 방지
                  handlePostMoreBtnClick(post.id);
                }}
              />
            </button>
          </div>
        </article>
      ))}
    </>
  );
}
