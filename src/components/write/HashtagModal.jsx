import React, { useEffect, useRef, useState } from "react";
import styles from "./HashtagModal.module.css";
import { DREAM_GENRES, DREAM_MOODS } from "@/utils/constants";

export default function HashtagModal({ isModalOpen, closeModal, onConfirm }) {
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
  const [selectedGenres, setSelectedGenres] = useState([]);
  const maxSelect = 5;

  const handleCheckboxChange = (item) => {
    if (selectedGenres.includes(item)) {
      setSelectedGenres((prev) => prev.filter((i) => i !== item));
    } else {
      if (selectedGenres.length < maxSelect) {
        setSelectedGenres((prev) => [...prev, item]);
      }
    }
  };
  const handleConfirm = () => {
    onConfirm(selectedGenres);
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackgroundClick}
      className={styles["modal-on-writepost"]}
    >
      <form className={styles["hashtag-picker-container"]}>
        {/* 추후 선택지 데이터 불러오기 -- 시작 */}
        <ul>
          {DREAM_GENRES.map((item) => (
            <li key={item.id}>
              <input
                type="checkbox"
                checked={selectedGenres.includes(item)}
                onChange={() => handleCheckboxChange(item)}
                className={styles["hashtag-picker"]}
                id={item.id}
              />
              <label for={item.id}>{item.text}</label>
            </li>
          ))}
          {/* <li>
            <input
              type="checkbox"
              className={styles["hashtag-picker"]}
              id="1"
            />
            <label for="1">선택지</label>
          </li> */}
        </ul>
        {/* 추후 선택지 데이터 불러오기 -- 끝 */}
      </form>
      <p className={styles["sub-text-container"]}>
        <span className={styles["sub-text"]}>(최대 5개 선택 가능)</span>
        <button onClick={handleConfirm}>확인</button>
      </p>
    </dialog>
  );
}
