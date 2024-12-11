import React, { useEffect, useState } from "react";
import styles from "./PostModal.module.css";
import Link from "next/link";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import postTime from "@/utils/postTime";
import CommentArticles from "./CommentArticles";
import { DREAM_GENRES, DREAM_MOODS } from "@/utils/constants";

export default function PostModal({ postId = "sZfIASnHrW87XhoC34Id" }) {
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [isScrap, setIsScrap] = useState(false);
  const [comment, setComment] = useState(undefined);
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    const viewPost = async () => {
      try {
        const response = await fetchWithAuth(`/api/post/search/${postId}`);
        const data = await response.json();
        const starRes = await fetchWithAuth(`/api/post/spark/${postId}`);
        const starData = await starRes.json();
        setPostData({
          ...data.post,
          hasSparked: starData.hasSparked,
        });

        setIsModalOpen(true);
      } catch (error) {
        console.error("게시글을 불러올 수 없습니다.:", error);
      }
    };
    viewPost();
  }, [postId]);

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

  function handleCommentSubmit(e) {
    e.preventDefault();
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

  async function handleStarButtonClick(e) {
    if (e.currentTarget.className === "star") {
      try {
        const starRes2 = await fetchWithAuth(`/api/post/spark/${postId}`);
        setPostData((prev) => ({
          ...prev,
          hasSparked: !prev.hasSparked,
          sparkCount: prev.hasSparked
            ? prev.sparkCount - 1
            : prev.sparkCount + 1,
        }));
      } catch (error) {
        console.error("반짝을 실행하지 못했어요 :", error);
      }
    }
  }

  function handleScrapButtonClick(e) {
    if (e.currentTarget.className === "scrap") {
      setIsScrap((prev) => !prev);
    }
  }

  return (
    <>
      <div className={styles.dimmed} onClick={handleModalClose}></div>
      <dialog className={styles["post-modal"]}>
        <img
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
              <img
                src={`/api/account/avatar/${postData.authorId}`}
                width={49}
                height={49}
                alt="프로필 사진"
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
                <button onClick={handleStarButtonClick} className="star">
                  <img
                    src={
                      postData.hasSparked
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
                  <img
                    src="/images/share.svg"
                    alt="공유하기"
                    width={30}
                    height={30}
                  />
                </button>
              </li>
              <li>
                <button onClick={handleScrapButtonClick} className="scrap">
                  <img
                    src={isScrap ? "/images/mark-fill.svg" : "/images/mark.svg"}
                    alt="스크랩"
                    width={30}
                    height={30}
                  />
                </button>
              </li>
              <li>
                <button>
                  <img
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
                    <li
                      key={index}
                      style={{
                        backgroundColor: `${DREAM_GENRES.find((genre) => genre.id === tag).color.hex}`,
                        color:
                          `${DREAM_GENRES.find((genre) => genre.id === tag).color.textColor}` &&
                          `${DREAM_GENRES.find((genre) => genre.id === tag).color.textColor}`,
                      }}
                    >
                      {`${DREAM_GENRES.find((genre) => genre.id === tag).text}`}
                    </li>
                  ))}
                </ul>
              )}

              {postData.dreamMoods.length > 0 && (
                <span className={styles["dream-felt"]}>
                  {`${postData.dreamMoods.map((mood1) => `${DREAM_MOODS.find((mood) => mood.id === mood1).text}`).join(", ")}`}
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
                <img
                  key={image}
                  src={image}
                  width={555}
                  height={330}
                  alt={`이미지${index}`}
                />
              ))}
          </section>
        </section>
        <section>
          <h2 className="sr-only">댓글 작성 및 확인</h2>
          <button className={styles["close-btn"]} onClick={handleModalClose}>
            <img
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
                  <img
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
            <CommentArticles postId={postId} />
          </section>
        </section>
      </dialog>
    </>
  );
}
