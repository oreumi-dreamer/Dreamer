import React, { useEffect, useState } from "react";
import styles from "./CommentArticles.module.css";
import Link from "next/link";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import postTime from "@/utils/postTime";
import Loading from "../Loading";

export default function CommentArticles({ postId, user, isCommentSubmitting }) {
  const [commentData, setCommentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const viewComments = async () => {
      try {
        const response = await fetchWithAuth(`/api/comment/read/${postId}`);
        const data = await response.json();
        setCommentData(data.comments);
        setIsLoading(false);
      } catch (error) {
        console.error("댓글을 불러올 수 없습니다. :", error);
      }
    };

    viewComments();
  }, [postId, isCommentSubmitting]);

  function handleCommentClick(e) {
    const commentContent = e.currentTarget.querySelector("p").textContent;
    if (commentContent.length >= 127 || commentContent.split("\n").length > 2) {
      e.currentTarget.classList.toggle(styles["comment-open"]);
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      const commentDeleteRes = await fetchWithAuth(
        `/api/comment/delete/${postId}`,
        {
          method: "DELETE",
          body: JSON.stringify({ commentId: commentId }),
        }
      );
      if (commentDeleteRes.ok) {
        setCommentData((prev) =>
          prev.filter((comment) => comment.commentId !== commentId)
        );
      }
    } catch (error) {
      console.error("댓글 삭제 오류 :", error);
    }
  }

  if (isLoading) {
    return <Loading type="small" />;
  }
  if (!commentData) {
    return (
      <>
        <p className={styles["no-comment"]}>댓글이 없습니다.</p>
      </>
    );
  }
  return [...commentData].reverse().map((comment) => {
    return (
      <article
        key={comment.commentId}
        className={`${styles["comment-article"]} ${comment.content.length >= 127 || comment.content.split("\n").length > 2 ? styles["text-long"] : ""}`}
        onClick={handleCommentClick}
      >
        <ul className={styles["comment-info"]}>
          <li>
            <Link href={`/${comment.authorId}`}>
              <span>{comment.authorName}</span> {`@${comment.authorId}`}
            </Link>
          </li>
          <li>
            <time>
              {postTime(
                new Date(comment.createdAt.seconds * 1000),
                new Date(comment.createdAt.seconds * 1000)
              )}
            </time>
          </li>
          {comment.isPrivate && (
            <li>
              <img
                src="/images/lock.svg"
                width={10}
                height={13}
                alt="비공개 댓글"
              />
            </li>
          )}
        </ul>
        {user?.userId === comment.authorId && (
          <ul className={styles["edit-delete-button"]}>
            <li>
              <button>수정</button>
            </li>
            <li>
              <button onClick={() => handleDeleteComment(comment.commentId)}>
                삭제
              </button>
            </li>
          </ul>
        )}
        {comment.isDreamInterpretation && (
          <img
            src="/images/oneiromancy.svg"
            className={styles.oneiromancy}
            width={17}
            height={13}
            alt="꿈해몽 댓글"
          />
        )}
        <p>
          {!comment.isPrivate
            ? comment.content
            : comment.authorId === user.userId
              ? comment.content
              : "비공개 댓글입니다 :)"}
        </p>
      </article>
    );
  });
}
