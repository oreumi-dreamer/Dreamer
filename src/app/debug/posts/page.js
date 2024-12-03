"use client";

import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";
import styles from "./page.module.css";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const POSTS_PER_PAGE = 10;

  // 초기 포스트 로딩
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (isLoadMore = false) => {
    try {
      setLoading(true);
      const db = getFirestore();

      let postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(POSTS_PER_PAGE)
      );

      if (isLoadMore && lastVisible) {
        postsQuery = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(POSTS_PER_PAGE)
        );
      }

      const querySnapshot = await getDocs(postsQuery);

      // 더 불러올 데이터가 있는지 확인
      if (querySnapshot.docs.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }

      // 마지막으로 불러온 문서 저장
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      const newPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleString(), // Timestamp를 날짜 문자열로 변환
      }));

      if (isLoadMore) {
        setPosts((prev) => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      alert("포스트를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 별점을 별 이모지로 변환하는 함수
  const renderStars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <main className={styles.container}>
      <h1>게시글 목록</h1>

      <div className={styles.posts}>
        {posts.map((post) => (
          <article key={post.id} className={styles.post}>
            <div className={styles.postHeader}>
              <span className={styles.author}>{post.authorName}</span>
              <span className={styles.date}>{post.createdAt}</span>
              {post.isPrivate && <span className={styles.private}>비공개</span>}
            </div>

            <div className={styles.content}>{post.title}</div>
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
                <span>반짝 {post.sparkCount}</span>
                <span>댓글 {post.commentCount}</span>
              </div>
            </div>
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
