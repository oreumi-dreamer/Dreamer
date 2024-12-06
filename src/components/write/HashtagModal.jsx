import React from "react";
import styles from "./HashtagModal.module.css";

export default function HashtagModal() {
  return (
    <dialog className={styles["podal-on-writepost"]} open>
      {/* 추후 선택지 데이터 불러오기 -- 시작 */}
      <label>
        <input type="checkbox" className={styles["hashtag-picker"]} />
        선택지
      </label>
      <label>
        <input type="checkbox" className={styles["hashtag-picker"]} />
        선택지
      </label>
      <label>
        <input type="checkbox" className={styles["hashtag-picker"]} />
        선택지
      </label>
      {/* 추후 선택지 데이터 불러오기 -- 끝 */}
    </dialog>
  );
}
