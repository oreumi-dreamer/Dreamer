import React from "react";
import styles from "./HashtagModal.module.css";

export default function HashtagModal() {
  return (
    <dialog className={styles["podal-on-writepost"]} open>
      <div className={styles["hashtag-picker-container"]}>
        {/* 추후 선택지 데이터 불러오기 -- 시작 */}
        <p>
          <input type="checkbox" className={styles["hashtag-picker"]} id="1" />
          <label for="1">선택지</label>
        </p>
        {/* 추후 선택지 데이터 불러오기 -- 끝 */}
      </div>
      <p className={styles["sub-text-container"]}>
        <span className={styles["sub-text"]}>(최대 5개 선택 가능)</span>
        <button>확인</button>
      </p>
    </dialog>
  );
}
