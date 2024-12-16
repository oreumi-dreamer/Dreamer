"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./WritePost.module.css";
import StopModal from "./StopModal";
import HashtagModal from "./HashtagModal";
import MoodModal from "./MoodModal";
import { useSelector } from "react-redux";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import Error404 from "../error404/Error404";
import useTheme from "@/hooks/styling/useTheme";
import { calculateModalPosition } from "@/utils/calculateModalPosition";

export default function WritePost({ isWriteModalOpen, closeWriteModal }) {
  const [isWritingModalOpen, setIsWritingModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const [isContentChanged, setIsContentChanged] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();

  const profileImageUrl = user.profileImageUrl || "/images/rabbit.svg";
  const userId = user.userId;
  const userName = user.userName;
  // 모달 오픈 상태
  const modalRef = useRef(null);
  useEffect(() => {
    if (isWriteModalOpen && modalRef.current) {
      modalRef.current.showModal();
    } else if (modalRef.current) {
      modalRef.current.close();
    }
  }, [isWriteModalOpen]);
  // 외부 클릭
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      if (isContentChanged && contentValue !== "") {
        setIsStopModalOpen(true);
      } else {
        closeWriteModal();
      }
    }
  };

  useEffect(() => {
    const handleEscKey = (e) => {
      if (isWriteModalOpen && e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        handleStopWriting();
      }
    };
    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isWriteModalOpen, contentValue, isContentChanged]);

  // 해시태그/기분 클릭 목록
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [rating, setRating] = useState(null); // 별점
  const [isPrivate, setIsPrivate] = useState(false); // 비공개
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
  const genresId = selectedGenres.map((item) => item.id);
  const moodsId = selectedMoods.map((item) => item.id);
  const handleTitleChange = (e) => {
    setInputValue(e.target.value);
    setIsContentChanged(true);
  };
  const handleContentChange = (e) => {
    setContentValue(e.target.value);
    setIsContentChanged(true);
  };
  const handleRatingChange = (e) => {
    setRating(e.target.value);
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
  const handleStopModalConfirm = () => {
    setIsStopModalOpen(false);
    resetForm();
    closeWriteModal();
  };
  const handleStopWriting = () => {
    if (isContentChanged && contentValue !== "") {
      setIsStopModalOpen(true);
    } else {
      resetForm();
      setIsWritingModalOpen(false);
      closeWriteModal();
    }
  };

  // 버튼위치에 따른 모달위치고정
  const [tagModalStyle, setTagModalStyle] = useState({});
  const [moodModalStyle, setMoodModalStyle] = useState({});
  const tagButtonRef = useRef(null);
  const moodButtonRef = useRef(null);
  const tagModalRef = useRef(null);
  const moodModalRef = useRef(null);

  useLayoutEffect(() => {
    if (tagButtonRef.current && tagModalRef.current) {
      const updatePosition = () => {
        const position = calculateModalPosition(tagButtonRef, 0, 35);
        if (position) {
          setTagModalStyle(position);
        }
      };

      updatePosition();
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [tagButtonRef, tagModalRef, isModalOpen]);

  useLayoutEffect(() => {
    if (moodButtonRef.current && moodModalRef.current) {
      const updatePosition = () => {
        const position = calculateModalPosition(moodButtonRef, -5, 12);
        if (position) {
          setMoodModalStyle(position);
        }
      };

      updatePosition();
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [moodButtonRef, moodModalRef, isMoodModalOpen]);
  const resetForm = () => {
    setInputValue("");
    setContentValue("");
    setSelectedGenres([]);
    setSelectedMoods([]);
    setIsContentChanged(false);
    setRating(null);
    setIsPrivate(false);
  };

  // 날짜
  const today = new Date();
  const year = ("0" + today.getFullYear()).slice(-2);
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const date = today.getDate().toString().padStart(2, "0");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contentValue === "") {
      alert("작성된 내용이 없습니다");
      return;
    }

    const formData = new FormData();
    formData.append(
      "title",
      inputValue === "" ? `${year}년 ${month}월 ${date}일 꿈 일기` : inputValue
    );
    formData.append("content", contentValue);
    formData.append("genres", JSON.stringify(genresId));
    formData.append("moods", JSON.stringify(moodsId));
    formData.append("rating", rating === null ? "0" : rating);
    formData.append("isPrivate", isPrivate ? "true" : "false");

    try {
      const response = await fetchWithAuth("/api/post/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        resetForm();
        closeWriteModal();
      } else {
        alert("게시글 작성 실패");
      }
    } catch (error) {
      console.error("에러", error);
    }
  };

  if (!user) {
    return <Error404 />;
  }

  return (
    <dialog
      className={styles["new-post"]}
      ref={modalRef}
      open={isWritingModalOpen}
      onClick={handleBackgroundClick}
    >
      <div
        className={styles["modal-contents"]}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="sr-only">새로운 글 작성</h2>
        <div className={styles["user-prof"]}>
          <img
            src={profileImageUrl}
            width={52}
            height={52}
            className={styles["user-profile-img"]}
          />
          <p className={styles["user-name"]}>
            {userName}
            <span className={styles["user-id"]}>@{userId}</span>
          </p>
        </div>

        <button onClick={handleStopWriting} className={styles["btn-close"]}>
          <Image src="/images/close.svg" width={40} height={40}></Image>
          <span className="sr-only">닫기</span>
        </button>

        <form
          id="new-post-form"
          className={styles["new-post-form"]}
          onSubmit={handleSubmit}
        >
          <div id={styles["title"]}>
            <label id={styles["title-input"]}>
              Title
              <input
                type="text"
                for="title"
                placeholder={`${year}년 ${month}월 ${date}일 꿈 일기`}
                onChange={handleTitleChange}
              />
            </label>
            <label id={styles["hidden"]}>
              <input
                type="checkbox"
                for="hidden"
                checked={isPrivate}
                onChange={() => setIsPrivate((prev) => !prev)}
              />
              비공개
            </label>
          </div>

          <div className={styles["write-field"]}>
            <div className={styles["write-field-opt"]}>
              <div className={styles["genre-picker"]}>
                <button type="button" onClick={openModal}>
                  <Image src="/images/plus-circle.svg" width={28} height={28} />
                  <span className="sr-only">태그 추가하기</span>
                </button>
                <ul>
                  {selectedGenres.map((item) => (
                    <li
                      key={item.text}
                      style={
                        theme === "light" ||
                        (theme === "device" &&
                          window.matchMedia("(prefers-color-scheme: light)")
                            .matches)
                          ? {
                              backgroundColor: `${item.lightColor.hex}`,
                              color:
                                `${item.lightColor.textColor}` &&
                                `${item.lightColor.textColor}`,
                            }
                          : {
                              backgroundColor: `${item.darkColor.hex}`,
                              color:
                                `${item.darkColor.textColor}` &&
                                `${item.darkColor.textColor}`,
                            }
                      }
                    >
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles["user-feeling"]}>
                <p>지금 상태</p>
                {selectedMoods.length === 0 && (
                  <button
                    type="button"
                    className={styles["btn-feeling"]}
                    onClick={openMoodModal}
                  ></button>
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
                  onChange={handleRatingChange}
                  checked={rating === "1"}
                />
                <input
                  type="radio"
                  className={styles["rate-star"]}
                  name="rate-star"
                  value={2}
                  onChange={handleRatingChange}
                  checked={rating === "2"}
                />
                <input
                  type="radio"
                  className={styles["rate-star"]}
                  name="rate-star"
                  value={3}
                  onChange={handleRatingChange}
                  checked={rating === "3"}
                />
                <input
                  type="radio"
                  className={styles["rate-star"]}
                  name="rate-star"
                  value={4}
                  onChange={handleRatingChange}
                  checked={rating === "4"}
                />
                <input
                  type="radio"
                  className={styles["rate-star"]}
                  name="rate-star"
                  value={5}
                  onChange={handleRatingChange}
                  checked={rating === "5"}
                />
              </div>
            </div>
            <span className={styles["break-line"]}></span>
            <p className={styles["text-field-area"]}>
              <span className="sr-only">글 작성</span>
              <textarea
                placeholder="오늘은 어떤 꿈을 꾸셨나요?"
                className={styles["text-field-area"]}
                onChange={handleContentChange}
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
          ref={tagModalRef}
          style={tagModalStyle}
        />
        <MoodModal
          isModalOpen={isMoodModalOpen}
          closeModal={closeMoodModal}
          onConfirm={handleSelectMoods}
          ref={moodModalRef}
          style={moodModalStyle}
        />
        {isStopModalOpen && (
          <StopModal
            isStopModalOpen={isStopModalOpen}
            closeModal={closeStopModal}
            onConfirm={handleStopModalConfirm}
          />
        )}
      </div>
    </dialog>
  );
}
