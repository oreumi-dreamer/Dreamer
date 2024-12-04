"use client";

import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import { useEffect, useState } from "react";
import styles from "./Comments.module.css";

export default function CommentsDebug({ postId, idToken }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await fetchWithAuth(`/api/comment/read/${postId}`);

      if (!response.ok) {
        throw new Error("댓글을 불러오는 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      setComments(data.comments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId, idToken]);

  const handleDelete = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetchWithAuth(`/api/comment/delete/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: commentId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "댓글 삭제 중 오류가 발생했습니다.");
      }

      // 삭제 성공 후 댓글 목록 다시 불러오기
      await fetchComments();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러가 발생했습니다: {error}</div>;
  }

  const formatDate = (timestamp) => {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className={styles.commentsContainer}>
      <h2>댓글 목록</h2>
      {comments.length === 0 ? (
        <p>댓글이 없습니다.</p>
      ) : (
        <ul className={styles.commentList}>
          {comments.map((comment) => (
            <li key={comment.commentId} className={styles.commentItem}>
              <p>{comment.content}</p>
              <small>작성자: {comment.authorName}</small>
              <br />
              <small>작성일자: {formatDate(comment.createdAt)}</small>
              {comment.isPrivate && <span> (비밀 글)</span>}
              {comment.isModifiable && (
                <button
                  className={styles.delButton}
                  onClick={() => handleDelete(comment.commentId)}
                >
                  삭제
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
