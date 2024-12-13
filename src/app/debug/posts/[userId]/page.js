// app/profile/[userId]/page.js
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CommentsDebug from "@/components/debug/Comments";
import styles from "./page.module.css";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";

export default function UserProfile({ params }) {
  // URL 파라미터에서 userId 추출
  const { userId } = params;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingSparkId, setLoadingSparkId] = useState(null); // 반짝 로딩 상태 관리

  const loadPosts = async (isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        limit: "10",
        ...(nextCursor && isLoadMore ? { cursor: nextCursor } : {}),
      });

      // API를 호출하여 게시글 목록을 불러옴
      const response = await fetchWithAuth(
        `/api/post/read/${userId}?${queryParams}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "게시글을 불러오는데 실패했습니다.");
      }

      setPosts((prev) => (isLoadMore ? [...prev, ...data.posts] : data.posts));
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [userId]);

  // 반짝 토글 핸들러 추가
  const handleSparkToggle = async (postId) => {
    try {
      setLoadingSparkId(postId); // 로딩 시작
      const response = await fetchWithAuth(`/api/post/spark/${postId}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "반짝 토글에 실패했습니다.");
      }

      const data = await response.json();

      // posts 상태 업데이트
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              hasUserSparked: data.hasSparked,
              sparkCount: data.sparkCount,
            };
          }
          return post;
        })
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSparkId(null); // 로딩 완료
    }
  };

  const renderStars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <main className={styles.container}>
      <header className={styles.profileHeader}>
        <h1>{posts[0]?.authorName || userId}님의 게시글</h1>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.posts}>
        {posts.map((post) => (
          <article key={post.id} className={styles.post}>
            <div className={styles.postHeader}>
              <span className={styles.date}>
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              {post.isPrivate && <span className={styles.private}>비공개</span>}
            </div>

            <div className={styles.title}>{post.title}</div>
            <div className={styles.content}>{post.content}</div>

            {post.imageUrls?.length > 0 && (
              <div className={styles.images}>
                {post.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`게시글 이미지 ${index + 1}`}
                    className={styles.image}
                  />
                ))}
              </div>
            )}

            <div className={styles.metadata}>
              <div className={styles.rating}>
                {renderStars(post.dreamRating)}
              </div>

              <div className={styles.tags}>
                {post.dreamGenres?.map((genre) => (
                  <span key={genre} className={styles.genre}>
                    {genre}
                  </span>
                ))}
                {post.dreamMoods?.map((mood) => (
                  <span key={mood} className={styles.mood}>
                    {mood}
                  </span>
                ))}
              </div>

              <div className={styles.interactions}>
                <button
                  onClick={() => handleSparkToggle(post.id)}
                  disabled={loadingSparkId === post.id}
                  className={`${styles.sparkButton} ${post.hasUserSparked ? styles.sparked : ""}`}
                >
                  {loadingSparkId === post.id
                    ? "..."
                    : `반짝 ${post.sparkCount}`}
                </button>
                <span>댓글 {post.commentsCount}</span>
              </div>
            </div>
            <CommentsDebug postId={post.id} />
          </article>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => loadPosts(true)}
          disabled={loading}
          className={styles.loadMore}
        >
          {loading ? "로딩 중..." : "더 보기"}
        </button>
      )}
    </main>
  );
}
