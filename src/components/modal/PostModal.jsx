import React, { useEffect, useState } from "react";
import styles from "./PostModal.module.css";
import Image from "next/image";
import Link from "next/link";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import postTime from "@/utils/postTime";
import { useSelector } from "react-redux";

export default function PostModal({
  postId = "sZfIASnHrW87XhoC34Id",
  profileImageUrl = "/images/rabbit.svg",
}) {
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [isStarTwinkle, setIsStarTwinkle] = useState(false);
  const [isScrap, setIsScrap] = useState(false);
  const [isOneiromancy, setOneiromancy] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [comment, setComment] = useState(undefined);
  const [postData, setPostData] = useState(null);
  const [commentData, setCommentData] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const viewPost = async () => {
      try {
        const response = await fetchWithAuth(`/api/post/search/${postId}`);
        const data = await response.json();
        setPostData(data.post);
        setIsModalOpen(true);
      } catch (error) {
        console.error("게시글을 불러올 수 없습니다.:", error);
      }
    };

    const viewComments = async () => {
      const response = await fetchWithAuth(`/api/comment/read/${postId}`);
      const data = await response.json();
      setCommentData(data.comments);
    };

    viewPost();
    viewComments();
  }, []);

  function handleModalClose() {
    if (comment) {
      const exitAnswer = confirm("댓글을 작성중입니다. 종료하시겠습니까?");
      if (!exitAnswer) return;
    }
    setIsModalOpen(false);
  }

  if (!isModalOpen) {
    return null;
  }

  function handleButtonClick(e) {
    const buttonName = e.currentTarget.className;
    if (buttonName === "star") {
      setIsStarTwinkle((prev) => !prev);
    } else if (buttonName === "scrap") {
      setIsScrap((prev) => !prev);
    }
  }

  function handleCheckboxClick(e) {
    const checkboxName = e.target.parentElement.innerText;
    const isCheckboxChecked = e.target.checked;
    if (checkboxName === "꿈해몽") {
      setOneiromancy(isCheckboxChecked);
    } else if (checkboxName === "비공개") {
      setIsPrivate(isCheckboxChecked);
    }
  }

  function handleCommentSubmit(e) {
    e.preventDefault();
  }

  function handleCommentClick(e) {
    if (e.currentTarget.querySelector("p").textContent.length >= 127) {
      e.currentTarget.classList.toggle(styles["comment-open"]);
    }
  }

  // 댓글 api 구현 시 수정 예정
  function CommentArticles() {
    if (!commentData) {
      return <p className={styles["no-comment"]}>댓글이 없습니다.</p>;
    }

    return commentData.map((comment) => {
      return (
        <article
          key={comment.commentId}
          className={`${styles["comment-article"]} ${comment.content.length >= 127 ? styles["text-long"] : ""}`}
          onClick={handleCommentClick}
        >
          <ul className={styles["comment-info"]}>
            <li>
              <Link href="/">
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
                <Image
                  src="/images/lock.svg"
                  width={10}
                  height={13}
                  alt="비공개 댓글"
                />
              </li>
            )}
          </ul>

          {postData.authorId !== comment.authorId && (
            <ul className={styles["edit-delete-button"]}>
              <li>
                <button>수정</button>
              </li>
              <li>
                <button>삭제</button>
              </li>
            </ul>
          )}

          {comment.isDreamInterpretation && (
            <Image
              src="/images/oneiromancy.svg"
              className={styles.oneiromancy}
              width={17}
              height={13}
              alt="꿈해몽 댓글"
            />
          )}

          <p>{comment.content}</p>
        </article>
      );
    });
  }

  return (
    <>
      <div className={styles.dimmed} onClick={handleModalClose}></div>
      <dialog className={styles["post-modal"]}>
        <Image
          className={styles.bookmark}
          src="/images/bookmark.svg"
          alt="책갈피"
          width={54}
          height={131}
        />
        <section className={styles["post-section"]}>
          <h2 className="sr-only">글 본문 내용 확인</h2>
          <section className={styles["post-info-section"]}>
            <h3 className="sr-only">작성자 정보 및 본문 관련 버튼 모음</h3>
            <Link className={styles.profile} href={`/${postData.authorId}`}>
              <Image
                src="/images/rabbit.svg"
                width={49}
                height={49}
                alt="토끼 프로필"
              />
              <p className={styles["profile-info"]}>
                {postData.authorName}
                <span>{`@${postData.authorId}`}</span>
                <time
                  dateTime={postData.createdAt.slice(0, -5)}
                  className={styles["uploaded-time"]}
                >
                  {postTime(postData.createdAt, postData.updatedAt)}
                </time>
              </p>
            </Link>
            <ul className={styles["button-list"]}>
              <li>
                <button onClick={handleButtonClick} className="star">
                  <Image
                    src={
                      isStarTwinkle
                        ? "/images/star-fill.svg"
                        : "/images/star.svg"
                    }
                    alt="좋아요반짝"
                    width={30}
                    height={30}
                  />
                </button>
                <span>
                  {postData.sparkCount} 명의 관심을 받고 있는 꿈이에요.
                </span>
              </li>
              <li>
                <button>
                  <Image
                    src="/images/share.svg"
                    alt="공유하기"
                    width={30}
                    height={30}
                  />
                </button>
              </li>
              <li>
                <button onClick={handleButtonClick} className="scrap">
                  <Image
                    src={isScrap ? "/images/mark-fill.svg" : "/images/mark.svg"}
                    alt="스크랩"
                    width={30}
                    height={30}
                  />
                </button>
              </li>
              <li>
                <button>
                  <Image
                    src="/images/more.svg"
                    alt="더보기"
                    width={30}
                    height={30}
                  />
                </button>
              </li>
            </ul>
          </section>
          <section className={styles["post-text"]}>
            <h3 className="sr-only">본문 내용</h3>
            <div className={styles["post-text-header"]}>
              {postData.dreamGenres.length > 0 && (
                <ul className={styles["post-tag"]}>
                  {postData.dreamGenres.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
              )}

              {postData.dreamMoods.length > 0 && (
                <span className={styles["dream-felt"]}>
                  {`${postData.dreamMoods.join(", ")}`}
                </span>
              )}

              <span className={styles["dream-score"]}>
                오늘의 꿈 별점:{" "}
                {`${"★".repeat(postData.dreamRating)}${"☆".repeat(5 - postData.dreamRating)}`}
              </span>
            </div>

            <strong>{postData.title}</strong>
            <p>{postData.content}</p>

            {postData.imageUrls.length > 0 &&
              postData.imageUrls.map((image, index) => (
                <Image
                  key={image}
                  src={image}
                  width={555}
                  height={330}
                  alt={`이미지${index}`}
                  unoptimized
                />
              ))}
          </section>
        </section>
        <section>
          <h2 className="sr-only">댓글 작성 및 확인</h2>
          <button className={styles["close-btn"]} onClick={handleModalClose}>
            <Image
              src="/images/close.svg"
              width={30}
              height={30}
              alt="닫기 버튼"
            />
          </button>

          <form
            action="#"
            className={styles["comment-form"]}
            onSubmit={handleCommentSubmit}
          >
            <label htmlFor="comment" className="sr-only">
              댓글 입력
            </label>
            <textarea
              className={styles["comment-input"]}
              id="comment"
              maxLength={1000}
              rows={4}
              cols={103}
              placeholder="댓글입력(최대 1000자)"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <ul className={styles["comment-setting"]}>
              <li>
                <input
                  type="checkbox"
                  id="oneiromancy"
                  className={styles["checkbox-hide"]}
                  onChange={handleCheckboxClick}
                />
                <label htmlFor="oneiromancy" className={styles["checkbox"]}>
                  꿈해몽
                </label>
              </li>

              <li>
                <input
                  type="checkbox"
                  id="private"
                  className={styles["checkbox-hide"]}
                  onChange={handleCheckboxClick}
                />
                <label htmlFor="private" className={styles["checkbox"]}>
                  비공개
                </label>
              </li>

              <li>
                <button type="submit">
                  <Image
                    src="/images/send.svg"
                    width={30}
                    height={30}
                    alt="댓글 입력 버튼"
                  />
                </button>
              </li>
            </ul>
          </form>

          <section className={styles["comment-articles-section"]}>
            <h3 className="sr-only">댓글 모음 확인</h3>
            <CommentArticles />
          </section>
        </section>
      </dialog>
    </>
  );
}
