import React from "react";
import Link from "next/link";
import styles from "../modal/PostModal.module.css";
import markdownStyles from "@/app/tomong/Result.module.css";
import { DREAM_GENRES, DREAM_MOODS } from "@/utils/constants";
import { ConfirmModal, Divider, ShareModal } from "../Controls";
import convertToHtml from "@/utils/markdownToHtml";
import postTime from "@/utils/postTime";
import CommentArticles from "../modal/CommentArticles";
import { MyPost, OtherPost } from "../dropDown/DropDown";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import useTheme from "@/hooks/styling/useTheme";
import Loading from "@/components/Loading";
import { outsideClickModalClose } from "@/utils/outsideClickModalClose";
import { useRouter } from "next/navigation";

export default function PostContent({
  type,
  postId,
  onClose,
  handleModalClose,
  isModalOpen,
  isLoading,
  setIsModalOpen,
  setIsLoading,
  comment,
  setComment,
}) {
  const [isScrap, setIsScrap] = useState(false);
  const [postData, setPostData] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [oneiromancy, setOneiromancy] = useState(false);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false); // 더보기 버튼 클릭 상태 관리
  const [modalType, setModalType] = useState(null);
  const [modalStyle, setModalStyle] = useState({});
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();

  useEffect(() => {
    const viewPost = async () => {
      try {
        if (!!postId) {
          let response;
          if (user) {
            response = await fetchWithAuth(`/api/post/search/${postId}`);
          } else {
            response = await fetch(`/api/post/search/${postId}`);
          }

          if (response.status === 404) {
            alert("해당 게시글을 찾을 수 없습니다.");
            onClose();
            return;
          }

          const data = await response.json();
          setPostData(data.post);
        }
        if (type === "modal") {
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error("게시글을 불러올 수 없습니다.:", error);
      }
    };
    viewPost();
  }, [postId]);

  useEffect(() => {
    if (postData) {
      setIsLoading(false);
    }
  }, [postData]);

  useEffect(() => {
    if (modalRef.current && buttonRef.current) {
      const cleanup = outsideClickModalClose(modalRef, buttonRef, () => {
        setIsOpen(false);
      });
      return () => {
        cleanup();
      };
    }
  }, [modalRef, buttonRef, isOpen]);

  if (!isModalOpen) {
    return null;
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (!user) {
      loginModalOpen();
      return;
    }

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

  const togglePostPrivacy = async (postId, postIsPrivate) => {
    setIsOpen(false);

    try {
      const response = await fetchWithAuth(`/api/post/private/${postId}`, {
        method: "GET",
      });

      const newPrivacyStatus = !postIsPrivate;
      setPostData((prevData) => ({
        ...prevData,
        isPrivate: newPrivacyStatus,
      }));

      const responseData = await response.json();
      if (response.ok && responseData.success) {
        return responseData.isPrivate;
      } else {
        alert(`오류: ${responseData.error}`);
        return postIsPrivate;
      }
    } catch (error) {
      console.error("비밀글 토글 중 오류 발생:", error);
      return postIsPrivate;
    }
  };

  async function handleStarButtonClick(e) {
    if (!user) {
      loginModalOpen();
      return;
    }

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
    if (!user) {
      loginModalOpen();
      return;
    }

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

  function handleCheckboxClick(e) {
    const checkboxName = e.target.parentElement.innerText;
    const isCheckboxChecked = e.target.checked;
    if (checkboxName === "꿈해몽") {
      setOneiromancy(isCheckboxChecked);
    } else if (checkboxName === "비공개") {
      setIsPrivate(isCheckboxChecked);
    }
  }

  function handlePostMoreBtnClick() {
    if (!user) {
      loginModalOpen();
      return;
    }

    const modalType = postData.isMyself ? "isMyPost" : "isNotMyPost";

    if (!isOpen) {
      setModalType(modalType);
      setIsOpen(true);
      if (buttonRef.current) {
        const position = {
          position: "absolute",
          top: "40px",
          right: "0px",
          zIndex: "10",
        };
        setModalStyle(position);
      }
    } else {
      setModalType(null);
      setIsOpen(false);
    }
  }
  function loginModalOpen() {
    setShowConfirmModal(true);
  }
  function loginModalClose() {
    setShowConfirmModal(false);
  }

  function handleShareModalOpen() {
    setShareModalOpen(true);
  }

  function handleShareModalClose() {
    setShareModalOpen(false);
  }

  return (
    <>
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
                {postData.isPrivate ? (
                  <li>
                    <img
                      src="/images/lock.svg"
                      alt="비공개"
                      width={30}
                      height={30}
                    />
                    <span>당신의 비공개 꿈이에요 :)</span>
                  </li>
                ) : (
                  <li>
                    <button onClick={handleStarButtonClick} className="star">
                      <img
                        src={
                          postData.hasUserSparked
                            ? "/images/star-fill.svg"
                            : "/images/star.svg"
                        }
                        alt={postData.hasUserSparked ? "반짝 취소" : "반짝"}
                        width={30}
                        height={30}
                      />
                    </button>
                    <span>
                      {postData.sparkCount} 명의 관심을 받고 있는 꿈이에요 :)
                    </span>
                  </li>
                )}

                <li>
                  <button onClick={handleShareModalOpen}>
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
                      src={
                        isScrap ? "/images/mark-fill.svg" : "/images/mark.svg"
                      }
                      alt="스크랩"
                      width={30}
                      height={30}
                    />
                  </button>
                </li>
                <li className={styles["more-btn"]}>
                  <button
                    type="button"
                    onClick={() => handlePostMoreBtnClick()}
                  >
                    <img
                      src="/images/more.svg"
                      alt="더보기"
                      width={30}
                      height={30}
                      ref={buttonRef}
                    />
                  </button>
                  {isOpen && modalType === "isMyPost" && (
                    <MyPost
                      ref={modalRef}
                      style={modalStyle}
                      className={styles["more-modal"]}
                      togglePostPrivacy={() =>
                        togglePostPrivacy(postId, postData.isPrivate)
                      }
                      postId={postId}
                      postIsPrivate={postData.isPrivate}
                    />
                  )}
                  {isOpen && modalType === "isNotMyPost" && (
                    <OtherPost
                      ref={modalRef}
                      style={modalStyle}
                      className={styles["more-modal"]}
                    />
                  )}
                </li>
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
                            window.matchMedia("(prefers-color-scheme: dark)")
                              .matches)
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
                    alt={`이미지 ${index}`}
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
            {type === "modal" && (
              <button
                className={styles["close-btn"]}
                onClick={handleModalClose}
              >
                <img
                  src="/images/close.svg"
                  width={30}
                  height={30}
                  alt="닫기 버튼"
                />
              </button>
            )}

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
                  user ? "댓글입력(최대 1000자)" : "로그인이 필요합니다."
                }
                onClick={user ? () => {} : loginModalOpen}
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
                  <button type="submit" disabled={isCommentSubmitting}>
                    {isCommentSubmitting ? (
                      <Loading
                        type="miniCircle"
                        className={styles["send-btn"]}
                      />
                    ) : (
                      <img
                        src="/images/send.svg"
                        width={30}
                        height={30}
                        alt="댓글 입력"
                      />
                    )}
                  </button>
                </li>
              </ul>
            </form>

            <section className={styles["comment-articles-section"]}>
              <h3 className="sr-only">댓글 모음 확인</h3>
              <CommentArticles
                postId={postId}
                user={user}
                isCommentSubmitting={isCommentSubmitting}
                isMyself={postData.isMyself}
              />
            </section>
          </section>

          {showConfirmModal && (
            <ConfirmModal
              message="로그인이 필요합니다. 로그인 하시겠습니까?"
              isOpen={loginModalOpen}
              closeModal={loginModalClose}
              onConfirm={() => router.push("/")}
            />
          )}
          {shareModalOpen && (
            <ShareModal
              isOpen={shareModalOpen}
              closeModal={handleShareModalClose}
              link={`${baseUrl}/post/${postId}`}
            />
          )}
        </>
      )}
    </>
  );
}
