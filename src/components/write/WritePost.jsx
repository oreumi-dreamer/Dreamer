"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./WritePost.module.css";
import StopModal from "./StopModal";
import HashtagModal from "./HashtagModal";
import MoodModal from "./MoodModal";
import { useSelector } from "react-redux";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import useTheme from "@/hooks/styling/useTheme";
import Loading from "../Loading";
import { useRouter } from "next/navigation";

export default function WritePost({ isWriteModalOpen, closeWriteModal }) {
  const [isWritingModalOpen, setIsWritingModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const [isContentChanged, setIsContentChanged] = useState(false);
  const [imageFiles, setImageFiles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();
  const router = useRouter();

  const profileImageUrl = user?.profileImageUrl || "/images/rabbit.svg";
  const userId = user?.userId;
  const userName = user?.userName;

  // 해시태그/기분 클릭 목록
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [rating, setRating] = useState(null); // 별점
  const [isPrivate, setIsPrivate] = useState(false); // 비공개
  // 모달 열림 확인
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);

  const genresId = selectedGenres.map((item) => item.id);
  const moodsId = selectedMoods.map((item) => item.id);

  const inProgress =
    contentValue !== "" ||
    inputValue !== "" ||
    selectedGenres.length > 0 ||
    selectedMoods.length > 0 ||
    rating !== null ||
    imageFiles !== null;

  // 모달 오픈 상태
  const modalRef = useRef(null);
  useEffect(() => {
    if (isWriteModalOpen && modalRef.current) {
      modalRef.current.showModal();
    } else if (modalRef.current) {
      modalRef.current.close();
      setImageFiles(null);
    }
  }, [isWriteModalOpen]);

  // 외부 클릭
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      if (inProgress) {
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
    setIsModalOpen(false);
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

  const [isFormCompleted, setIsFormCompleted] = useState(false);
  useEffect(() => {
    if (!isWritingModalOpen && isFormCompleted) {
      setSelectedGenres([]);
      setSelectedMoods([]);
      setIsFormCompleted(false);
    }
  }, [isWritingModalOpen, isFormCompleted]);

  const handleStopWriting = () => {
    if (inProgress) {
      setIsStopModalOpen(true);
    } else {
      resetForm();
      setIsWritingModalOpen(false);
      closeWriteModal();
      setIsFormCompleted(true);
    }
  };

  // 이미지 삭제
  const handleDeleteImage = (indexToRemove) => {
    if (!imageFiles || Object.keys(imageFiles).length === 0) return null;
    const dataTransfer = new DataTransfer();
    const files = Array.from(imageFiles);
    // 선택된 인덱스를 제외한 나머지 파일들을 새로운 FileList에 추가
    files.forEach((file, index) => {
      if (index !== indexToRemove) {
        dataTransfer.items.add(file);
      }
    });

    const newFileList = dataTransfer.files;
    setImageFiles(newFileList);

    if (newFileList.length === 0) {
      setImageFiles(null);
    }
  };

  // 이미지 추가
  const handleImageUpload = (e) => {
    if (!imageFiles) {
      // 처음 파일을 추가하는 경우
      setImageFiles(e.target.files);
    } else {
      // 기존 파일이 있는 경우, 새로운 FileList를 기존 파일과 합치기
      const newFiles = Array.from(e.target.files);
      const existingFiles = Array.from(imageFiles);
      // FileList 객체를 생성하기 위해 DataTransfer 사용
      const dataTransfer = new DataTransfer();
      // 기존 파일과 새 파일을 모두 추가
      [...existingFiles, ...newFiles].forEach((file) => {
        dataTransfer.items.add(file);
      });
      setImageFiles(dataTransfer.files);
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
        const buttonRect = tagButtonRef.current.getBoundingClientRect();
        const position = {
          position: "absolute",
          top: `${buttonRect.bottom + window.scrollY}px`,
          left: `${buttonRect.left + window.scrollX}px`,
          zIndex: "10",
        };

        setTagModalStyle(position);
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
        const buttonRect = moodButtonRef.current.getBoundingClientRect();
        const position = {
          position: "absolute",
          top: `${buttonRect.bottom + window.scrollY + 5}px`,
          left: `${buttonRect.left + window.scrollX - 8}px`,
          zIndex: "10",
        };

        setMoodModalStyle(position);
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
    if (imageFiles?.length > 0) {
      Array.from(imageFiles).forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      setIsLoading(true);
      const response = await fetchWithAuth("/api/post/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const postId = result.postId;
        location.href = `/${user.userId}?post=${postId}`;
        closeWriteModal();
        resetForm();
      } else {
        alert("게시글 작성 실패");
      }
    } catch (error) {
      console.error("에러", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isWriteModalOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isWriteModalOpen]);

  useEffect(() => {
    if (isWritingModalOpen) {
      resetForm();
    }
  }, [isWritingModalOpen]);

  if (!user) {
    return null;
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
            alt={`${userName}님의 프로필 사진`}
          />
          <p className={styles["user-name"]}>
            {userName}
            <span className={styles["user-id"]}>@{userId}</span>
          </p>
        </div>

        <button onClick={handleStopWriting} className={styles["btn-close"]}>
          <Image src="/images/close.svg" width={40} height={40} alt="닫기" />
        </button>

        <form
          id="new-post-form"
          className={styles["new-post-form"]}
          onSubmit={handleSubmit}
        >
          <div id={styles["title"]}>
            <label
              id="title-input"
              className={styles["title-input"]}
              htmlFor="title"
            >
              Title
              <input
                type="text"
                id="title"
                placeholder={`${year}년 ${month}월 ${date}일 꿈 일기`}
                onChange={handleTitleChange}
                value={inputValue}
              />
            </label>
            <label id="hidden" className={styles["hidden"]} htmlFor="hidden">
              <input
                type="checkbox"
                id="hidden"
                checked={isPrivate}
                onChange={() => setIsPrivate((prev) => !prev)}
              />
              비공개
            </label>
          </div>

          <div className={styles["write-field"]}>
            <div className={styles["write-field-opt"]}>
              <div className={styles["genre-picker"]}>
                <button type="button" onClick={openModal} ref={tagButtonRef}>
                  <Image
                    src="/images/plus-circle.svg"
                    width={28}
                    height={28}
                    alt="태그 추가하기"
                  />
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
                    ref={moodButtonRef}
                  ></button>
                )}
                {selectedMoods.length !== 0 && (
                  <button
                    type="button"
                    className={styles["btn-feeling-selected"]}
                    onClick={openMoodModal}
                    ref={moodButtonRef}
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
              <div className={styles["image-uploader"]}>
                <label>
                  <div className={styles["btn-upload"]}>이미지 추가하기</div>
                  <input
                    type="file"
                    accept="image/*"
                    id={styles["file"]}
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
            <span className={styles["break-line"]}></span>
            <p className={styles["text-field-area"]}>
              <span className="sr-only">글 작성</span>
              <textarea
                placeholder="오늘은 어떤 꿈을 꾸셨나요?"
                className={`${styles["text-field-area"]} ${imageFiles && styles["has-image"]}`}
                onChange={handleContentChange}
                value={contentValue}
              />
              <section className={styles["image-preview-field"]}>
                {imageFiles &&
                  Array.from(imageFiles).map((img, index) => (
                    <div key={index} className={styles["image-container"]}>
                      <button
                        type="button"
                        className={styles["image-delete"]}
                        onClick={() => handleDeleteImage(index)}
                      >
                        <Image
                          src="/images/close.svg"
                          width={30}
                          height={30}
                          alt="이미지 삭제"
                        />
                      </button>
                      <Image
                        src={URL.createObjectURL(img)}
                        width={100}
                        height={100}
                        alt={`이미지${index}`}
                        className={styles["preview-image"]}
                      />
                    </div>
                  ))}
              </section>
            </p>
          </div>
          <div className={styles["btn-submit-area"]}>
            {isLoading ? (
              <Loading type="miniCircle" />
            ) : (
              <button
                type="submit"
                form="new-post-form"
                className={styles["btn-submit"]}
              >
                전송
              </button>
            )}
          </div>
        </form>
        <HashtagModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          onConfirm={(selected) => setSelectedGenres(selected)}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          ref={tagModalRef}
          style={tagModalStyle}
        />
        <MoodModal
          isModalOpen={isMoodModalOpen}
          closeModal={closeMoodModal}
          onConfirm={(selected) => setSelectedMoods(selected)}
          selectedMoods={selectedMoods}
          setSelectedMoods={setSelectedMoods}
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
