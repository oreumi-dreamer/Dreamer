import React, { useState, useEffect, useRef } from "react";
import styles from "./PostModal.module.css";
import PostContent from "../post/PostContent";
import { ConfirmModal } from "../Controls";
import { disableScroll, enableScroll } from "@/utils/scrollHandler";

export default function PostModal({
  postId,
  isShow,
  onClose,
  setPosts,
  setFeedPosts,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState(undefined);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  function handleModalClose() {
    if (comment) {
      setIsConfirmModalOpen(true);
      return;
    }

    setIsModalOpen(false);
    onClose();
    setComment(undefined);
    setIsLoading(true);
  }

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isShow && dialog) {
      // 현재 포커스된 요소를 저장
      previousFocusRef.current = document.activeElement;

      dialog.showModal();
      setIsModalOpen(true);
      disableScroll();

      // 첫 번째 포커스 가능한 요소로 포커스 이동
      const focusableElements = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length) {
        setTimeout(() => {
          focusableElements[0].focus();
        }, 0);
      }

      // ESC 키 핸들링
      const handleCancel = (e) => {
        e.preventDefault();
        handleModalClose();
      };

      dialog.addEventListener("cancel", handleCancel);
      return () => {
        dialog.removeEventListener("cancel", handleCancel);
        // close() 호출 전에 dialog 존재 여부 확인
        if (dialog) {
          try {
            dialog.close();
          } catch (error) {
            console.error("Dialog close error:", error);
          }
        }
        enableScroll();

        // 이전에 포커스되었던 요소로 포커스 이동
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isShow]);

  if (!isShow) return null;

  return (
    <>
      <dialog
        ref={dialogRef}
        className={styles["post-modal"]}
        onClick={(e) => {
          // dialog 자체가 클릭된 경우에만 처리 (버블링된 이벤트는 무시)
          if (e.target === dialogRef.current) {
            handleModalClose();
          }
        }}
      >
        <PostContent
          type="modal"
          postId={postId}
          setPosts={setPosts}
          setFeedPosts={setFeedPosts}
          onClose={onClose}
          handleModalClose={handleModalClose}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          comment={comment}
          setComment={setComment}
        />
      </dialog>
      {isConfirmModalOpen && (
        <ConfirmModal
          onConfirm={() => {
            setIsModalOpen(false);
            onClose();
            setComment(undefined);
            setIsLoading(true);
            setIsConfirmModalOpen(false);
          }}
          isOpen={() => setIsConfirmModalOpen(true)}
          closeModal={() => setIsConfirmModalOpen(false)}
          message="댓글을 작성중입니다. 종료하시겠습니까?"
        />
      )}
    </>
  );
}
