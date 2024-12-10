import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./WritePost.module.css";
import StopModal from "./StopModal";
import HashtagModal from "./HashtagModal";

export default function WritePost() {
  const [isWritingModalOpen, setIsWritingModalOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isContentChanged, setIsContentChanged] = useState(false);
  // 작성 중단 상태 저장(영역 밖 클릭 여부)
  const modalRef = useRef(null);
  // 해시태그/기분 클릭 목록
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  // 모달 열림 확인
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  // 선택지 여부 확인
  const handleSelectGenres = (e) => {
    const { value, checked } = e.target;
    setSelectedGenres((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
    setIsContentChanged(true);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsContentChanged(true);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const closeStopModal = () => setIsStopModalOpen(false);
  const handleStopWriting = () => {
    if (isContentChanged) {
      setIsStopModalOpen(true);
    } else {
      setIsWritingModalOpen(false);
    }
  };
  const stopWriting = () => setIsWritingModalOpen(false);

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
                placeholder={`00년 00월 00일 꿈 일기`}
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
                  {selectedGenres.length === 0
                    ? null
                    : selectedGenres.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                </ul>
              </div>
              {/* 기분 추가 */}
              <div className={styles["user-feeling"]}>
                <p>지금 상태</p>
                <input type="button" className={styles["btn-feeling"]}>
                  {/* 누르면 체크박스 모달 열기 */}
                </input>
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
        {isStopModalOpen && (
          <StopModal
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
