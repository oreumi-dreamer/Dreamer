import React, { forwardRef, useLayoutEffect, useRef } from "react";
import styles from "./HashtagModal.module.css";
import { DREAM_GENRES } from "@/utils/constants";

const HashtagModal = forwardRef(
  (
    {
      isModalOpen,
      closeModal,
      onConfirm,
      selectedGenres,
      setSelectedGenres,
      style,
    },
    tagModalRef
  ) => {
    const dialogRef = useRef(null);
    useLayoutEffect(() => {
      if (isModalOpen && dialogRef.current) {
        dialogRef.current.showModal();
      } else if (dialogRef.current) {
        dialogRef.current.close();
      }
    }, [isModalOpen]);

    const handleBackgroundClick = (e) => {
      if (e.target === e.currentTarget) {
        onConfirm(selectedGenres);
        closeModal();
      }
    };

    const maxSelect = 5;

    const handleCheckboxChange = (item) => {
      const isSelected = selectedGenres.some((genre) => genre.id === item.id);

      if (isSelected) {
        setSelectedGenres((prev) =>
          prev.filter((genre) => genre.id !== item.id)
        );
      } else {
        if (selectedGenres.length < maxSelect) {
          setSelectedGenres((prev) => [...prev, item]);
        }
      }
    };

    const handleConfirm = () => {
      onConfirm(selectedGenres);
      closeModal();
    };

    return (
      <dialog
        style={style}
        ref={(node) => {
          dialogRef.current = node;
          if (tagModalRef) {
            tagModalRef.current = node;
          }
        }}
        onClick={handleBackgroundClick}
        className={styles["modal-on-writepost"]}
      >
        <div
          className={styles["modal-contents"]}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setSelectedGenres([])}
            className={styles["btn-reset-select"]}
          >
            다시 선택하기
          </button>
          <form className={styles["hashtag-picker-container"]}>
            <ul>
              {DREAM_GENRES.map((item) => (
                <li key={item.id}>
                  <input
                    type="checkbox"
                    checked={selectedGenres.some(
                      (genre) => genre.id === item.id
                    )}
                    onChange={() => handleCheckboxChange(item)}
                    className={styles["hashtag-picker"]}
                    id={item.id}
                  />
                  <label htmlFor={item.id}>{item.text}</label>
                </li>
              ))}
            </ul>
          </form>
          <p className={styles["sub-text-container"]}>
            <span className={styles["sub-text"]}>(최대 5개 선택 가능)</span>
            <button onClick={handleConfirm}>확인</button>
          </p>
        </div>
      </dialog>
    );
  }
);

HashtagModal.displayName = "HashtagModal";

export default HashtagModal;
