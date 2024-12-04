// ProfileEdit.module.css
"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./page.module.css";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";

const ProfileEditPage = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    year: "",
    month: "",
    day: "",
    bio: "",
    isPrivate: false,
    profileImage: null,
  });

  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetchWithAuth("/api/account/modify", {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "프로필 수정에 실패했습니다.");
      }

      setSuccess("프로필이 성공적으로 수정되었습니다!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>프로필 수정</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 아이디 입력 */}
          <section className={styles.inputGroup}>
            <label htmlFor="userId" className={styles.label}>
              아이디 *
            </label>
            <input
              id="userId"
              name="userId"
              className={styles.input}
              value={formData.userId}
              onChange={handleChange}
              required
              pattern="^[a-zA-Z0-9_]{4,20}$"
              title="4-20자의 영문, 숫자, 언더스코어만 사용 가능합니다."
            />
          </section>

          {/* 닉네임 입력 */}
          <section className={styles.inputGroup}>
            <label htmlFor="userName" className={styles.label}>
              닉네임 *
            </label>
            <input
              id="userName"
              name="userName"
              className={styles.input}
              value={formData.userName}
              onChange={handleChange}
              required
              maxLength={20}
            />
          </section>

          {/* 생년월일 입력 */}
          <section className={styles.inputGroup}>
            <label className={styles.label}>생년월일</label>
            <div className={styles.dateInputs}>
              <input
                type="number"
                name="year"
                className={styles.input}
                placeholder="연도"
                value={formData.year}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
              />
              <input
                type="number"
                name="month"
                className={styles.input}
                placeholder="월"
                value={formData.month}
                onChange={handleChange}
                min="1"
                max="12"
              />
              <input
                type="number"
                name="day"
                className={styles.input}
                placeholder="일"
                value={formData.day}
                onChange={handleChange}
                min="1"
                max="31"
              />
            </div>
          </section>

          {/* 프로필 이미지 업로드 */}
          <section className={styles.inputGroup}>
            <label htmlFor="profileImage" className={styles.label}>
              프로필 이미지
            </label>
            <input
              type="file"
              id="profileImage"
              className={styles.fileInput}
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="프로필 이미지 미리보기" />
              </div>
            )}
          </section>

          {/* 소개글 입력 */}
          <section className={styles.inputGroup}>
            <label htmlFor="bio" className={styles.label}>
              소개글
            </label>
            <textarea
              id="bio"
              name="bio"
              className={styles.textarea}
              value={formData.bio}
              onChange={handleChange}
              maxLength={200}
              rows={4}
            />
          </section>

          {/* 비공개 계정 설정 */}
          <section className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
                className={styles.checkbox}
              />
              비공개 계정
            </label>
          </section>

          {/* 에러 메시지 */}
          {error && <div className={styles.error}>{error}</div>}

          {/* 성공 메시지 */}
          {success && <div className={styles.success}>{success}</div>}

          {/* 제출 버튼 */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "수정 중..." : "프로필 수정하기"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ProfileEditPage;
