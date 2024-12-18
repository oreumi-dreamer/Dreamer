import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import postTime from "@/utils/postTime";
import { MyPost, OtherPost } from "../dropDown/DropDown";
import { outsideClickModalClose } from "@/utils/outsideClickModalClose";
import { Divider, ShareModal } from "../Controls";
import useTheme from "@/hooks/styling/useTheme";
import useMediaQuery from "@/hooks/styling/useMediaQuery";

export default function Post({
  styles,
  post: initialPosts,
  setSelectedPostId,
}) {
  const [post, setPost] = useState(initialPosts);
  const [isOpen, setIsOpen] = useState(false);
  const [modalStyle, setModalStyle] = useState({});
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);

  const { theme } = useTheme();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // 이미지 반응형적용
  const [overlayWrapStyle, setOverlayWrapStyle] = useState("");
  const [blurStyle, setBlurStyle] = useState("");
  const [overlayStyle, setOverlayStyle] = useState("");
  const [moreCount, setMoreCount] = useState(0);

  const fiveView = useMediaQuery("(min-width : 1280px)");
  const fourView = useMediaQuery(
    "(min-width : 769px) and (max-width: 1279px )"
  );
  const threeView = useMediaQuery("(min-width:481px) and (max-width: 768px )");
  const twoView = useMediaQuery("(max-width: 480px )");

  const getImageCount = () => {
    if (post.imageUrls && post.imageUrls.length > 0) {
      if (fiveView) {
        return 5;
      } else if (fourView) {
        return 4;
      } else if (threeView) {
        return 3;
      } else if (twoView) {
        return 2;
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
    if (post.imageUrls.length > imageCount) {
      imageLayout();
      setOverlayStyle(styles["overlay"]);
      setMoreCount(post.imageUrls.length - imageCount);
    } else {
      initOverlay();
    }
  };

  useEffect(() => {
    imageResponsive();
  }, [fiveView, fourView, threeView, twoView, post.imageUrls.length]);

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
    changeSpark(postId); // 반짝 토글 시 UI 변경

    try {
      const res = await fetchWithAuth(`/api/post/spark/${postId}`);
      if (!res.ok || res.status !== 200) {
        throw new Error("반짝 실패");
      }
    } catch (error) {
      console.error("Error sparking post:", error);
      changeSpark(postId); // 반짝 실패 시 원래 상태로 복구
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

  return (
    <>
      <article className={styles["article"]}>
        <section className={styles["post-user-info"]}>
          <Link href={`/${post.authorId}`}>
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
            />
          )}
          {isOpen && !post.isMyself && (
            <OtherPost ref={modalRef} style={modalStyle} />
          )}
        </section>
        <Divider className={styles["divider"]} />
        <section
          className={styles["post-content"]}
          onClick={() => handleModalOpen(post.id)}
        >
          {post.isTomong && (
            <img
              src={tomongStampUrl}
              className={styles["tomong-stamp"]}
              alt="해몽이 존재함"
            />
          )}
          <p className={styles["post-text"]}>{post.content}</p>
          {post.imageUrls && (
            <div className={`${styles["post-img-wrap"]}`}>
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
          <button className={styles["mark-btn"]}>
            <Image
              className={styles["icon-padding"]}
              src="/images/mark.svg"
              alt="스크랩"
              width={40}
              height={40}
            />
          </button>
        </section>
      </article>
      {shareModalOpen && (
        <ShareModal
          isOpen={shareModalOpen}
          closeModal={handleShareModalClose}
          link={`${baseUrl}/post/${post.id}`}
        />
      )}
    </>
  );
}
