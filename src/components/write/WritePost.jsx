import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./WritePost.module.css";
import StopModal from "./StopModal";
import HashtagModal from "./HashtagModal";

export default function WritePost() {
  // 작성 중단 상태 저장(영역 밖 클릭 여부)
  const [isStop, setIsStop] = useState(false);

  return (
    <dialog className={styles["new-post"]} open>
      <h2 className="sr-only">새로운 글 작성</h2>
      <Image src="/images/rabbit.svg" width={49} height={49} />
      <p>
        {"JINI"}
        <p>@jini</p>
      </p>

      <button className={styles["btn-close"]}>
        <Image src="/images/close.svg" width={22} height={22}></Image>
        <span className="sr-only">닫기</span>
      </button>

      <label id={styles["title"]}>
        Title
        <input type="text" for="title" placeholder="00년 00월 00일 꿈 일기" />
      </label>
      <label id="hidden">
        <input type="checkbox" for="hidden" />
        비공개
      </label>

      <div className={styles["write-field"]}>
        <div className={styles["write-field-opt"]}>
          {/* 버튼 누르면 해시태그 입력용 모달 나타나기? */}
          <button>
            <Image src="/images/plus-circle.svg" width={28} height={28} />
            <span className="sr-only">태그 추가하기</span>
          </button>
          {/* 기분 추가 */}
          <p>
            지금 상태
            <button>{/* 누르면 체크박스 모달 열기 */}</button>
          </p>

          <p>오늘의 꿈 별점: </p>
          <div className="rate-stars">
            <input
              type="radio"
              className={styles["rate-star"]}
              name="rate-star"
              value={1}
            />
            <input
              type="radio"
              className={styles["rate-star"]}
              name="rate-star"
              value={2}
            />
            <input
              type="radio"
              className={styles["rate-star"]}
              name="rate-star"
              value={3}
            />
            <input
              type="radio"
              className={styles["rate-star"]}
              name="rate-star"
              value={4}
            />
            <input
              type="radio"
              className={styles["rate-star"]}
              name="rate-star"
              value={5}
            />
          </div>
        </div>

        <label>
          <span className="sr-only">글 작성</span>
          <textarea
            placeholder="오늘은 어떤 꿈을 꾸셨나요?"
            className={styles["text-field-area"]}
          />
        </label>
      </div>
    </dialog>
  );
}
