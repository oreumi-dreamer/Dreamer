import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import { postTime, postTimeScreenReader } from "@/utils/postTime";
import { MyPost, OtherPost } from "../dropDown/DropDown";
import { outsideClickModalClose } from "@/utils/outsideClickModalClose";
import { Divider, handleClickWithKeyboard, ShareModal } from "../Controls";
import useTheme from "@/hooks/styling/useTheme";
import WritePost from "../write/WritePost";
import ReportModal from "../report/Report";
import styles from "./Post.module.css";
import { highlightText } from "@/utils/highlightText";

export default function Post({
  post,
  onPostUpdate,
  setSelectedPostId,
  searchMode,
  searchQuery,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalStyle, setModalStyle] = useState({});
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);

  const { theme } = useTheme();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // 이미지 반응형적용
  const [overlayWrapStyle, setOverlayWrapStyle] = useState("");
  const [blurStyle, setBlurStyle] = useState("");
  const [overlayStyle, setOverlayStyle] = useState("");
  const [moreCount, setMoreCount] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [repeatCol, setRepeatCol] = useState(4);

  const getImageCount = () => {
    if (post.imageUrls && post.imageUrls.length > 0) {
      if (containerWidth >= 550) {
        return 5;
      } else if (containerWidth >= 450) {
        return 4;
      } else if (containerWidth >= 350) {
        return 3;
      } else if (containerWidth >= 250) {
        return 2;
      } else if (containerWidth >= 0) {
        return 1;
      }
      return post.imageUrls.length;
    }
    return 0;
  };

  const imageLayout = () => {
    setOverlayWrapStyle(styles["has-overlay"]);
    setBlurStyle(styles["blur"]);
  };

  const initOverlay = () => {
    setOverlayWrapStyle("");
    setBlurStyle("");
    setOverlayStyle("");
    setMoreCount(0);
  };

  const imageResponsive = () => {
    const imageCount = getImageCount();
    setRepeatCol(imageCount);
    if (post.imageUrls.length > imageCount) {
      imageLayout();
      setOverlayStyle(styles["overlay"]);
      setMoreCount(post.imageUrls.length - imageCount + 1);
    } else {
      initOverlay();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    imageResponsive();
  }, [containerWidth, post.imageUrls.length]);

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

  const handlePostMoreBtnClick = () => {
    if (!isOpen) {
      setIsOpen(true);

      if (buttonRef.current) {
        const position = {
          position: "absolute",
          top: "50px",
          right: "0px",
          zIndex: "1000",
        };
        setModalStyle(position);
      }
    } else {
      setIsOpen(false);
    }
  };

  const togglePostPrivacy = async (postId, postIsPrivate) => {
    setIsOpen(false);

    try {
      const response = await fetchWithAuth(`/api/post/private/${postId}`, {
        method: "GET",
      });

      const newPrivacyStatus = !postIsPrivate;
      setPost((prevData) => ({
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

  const changeSpark = (postId) => {
    setPost((prevData) => ({
      ...prevData,
      hasUserSparked: !prevData.hasUserSparked,
      sparkCount: prevData.hasUserSparked
        ? prevData.sparkCount - 1
        : prevData.sparkCount + 1,
    }));
  };

  const sparkHandle = async (postId) => {
    onPostUpdate(postId, {
      hasUserSparked: !post.hasUserSparked,
      sparkCount: post.hasUserSparked
        ? post.sparkCount - 1
        : post.sparkCount + 1,
    }); // 반짝 토글 시 UI 변경

    try {
      const res = await fetchWithAuth(`/api/post/spark/${postId}`);
      if (!res.ok || res.status !== 200) {
        throw new Error("반짝 실패");
      }
    } catch (error) {
      console.error("Error sparking post:", error);
      onPostUpdate(postId, {
        hasUserSparked: !post.hasUserSparked,
        sparkCount: post.hasUserSparked
          ? post.sparkCount - 1
          : post.sparkCount + 1,
      }); // 반짝 실패 시 원래 상태로 복구
    }
  };

  const handleModalOpen = (postId) => {
    setSelectedPostId(postId);
  };

  let tomongStampUrl = "/images/tomong-stamp.png";

  if (
    theme === "dark" ||
    (theme === "device" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    tomongStampUrl = "/images/tomong-stamp-dark.png";
  }

  const handleShareModalOpen = () => {
    setShareModalOpen(true);
  };

  const handleShareModalClose = () => {
    setShareModalOpen(false);
  };

  const handleReportModalOpen = () => {
    setIsReportModalOpen(true);
    setIsOpen(false);
  };

  const handleWriteModalOpen = () => {
    setIsWriteModalOpen(true);
    setIsOpen(false);
  };

  return (
    <>
      <article className={styles["article"]} ref={containerRef}>
        <h3 className="sr-only">
          {`${post.authorName}님이 ${postTimeScreenReader(post.createdAt, post.createdAt)}에 올린 꿈`}
        </h3>
        <section className={styles["post-user-info"]}>
          <Link href={`/users/${post.authorId}`}>
            <img
              src={post.profileImageUrl}
              alt={`${post.authorName}님의 프로필 사진`}
              width={49}
              height={49}
            />
            <span className={styles["user-name"]}>{post.authorName}</span>
            <span className={styles["user-id"]}>@{post.authorId}</span>
          </Link>
          <time
            className={styles["posting-time"]}
            dateTime={new Date(post.createdAt).toLocaleString("ko-KR")}
          >
            {postTime(post.createdAt, post.createdAt)}
          </time>
          {post.isPrivate && (
            <Image
              src="/images/lock.svg"
              width={20}
              height={20}
              alt="비밀글"
              className={styles["private-icon"]}
            />
          )}
          <button
            ref={buttonRef}
            onClick={() => handlePostMoreBtnClick(post.id, post.authorId)}
          >
            <Image
              src="/images/more.svg"
              alt="더보기"
              width={40}
              height={40}
              className={styles["more-btn"]}
            />
          </button>
          {isOpen && post.isMyself && (
            <MyPost
              ref={modalRef}
              style={modalStyle}
              togglePostPrivacy={() => {
                togglePostPrivacy(post.id, post.isPrivate);
              }}
              postId={post.id}
              postIsPrivate={post.isPrivate}
              setIsWriteModalOpen={handleWriteModalOpen}
            />
          )}
          {isOpen && !post.isMyself && (
            <OtherPost
              ref={modalRef}
              style={modalStyle}
              setIsReportModalOpen={handleReportModalOpen}
            />
          )}
        </section>
        <Divider className={styles["divider"]} />
        <section
          className={styles["post-content"]}
          onClick={() => handleModalOpen(post.id)}
          onKeyDown={handleClickWithKeyboard}
          role="button"
          tabIndex={0}
        >
          {post.isTomong && (
            <img
              src={tomongStampUrl}
              className={styles["tomong-stamp"]}
              alt="해몽이 존재함"
            />
          )}
          <p className={styles["post-text"]}>
            {searchMode
              ? highlightText(post.content, searchQuery)
              : post.content}
          </p>
          {post.imageUrls && (
            <div
              className={`${styles["post-img-wrap"]}`}
              style={{ gridTemplateColumns: `repeat(${repeatCol}, 1fr)` }}
            >
              {post.imageUrls
                .slice(0, getImageCount())
                .map((url, index, arr) => {
                  const isLastImage = index === arr.length - 1;
                  return (
                    <div key={index} className={overlayWrapStyle}>
                      <img
                        className={`${styles["post-img"]} ${blurStyle}`}
                        src={url}
                        alt={`게시글 이미지 ${index}`}
                        loading="lazy"
                      />
                      {isLastImage && overlayStyle && moreCount > 0 && (
                        <div className={styles["overlay"]}>+{moreCount}</div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </section>
        <section className={styles["post-btn-content"]}>
          <button onClick={() => sparkHandle(post.id)}>
            {post.hasUserSparked ? (
              <>
                {" "}
                <span className="sr-only">반짝 해제하기</span>
                <Image
                  src="/images/star-fill.svg"
                  alt=""
                  width={40}
                  height={40}
                />
                <span className={styles["btn-label"]}>
                  {post.sparkCount} 반짝
                </span>
              </>
            ) : (
              <>
                <span className="sr-only">반짝 누르기</span>
                <Image src="/images/star.svg" alt="" width={40} height={40} />
                <span className={styles["btn-label"]}>
                  {post.sparkCount} 반짝
                </span>
              </>
            )}
          </button>
          <button onClick={() => handleModalOpen(post.id)}>
            <span className="sr-only">댓글 작성하기</span>
            <Image
              className={styles["icon-padding"]}
              src="/images/message.svg"
              alt=""
              width={40}
              height={40}
            />
            <span className={styles["btn-label"]}>
              {post.commentsCount} 댓글
            </span>
          </button>
          <button onClick={handleShareModalOpen}>
            <Image
              className={styles["icon-padding"]}
              src="/images/share.svg"
              alt="공유하기"
              width={40}
              height={40}
            />
          </button>
          {/* <button className={styles["mark-btn"]}> // 추후 스크랩 기능 추가 시 주석 해제
            <Image
              className={styles["icon-padding"]}
              src="/images/mark.svg"
              alt="스크랩"
              width={40}
              height={40}
            />
          </button> */}
        </section>
      </article>
      {shareModalOpen && (
        <ShareModal
          isOpen={shareModalOpen}
          closeModal={handleShareModalClose}
          link={`${baseUrl}/post/${post.id}`}
        />
      )}
      {isWriteModalOpen && (
        <WritePost
          key={`${post.id}-modify`}
          modifyId={post.id}
          isWriteModalOpen={isWriteModalOpen}
          closeWriteModal={() => setIsWriteModalOpen(false)}
        />
      )}
      {isReportModalOpen && (
        <ReportModal
          key={`${post.id}-report`}
          isOpen={isReportModalOpen}
          closeModal={() => setIsReportModalOpen(false)}
          postId={post.id}
        />
      )}
    </>
  );
}
