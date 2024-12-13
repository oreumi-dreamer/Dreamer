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
  const { user } = useSelector((state) => state.auth);
  const { userId } = user;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [submittingComments, setSubmittingComments] = useState({});

  const POSTS_PER_PAGE = 10;

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

      if (querySnapshot.docs.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      const newPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleString(),
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

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      alert("게시글이 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(error.message);
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentInputs[postId]?.content?.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      setSubmittingComments((prev) => ({ ...prev, [postId]: true }));

      const formData = new FormData();
      formData.append("content", commentInputs[postId].content);
      formData.append("isPrivate", commentInputs[postId]?.isPrivate || false);
      formData.append(
        "isDreamInterpretation",
        commentInputs[postId]?.isDreamInterpretation || false
      );

      const response = await fetchWithAuth(`/api/comment/create/${postId}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "댓글 작성 중 오류가 발생했습니다.");
      }

      // API 응답이 성공이면 해당 게시글의 comments 배열 업데이트
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [
                ...post.comments,
                {
                  authorName: user.userName,
                  content: commentInputs[postId].content,
                  createdAt: new Date(), // 현재 시간으로 표시
                  isPrivate: commentInputs[postId]?.isPrivate || false,
                  isDreamInterpretation:
                    commentInputs[postId]?.isDreamInterpretation || false,
                },
              ],
            };
          }
          return post;
        })
      );

      setCommentInputs((prev) => ({
        ...prev,
        [postId]: {
          content: "",
          isPrivate: false,
          isDreamInterpretation: false,
        },
      }));
      alert("댓글이 작성되었습니다.");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert(error.message);
    } finally {
      setSubmittingComments((prev) => ({ ...prev, [postId]: false }));
    }
  };

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
                <span>댓글 {post.comments?.length || 0}</span>
              </div>
            </div>

            {/* 댓글 목록 */}
            <div className={styles.comments}>
              {post.comments?.map((comment, index) => (
                <div key={index} className={styles.comment}>
                  <span className={styles.commentAuthor}>
                    {comment.authorName}
                  </span>
                  <span className={styles.commentDate}>
                    {comment.createdAt?.toDate?.().toLocaleString() || ""}
                  </span>
                  <p className={styles.commentContent}>{comment.content}</p>
                  {comment.isDreamInterpretation && (
                    <span className={styles.interpretation}>해몽</span>
                  )}
                </div>
              ))}
            </div>

            {/* 댓글 작성 폼 */}
            <div className={styles.commentForm}>
              <textarea
                value={commentInputs[post.id]?.content || ""}
                onChange={(e) =>
                  setCommentInputs((prev) => ({
                    ...prev,
                    [post.id]: {
                      ...prev[post.id],
                      content: e.target.value,
                    },
                  }))
                }
                placeholder="댓글을 작성해주세요"
                className={styles.commentInput}
                disabled={submittingComments[post.id]}
              />
              <div className={styles.commentOptions}>
                <label>
                  <input
                    type="checkbox"
                    checked={commentInputs[post.id]?.isPrivate || false}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: {
                          ...prev[post.id],
                          isPrivate: e.target.checked,
                        },
                      }))
                    }
                  />
                  비공개
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={
                      commentInputs[post.id]?.isDreamInterpretation || false
                    }
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: {
                          ...prev[post.id],
                          isDreamInterpretation: e.target.checked,
                        },
                      }))
                    }
                  />
                  꿈 해몽
                </label>
              </div>
              <button
                onClick={() => handleCommentSubmit(post.id)}
                disabled={submittingComments[post.id]}
                className={styles.commentSubmit}
              >
                {submittingComments[post.id] ? "작성 중..." : "댓글 작성"}
              </button>
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
