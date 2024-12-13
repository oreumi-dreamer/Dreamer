// 디버그 용 게시글 수정 페이지

"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { DREAM_GENRES, DREAM_MOODS } from "@/utils/constants";
import styles from "../page.module.css";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";

export default function EditPost({ params }) {
  const { postId } = params;

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [genres, setGenres] = useState([]);
  const [moods, setMoods] = useState([]);
  const [rating, setRating] = useState(3);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null);

  // 기존 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetchWithAuth(`/api/post/search/${postId}`);
        const data = await response.json();

        const post = data.post; // 이 부분이 추가됨

        if (!response.ok) {
          throw new Error(data.error);
        }

        // null 체크를 추가하여 안전하게 데이터 설정
        setTitle(post.title || "");
        setContent(post.content || "");
        setGenres(post.dreamGenres || []);
        setMoods(post.dreamMoods || []);
        setRating(post.dreamRating || 3);
        setIsPrivate(Boolean(post.isPrivate));
        setExistingImages(post.imageUrls || []);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

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

  const handleRemoveImage = (imageUrl) => {
    setExistingImages((prev) => prev.filter((url) => url !== imageUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("genres", JSON.stringify(genres));
      formData.append("moods", JSON.stringify(moods));
      formData.append("rating", rating);
      formData.append("isPrivate", isPrivate);
      formData.append("remainingImages", JSON.stringify(existingImages));

      if (selectedFiles) {
        Array.from(selectedFiles).forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await fetchWithAuth(`/api/post/update/${postId}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "게시글 수정에 실패했습니다.");
      }

      alert("게시글이 수정되었습니다.");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 로딩 중이거나 에러가 있을 때의 처리를 추가
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러가 발생했습니다: {error}</div>;
  }

  return (
    <main className={styles.container}>
      <h1>게시글 수정</h1>
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
          {existingImages?.length > 0 && (
            <div>
              <p>기존 이미지:</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {existingImages.map((url, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img src={url} alt="" width={100} height={100} />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(url)}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <label>
            {existingImages?.length > 0 ? "새 이미지 추가:" : "이미지 업로드:"}
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
                  checked={genres?.includes(genre.id) || false}
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
                  checked={moods?.includes(mood.id) || false}
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
          {isLoading ? "게시글 수정 중..." : "게시글 수정"}
        </button>
      </form>
    </main>
  );
}
