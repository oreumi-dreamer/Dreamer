"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import styles from "./page.module.css";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";

export default function Posts() {
  const { user } = useSelector((state) => state.auth); // 현재 로그인한 사용자의 토큰
  const { userId } = user; // 현재 로그인한 사용자 ID

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

  const handleDelete = async (postId) => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetchWithAuth(`/api/post/delete/${postId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "게시글 삭제 중 오류가 발생했습니다.");
      }

      // 삭제 성공 시 게시글 목록에서 해당 게시글 제거
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      alert("게시글이 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(error.message);
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
              {/* 작성자와 현재 사용자가 같을 때만 수정 버튼 표시 */}
              {userId === post.authorId && (
                <>
                  <Link
                    href={`/debug/posting/${post.id}`}
                    className={styles.editButton}
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className={styles.editButton}
                  >
                    삭제
                  </button>
                </>
              )}
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
                <span>댓글 {post.comments.length}</span>
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
