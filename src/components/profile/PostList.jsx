import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";

export default function PostList({ posts: initialPosts, styles }) {
  const [posts, setPosts] = useState(initialPosts);

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
        <article className={styles["post-wrap"]} key={post.id}>
          {post.hasImages ? (
            <h3 className={`${styles["post-title"]} ${styles["include-img"]}`}>
              {post.title}
            </h3>
          ) : (
            <h3 className={`${styles["post-title"]}`}>{post.title}</h3>
          )}
          <div className={styles["post-text"]}>{post.content}</div>
          <dl className={styles["post-btn-container"]}>
            <dt>
              <button onClick={() => sparkHandle(post.id)}>
                {post.hasUserSparked ? (
                  <img src="/images/star-fill.svg" alt="반짝 눌림" />
                ) : (
                  <img src="/images/star.svg" alt="반짝" />
                )}
              </button>
            </dt>
            <dd>{post.sparkCount}</dd>
            <dt>
              <button>
                <img src="/images/message.svg" alt="댓글" />
              </button>
            </dt>
            <dd>{post.commentsCount}</dd>
            <dt>
              <button>
                <img src="/images/more.svg" alt="더보기" />
              </button>
            </dt>
          </dl>
        </article>
      ))}
    </>
  );
}
