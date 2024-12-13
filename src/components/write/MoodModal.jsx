import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./MoodModal.module.css";
import { DREAM_MOODS } from "@/utils/constants";

const MoodModal = forwardRef(
  ({ isModalOpen, closeModal, onConfirm, style }, moodModalRef) => {
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

    const handleResetSelected = () => {
      setSelectedGenres([]);
    };
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
        ref={(node) => {
          dialogRef.current = node;
          if (moodModalRef) {
            moodModalRef.current = node;
          }
        }}
        style={style}
        onClick={handleBackgroundClick}
        className={styles["modal-on-writepost"]}
      >
        <button
          onClick={handleResetSelected}
          className={styles["btn-reset-select"]}
        >
          다시 선택하기
        </button>
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
);

export default MoodModal;
