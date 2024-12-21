import React, { forwardRef, useEffect, useRef } from "react";
import styles from "./DropDown.module.css";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import Loading from "../Loading";

export const MyPost = forwardRef(
  (
    { style, togglePostPrivacy, postId, postIsPrivate, setIsWriteModalOpen },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(false);
    const ulRef = useRef(null);

    useEffect(() => {
      ulRef.current?.focus();
    }, []);

    async function deletePost() {
      try {
        setIsLoading(true);
        const response = await fetchWithAuth(`/api/post/delete/${postId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          window.location.reload();
        }
      } catch (error) {
        console.error("게시물을 삭제할 수 없습니다", error);
      } finally {
        setIsLoading(false);
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        document.activeElement.blur();
      }
    };

    return (
      <div
        className={styles["drop-down"]}
        ref={ref}
        style={style}
        role="dialog"
        aria-label="게시글 메뉴"
      >
        <ul
          className={styles["my-post"]}
          role="menu"
          ref={ulRef}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          <li className={styles["drop-down-items"]} role="none">
            <button
              className={`${styles["edit-btn"]} ${styles["drop-down-item"]}`}
              onClick={() => setIsWriteModalOpen(true)}
              role="menuitem"
            >
              수정하기
            </button>
          </li>
          <li className={styles["drop-down-items"]} role="none">
            {isLoading ? (
              <button
                type="button"
                className={`${styles["delete-btn"]} ${styles["drop-down-item"]}`}
              >
                <Loading type="miniCircle" className={styles["loading"]} />
              </button>
            ) : (
              <button
                className={`${styles["delete-btn"]} ${styles["drop-down-item"]}`}
                onClick={deletePost}
                role="menuitem"
              >
                삭제하기
              </button>
            )}
          </li>
          <li className={styles["drop-down-items"]} role="none">
            <button
              className={`${styles["secret-btn"]} ${styles["drop-down-item"]}`}
              onClick={() => togglePostPrivacy(postId, postIsPrivate)}
              role="menuitem"
            >
              {postIsPrivate ? "공개글로 변경하기" : "비밀글로 변경하기"}
            </button>
          </li>
        </ul>
      </div>
    );
  }
);

export const OtherPost = forwardRef(({ style, setIsReportModalOpen }, ref) => {
  const ulRef = useRef(null);

  useEffect(() => {
    ulRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      document.activeElement.blur();
    }
  };

  return (
    <div
      className={styles["drop-down"]}
      ref={ref}
      style={style}
      role="dialog"
      aria-label="게시글 메뉴"
    >
      <ul
        className={styles["other-post"]}
        role="menu"
        ref={ulRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <li className={styles["drop-down-items"]} role="none" tabIndex={-1}>
          <button
            className={`${styles["report-btn"]} ${styles["drop-down-item"]}`}
            onClick={() => setIsReportModalOpen(true)}
            role="menuitem"
            tabIndex={0}
          >
            신고하기
          </button>
        </li>
      </ul>
    </div>
  );
});

MyPost.displayName = "MyPost";
OtherPost.displayName = "OtherPost";
