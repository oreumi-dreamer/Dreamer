import { useEffect, useState, useRef } from "react";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import { MyPost, OtherPost } from "../dropDown/DropDown";
import { outsideClickModalClose } from "@/utils/outsideClickModalClose";

export default function PostList({
  posts: initialPosts,
  styles,
  isLoggedIn,
  setSelectedPostId,
  isMyself,
}) {
  const [posts, setPosts] = useState(initialPosts);
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
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              sparkCount: post.sparkCount + (post.hasUserSparked ? -1 : 1),
              hasUserSparked: post.hasUserSparked ? false : true,
            }
          : post
      )
    );
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

  return (
    <>
      {posts.map((post) => (
        <article
          className={styles["post-wrap"]}
          key={post.id}
          onClick={(e) => {
            const target = e.target.textContent;
            if (
              target !== "수정하기" &&
              target !== "삭제하기" &&
              target !== "비밀글로 변경하기" &&
              target !== "신고하기"
            ) {
              setSelectedPostId(post.id);
            }
          }}
        >
          {post.hasImages ? (
            <h3 className={`${styles["post-title"]} ${styles["include-img"]}`}>
              {post.title}
            </h3>
          ) : (
            <h3 className={`${styles["post-title"]}`}>{post.title}</h3>
          )}
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
