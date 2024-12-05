import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";

export default function PostList({ posts: initialPosts, styles }) {
  const [posts, setPosts] = useState(initialPosts);

  const sparkHandle = async (postId) => {
    const res = await fetchWithAuth(`/api/post/spark/${postId}`);
    const result = await res.json();

    if (res.ok && result.success) {
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId ? { ...post, sparkCount: result.sparkCount } : post
        )
      );
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
                <img src="/images/star.svg" alt="반짝" />
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
