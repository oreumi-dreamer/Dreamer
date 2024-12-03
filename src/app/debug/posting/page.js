"use client";

import { useState } from "react";
import { useSelector } from "react-redux";

import { DREAM_GENRES, DREAM_MOODS } from "@/utils/constants";

import styles from "./page.module.css";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [genres, setGenres] = useState([]);
  const [moods, setMoods] = useState([]);
  const [rating, setRating] = useState(3);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenreChange = (genre) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleMoodChange = (mood) => {
    setMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // FormData 객체 생성
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("genres", JSON.stringify(genres));
      formData.append("moods", JSON.stringify(moods));
      formData.append("rating", rating);
      formData.append("isPrivate", isPrivate);

      if (selectedFiles) {
        Array.from(selectedFiles).forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await fetchWithAuth("/api/post/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "게시글 작성에 실패했습니다.");
      }

      alert("게시글이 작성되었습니다.");
      // 성공 후 리디렉션 처리
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1>새 게시글 작성</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.section}>
          <label>
            제목:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={styles.inputText}
            />
          </label>
          <label>
            내용:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className={styles.textarea}
            />
          </label>
        </section>

        <section className={styles.section}>
          <label>
            이미지:
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSelectedFiles(e.target.files)}
              className={styles.fileInput}
            />
          </label>
        </section>

        <section className={styles.section}>
          <fieldset className={styles.fieldset}>
            <legend>꿈의 장르 (복수 선택 가능)</legend>
            {DREAM_GENRES.map((genre) => (
              <label key={genre.id} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={genres.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                />
                {genre.text}
              </label>
            ))}
          </fieldset>
        </section>

        <section className={styles.section}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              꿈의 느낌 (복수 선택 가능)
            </legend>
            {DREAM_MOODS.map((mood) => (
              <label key={mood.id} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={moods.includes(mood.id)}
                  onChange={() => handleMoodChange(mood.id)}
                />
                {mood.text}
              </label>
            ))}
          </fieldset>
        </section>

        <section className={styles.section}>
          <label>
            꿈의 별점:
            <input
              type="range"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className={styles.range}
            />
            <span>{rating}점</span>
          </label>
        </section>

        <section className={styles.section}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            비공개
          </label>
        </section>

        <button
          type="submit"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? "게시글 작성 중..." : "게시글 작성"}
        </button>
      </form>
    </main>
  );
}
