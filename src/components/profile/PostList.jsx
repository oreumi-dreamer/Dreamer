import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import useTheme from "@/hooks/styling/useTheme";

export default function PostList({
  posts: initialPosts,
  styles,
  isLoggedIn,
  setSelectedPostId,
}) {
  const [posts, setPosts] = useState(initialPosts);
  const { theme } = useTheme();

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
      {posts.map((post) => (
        <article
          className={styles["post-wrap"]}
          key={post.id}
          onClick={() => setSelectedPostId(post.id)}
        >
          {post.isTomong && (
            <img
              src={tomongStampUrl}
              className={styles["tomong-stamp"]}
              alt="해몽이 존재함"
            />
          )}
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
            <button>
              <img src="/images/more.svg" alt="더보기" />
            </button>
          </div>
        </article>
      ))}
    </>
  );
}
