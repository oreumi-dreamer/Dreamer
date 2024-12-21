// PostCard.jsx

import React from "react";
import { handleClickWithKeyboard } from "../Controls";
import SparkButton from "./SparkButton";
import { MyPost, OtherPost } from "../dropDown/DropDown";

const PostCard = React.memo(
  function PostCard({
    post,
    isLoggedIn,
    styles,
    tomongStampUrl,
    onSparkUpdate,
    modalProps,
    onPostAction,
    onMoreClick,
    onPostSelect,
  }) {
    return (
      <article
        className={styles["post-wrap"]}
        role="button"
        aria-label={`게시글: ${post.title}`}
        onClick={(e) => {
          if (e.target.closest("button")) {
            return;
          }

          const target = e.target.textContent;
          if (
            ![
              "수정하기",
              "삭제하기",
              "공개글로 변경하기",
              "비밀글로 변경하기",
              "신고하기",
            ].includes(target)
          ) {
            onPostSelect(post.id);
          }
        }}
        onKeyDown={handleClickWithKeyboard}
        tabIndex={0}
      >
        <h3 className={`${styles["post-title"]}`}>
          {post.isPrivate && (
            <img
              src="/images/lock.svg"
              alt="비밀글"
              className={styles["private-post"]}
            />
          )}
          {post.title}
        </h3>
        {post.isTomong && (
          <img
            src={tomongStampUrl}
            className={styles["tomong-stamp"]}
            alt="해몽이 존재함"
          />
        )}
        {post.hasImages && (
          <img
            src="/images/image.svg"
            alt="이미지"
            className={styles["include-img"]}
          />
        )}
        <p className={styles["post-text"]}>{post.content}</p>
        <div className={styles["post-btn-container"]}>
          <SparkButton
            postId={post.id}
            hasUserSparked={post.hasUserSparked}
            sparkCount={post.sparkCount}
            isLoggedIn={isLoggedIn}
            onSparkUpdate={onSparkUpdate}
          />
          <button onClick={() => onPostSelect(post.id)} tabIndex={0}>
            <img src="/images/message.svg" alt="댓글" />
            <span>{post.commentsCount}</span>
          </button>
          {modalProps.isOpen &&
            modalProps.modalType === "isMyPost" &&
            modalProps.activePostId === post.id && (
              <MyPost
                ref={modalProps.modalRef}
                style={modalProps.modalStyle}
                className={styles["more-modal"]}
                postId={post.id}
                postIsPrivate={post.isPrivate}
                togglePostPrivacy={() =>
                  onPostAction("togglePrivacy", post.id, post.isPrivate)
                }
                setIsWriteModalOpen={() => onPostAction("modify", post.id)}
              />
            )}
          {modalProps.isOpen &&
            modalProps.modalType === "isNotMyPost" &&
            modalProps.activePostId === post.id && (
              <OtherPost
                ref={modalProps.modalRef}
                style={modalProps.modalStyle}
                className={styles["more-modal"]}
                setIsReportModalOpen={() => onPostAction("report", post.id)}
              />
            )}
          <button
            ref={modalProps.buttonRef}
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick(post.id);
            }}
            onKeyDown={handleClickWithKeyboard}
          >
            <img src="/images/more.svg" alt="더보기" />
          </button>
        </div>
      </article>
    );
  },
  (prevProps, nextProps) => {
    // 이전 props와 새로운 props를 비교해서
    // true를 반환하면 리렌더링하지 않고
    // false를 반환하면 리렌더링합니다
    return (
      prevProps.post.id === nextProps.post.id &&
      prevProps.post.hasUserSparked === nextProps.post.hasUserSparked &&
      prevProps.post.sparkCount === nextProps.post.sparkCount &&
      prevProps.modalProps.isOpen === nextProps.modalProps.isOpen &&
      prevProps.modalProps.activePostId === nextProps.modalProps.activePostId
    );
  }
);

export default PostCard;
