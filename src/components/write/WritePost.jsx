import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./WritePost.module.css";
import StopModal from "./StopModal";
import HashtagModal from "./HashtagModal";
import MoodModal from "./MoodModal";

import { DREAM_GENRES, DREAM_MOODS } from "@/utils/constants";

export default function WritePost(/*isModalOpen*/) {
  const [isWritingModalOpen, setIsWritingModalOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isContentChanged, setIsContentChanged] = useState(false);
  // 모달 오픈 상태
  //   const modalRef = useRef(null);
  //   useEffect(() => {
  //     if (isModalOpen && modalRef.current) {
  //       modalRef.current.showModal();
  //     } else if (modalRef.current) {
  //       modalRef.current.close();
  //     }
  //   }, [isModalOpen]);

  // 해시태그/기분 클릭 목록
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  // 모달 열림 확인
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  // 선택지 여부 확인
  const handleSelectGenres = (items) => {
    setSelectedGenres(items);
    setIsContentChanged(true);
  };
  const handleSelectMoods = (items) => {
    setSelectedMoods(items);
    setIsContentChanged(true);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsContentChanged(true);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const openMoodModal = () => {
    setIsMoodModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const closeMoodModal = () => setIsMoodModalOpen(false);
  const closeStopModal = () => setIsStopModalOpen(false);
  const handleStopWriting = () => {
    if (isContentChanged) {
      setIsStopModalOpen(true);
    } else {
      setIsWritingModalOpen(false);
    }
  };
  const stopWriting = () => setIsWritingModalOpen(false);

  // 날짜
  const today = new Date();
  const year = ("0" + today.getFullYear()).slice(-2);
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const date = today.getDate().toString().padStart(2, "0");

  return (
    <div>
      <dialog className={styles["new-post"]} open={isWritingModalOpen}>
        <h2 className="sr-only">새로운 글 작성</h2>
        <div className={styles["user-prof"]}>
          <Image src="/images/rabbit.svg" width={52} height={52} />
          <p className={styles["user-name"]}>
            {"JINI"}
            <p className={styles["user-id"]}>@jini</p>
          </p>
        </div>

        <button onClick={handleStopWriting} className={styles["btn-close"]}>
          <Image src="/images/close.svg" width={40} height={40}></Image>
          <span className="sr-only">닫기</span>
        </button>

        <form id={styles["new-post-form"]} onChange={handleInputChange}>
          <div id={styles["title"]}>
            <label id={styles["title-input"]}>
              Title
              <input
                type="text"
                for="title"
                placeholder={`${year}년 ${month}월 ${date}일 꿈 일기`}
              />
            </label>
            <label id={styles["hidden"]}>
              <input type="checkbox" for="hidden" />
              비공개
            </label>
          </div>

          <div className={styles["write-field"]}>
            <div className={styles["write-field-opt"]}>
              {/* 버튼 누르면 해시태그 입력용 모달 나타나기? */}
              <div className={styles["genre-picker"]}>
                <button type="button" onClick={openModal}>
                  <Image src="/images/plus-circle.svg" width={28} height={28} />
                  <span className="sr-only">태그 추가하기</span>
                </button>
                <ul>
                  {selectedGenres.map((item) => (
                    <li
                      key={item.text}
                      style={{
                        backgroundColor: `${item.color.hex}`,
                        color: `${item.color.textColor}`,
                      }}
                    >
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
              {/* 기분 추가 */}
              <div className={styles["user-feeling"]}>
                <p>지금 상태</p>
                {selectedMoods.length === 0 && (
                  <button
                    type="button"
                    className={styles["btn-feeling"]}
                    onClick={openMoodModal}
                  >
                    {/* {selectedMoods.map((item) => (
                    <li key={item.text}>{item.text}</li>
                  ))} */}
                  </button>
                )}
                {selectedMoods.length !== 0 && (
                  <button
                    type="button"
                    className={styles["btn-feeling-selected"]}
                    onClick={openMoodModal}
                  >
                    <ul>
                      {selectedMoods.map((item) => (
                        <li key={item.text}>{item.text}</li>
                      ))}
                    </ul>
                  </button>
                )}
              </div>

              <div className={styles["rate-star-container"]}>
                <p>오늘의 꿈 별점: </p>
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

            {/* 구분선 */}
            {/* <span className={styles["break-line"]}></span> */}
            <p className={styles["text-field-area"]}>
              <span className="sr-only">글 작성</span>
              <textarea
                placeholder="오늘은 어떤 꿈을 꾸셨나요?"
                className={styles["text-field-area"]}
              />
            </p>
          </div>
          <div className={styles["btn-submit-area"]}>
            <button
              type="submit"
              form="new-post-form"
              className={styles["btn-submit"]}
            >
              전송
            </button>
          </div>
        </form>

        <HashtagModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          onConfirm={handleSelectGenres}
        />
        <MoodModal
          isModalOpen={isMoodModalOpen}
          closeModal={closeMoodModal}
          onConfirm={handleSelectMoods}
        />
        {isStopModalOpen && (
          <StopModal
            isStopModalOpen={isStopModalOpen}
            closeModal={closeStopModal}
            onConfirm={() => {
              stopWriting();
              setInputValue("");
              setSelectedGenres([]);
              setSelectedMoods([]);
              setIsContentChanged(false);
            }}
          />
        )}
      </dialog>
    </div>
  );
}
