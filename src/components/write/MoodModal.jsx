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
  (
    {
      isModalOpen,
      closeModal,
      onConfirm,
      selectedMoods,
      setSelectedMoods,
      style,
    },
    moodModalRef
  ) => {
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
        onConfirm(selectedMoods);
        closeModal();
      }
    };
    //     const [selectedMoods, setselectedMoods] = useState([]);
    const maxSelect = 5;

    const handleResetSelected = () => {
      setSelectedMoods([]);
    };
    const handleCheckboxChange = (item) => {
      if (selectedMoods.includes(item)) {
        setSelectedMoods((prev) => prev.filter((i) => i !== item));
      } else {
        if (selectedMoods.length < maxSelect) {
          setSelectedMoods((prev) => [...prev, item]);
        }
      }
    };
    const handleConfirm = () => {
      onConfirm(selectedMoods);
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
        <div
          className={styles["modal-contents"]}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setSelectedMoods([])}
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
                    checked={selectedMoods.includes(item)}
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
            <button onClick={() => onConfirm(selectedMoods)}>확인</button>
          </p>
        </div>
      </dialog>
    );
  }
);

export default MoodModal;
