import React, { useEffect, useRef, useState } from "react";
import styles from "./MoodModal.module.css";
import { DREAM_MOODS } from "@/utils/constants";

export default function MoodModal({ isModalOpen, closeModal, onConfirm }) {
  const dialogRef = useRef(null);
  useEffect(() => {
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
    closeModal();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackgroundClick}
      className={styles["modal-on-writepost"]}
    >
      <form className={styles["hashtag-picker-container"]}>
        <ul>
          {DREAM_MOODS.map((item) => (
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
        </ul>
      </form>
      <p className={styles["sub-text-container"]}>
        <span className={styles["sub-text"]}>(최대 5개 선택 가능)</span>
        <button onClick={handleConfirm}>확인</button>
      </p>
    </dialog>
  );
}
