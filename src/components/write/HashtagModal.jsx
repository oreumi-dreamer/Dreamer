import React, { useEffect, useRef } from "react";
import styles from "./HashtagModal.module.css";

export default function HashtagModal({
  isModalOpen,
  closeModal,
  selectedItems,
}) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (isModalOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (dialogRef.current) {
      dialogRef.current.close();
    }
  }, [isModalOpen]);
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackgroundClick}
      className={styles["modal-on-writepost"]}
    >
      <form className={styles["hashtag-picker-container"]}>
        {/* 추후 선택지 데이터 불러오기 -- 시작 */}
        <p>
          <input type="checkbox" className={styles["hashtag-picker"]} id="1" />
          <label for="1">선택지</label>
        </p>
        {/* 추후 선택지 데이터 불러오기 -- 끝 */}
      </form>
      <p className={styles["sub-text-container"]}>
        <span className={styles["sub-text"]}>(최대 5개 선택 가능)</span>
        <button onClick={closeModal}>확인</button>
      </p>
    </dialog>
  );
}
