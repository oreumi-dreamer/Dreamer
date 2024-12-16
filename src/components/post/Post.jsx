"use client";

import React, { useEffect, useState } from "react";
import styles from "../modal/PostModal.module.css";
import markdownStyles from "@/app/tomong/Result.module.css";
import Link from "next/link";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import postTime from "@/utils/postTime";
import CommentArticles from "../modal/CommentArticles";
import { DREAM_GENRES, DREAM_MOODS } from "@/utils/constants";
import Loading from "../Loading";
import { useSelector } from "react-redux";
import convertToHtml from "@/utils/markdownToHtml";
import { Divider } from "../Controls";
import useTheme from "@/hooks/styling/useTheme";
import Error404 from "../error404/Error404";

export default function PostComponent({ postId }) {
  const [isScrap, setIsScrap] = useState(false);
  const [comment, setComment] = useState(undefined);
  const [postData, setPostData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [oneiromancy, setOneiromancy] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();

  useEffect(() => {
    const viewPost = async () => {
      try {
        let response;
        if (!!postId) {
          if (user) {
            response = await fetchWithAuth(`/api/post/search/${postId}`);
          } else {
            response = await fetch(`/api/post/search/${postId}`);
          }
          if (!response.ok) {
            throw new Error("게시글을 불러올 수 없습니다.");
          } else {
            const data = await response.json();
            setPostData(data.post);
          }
        }
      } catch (error) {
        console.log(error);
        setNotFound(true);
      }
    };
    viewPost();
  }, [postId]);

  useEffect(() => {
    if (postData) {
      setIsLoading(false);
    }
  }, [postData]);

  async function handleCommentSubmit(e) {
    e.preventDefault();

    if (!comment || comment.trim().length <= 0) {
      alert("입력한 댓글의 내용이 없습니다.");
    }
    if (comment && comment.trim().length > 0) {
      try {
        setIsCommentSubmitting(true);
        const formData = new FormData();
        formData.append("content", comment.trim());
        formData.append("isPrivate", isPrivate);
        formData.append("isDreamInterpretation", oneiromancy);

        const commentRes = await fetchWithAuth(
          `/api/comment/create/${postId}`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (commentRes.ok) {
          setComment("");
          setIsPrivate(false);
          setOneiromancy(false);
        } else {
          alert("댓글 작성 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("댓글 작성 중 오류가 발생했습니다. :", error);
      }
    }
    setIsCommentSubmitting(false);
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
    const hasSparked = postData.hasUserSparked;
    const sparkCount = postData.sparkCount;

    setPostData((prev) => ({
      ...prev,
      hasUserSparked: !hasSparked,
      sparkCount: hasSparked ? sparkCount - 1 : sparkCount + 1,
    }));

    if (e.currentTarget.className === "star") {
      try {
        const starRes = await fetchWithAuth(`/api/post/spark/${postId}`);

        if (!starRes.ok || starRes.status !== 200) {
          throw new Error("반짝을 실행하지 못했어요.");
        }
      } catch (error) {
        console.error("반짝을 실행하지 못했어요 :", error);
        setPostData((prev) => ({
          ...prev,
          hasUserSparked: !hasSparked,
          sparkCount: hasSparked ? sparkCount - 1 : sparkCount + 1,
        }));
      }
    }
  }

  function handleScrapButtonClick(e) {
    if (e.currentTarget.className === "scrap") {
      setIsScrap((prev) => !prev);
    }
  }

  let tomongStampUrl = "/images/tomong-stamp.png";
  let tomongIconUrl = "/images/tomong.svg";
  if (
    theme === "dark" ||
    (theme === "device" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    tomongStampUrl = "/images/tomong-stamp-dark.png";
    tomongIconUrl = "/images/tomong-dark.svg";
  }

  if (notFound) {
    return <Error404 />;
  }

  return (
    <>
      <>
        <article className={styles["post-modal"]}>
          {isLoading ? (
            <Loading type="small" />
          ) : (
            <>
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
                  <h3 className="sr-only">
                    작성자 정보 및 본문 관련 버튼 모음
                  </h3>
                  <Link
                    className={styles.profile}
                    href={`/${postData.authorId}`}
                  >
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
                      <button
                        onClick={handleStarButtonClick}
                        className="star"
                        disabled={!user}
                      >
                        <img
                          src={
                            postData.hasUserSparked
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
                    {user && (
                      <>
                        <li>
                          <button
                            onClick={handleScrapButtonClick}
                            className="scrap"
                          >
                            <img
                              src={
                                isScrap
                                  ? "/images/mark-fill.svg"
                                  : "/images/mark.svg"
                              }
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
                      </>
                    )}
                  </ul>
                </section>
                <section className={styles["post-text"]}>
                  <h3 className="sr-only">본문 내용</h3>
                  {postData.isTomong && (
                    <img
                      src={tomongStampUrl}
                      className={styles["tomong-stamp"]}
                      alt="해몽이 존재함"
                    />
                  )}
                  <div className={styles["post-text-header"]}>
                    {postData.dreamGenres.length > 0 && (
                      <ul className={styles["post-tag"]}>
                        {postData.dreamGenres.map((tag, index) => (
                          <li
                            key={index}
                            style={
                              theme === "dark" ||
                              (theme === "device" &&
                                window.matchMedia(
                                  "(prefers-color-scheme: dark)"
                                ).matches)
                                ? {
                                    backgroundColor: `${DREAM_GENRES.find((genre) => genre.id === tag).darkColor.hex}`,
                                    color: `${DREAM_GENRES.find((genre) => genre.id === tag).darkColor.textColor}`,
                                  }
                                : {
                                    backgroundColor: `${DREAM_GENRES.find((genre) => genre.id === tag).lightColor.hex}`,
                                    color: `${DREAM_GENRES.find((genre) => genre.id === tag).lightColor.textColor}`,
                                  }
                            }
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
                  {postData.tomong && (
                    <>
                      <Divider />
                      <h3 className={styles["tomong-result-heading"]}>
                        <img
                          className={styles["tomong-icon"]}
                          src={tomongIconUrl}
                          alt=""
                          width={16}
                        />
                        토몽이의 해몽 결과:
                      </h3>
                      <div
                        className={`${markdownStyles["markdown"]} ${markdownStyles["markdown-in-modal"]}`}
                        dangerouslySetInnerHTML={{
                          __html: convertToHtml(postData.tomong.content),
                        }}
                      />
                    </>
                  )}
                </section>
              </section>
              <section className={styles["comment-section"]}>
                <h2 className="sr-only">댓글 작성 및 확인</h2>

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
                    placeholder={
                      !user
                        ? "로그인 후 댓글을 작성할 수 있어요."
                        : "댓글입력(최대 1000자)"
                    }
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                    disabled={!user}
                  />
                  <ul className={styles["comment-setting"]}>
                    <li>
                      <input
                        type="checkbox"
                        id="oneiromancy"
                        className={styles["checkbox-hide"]}
                        onChange={handleCheckboxClick}
                        disabled={!user}
                      />
                      <label
                        htmlFor="oneiromancy"
                        className={styles["checkbox"]}
                      >
                        꿈해몽
                      </label>
                    </li>

                    <li>
                      <input
                        type="checkbox"
                        id="private"
                        className={styles["checkbox-hide"]}
                        onChange={handleCheckboxClick}
                        disabled={!user}
                      />

                      <label htmlFor="private" className={styles["checkbox"]}>
                        비공개
                      </label>
                    </li>

                    <li>
                      <button type="submit" disabled={!user}>
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
                  <CommentArticles
                    postId={postId}
                    user={user}
                    isMyself={postData?.isMyself}
                    isCommentSubmitting={isCommentSubmitting}
                  />
                </section>
              </section>
            </>
          )}
        </article>
      </>
    </>
  );
}
