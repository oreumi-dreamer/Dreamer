"use client";
import Image from "next/image";
import styles from "./ProfileForm.module.css";
import { handleClickWithKeyboard } from "../Controls";

export default function ProfileForm({
  onSubmit,
  onPrevious,
  formData,
  setters,
  onSkip,
}) {
  const { profileImage, bio, theme } = formData;
  const { setProfileImage, setBio, setTheme } = setters;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일을 base64로 변환
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // base64 문자열 저장
      };
      reader.readAsDataURL(file);
    }
  };
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    localStorage.setItem("userTheme", e.target.value);
  };
  return (
    <form
      id="signupFormSecond"
      noValidate
      onSubmit={onSubmit}
      className={styles["profile-form"]}
    >
      <p>WELCOME DREAMER!</p>
      <p>마지막 단계예요!</p>

      <fieldset className={styles["signup-fieldset"]}>
        <legend className="sr-only">프로필 정보</legend>

        <div className={styles["form-field"]}>
          <p htmlFor="profileImage">프로필 사진</p>
          <span>1920px*1920px 이하의 JPG 혹은 PNG 권장</span>
          <label
            htmlFor="profileImage"
            tabIndex={0}
            onKeyDown={handleClickWithKeyboard}
            role="button"
          >
            파일 첨부
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            tabIndex={-1}
          />
          <Image
            src={profileImage ? profileImage : "/images/rabbit.svg"}
            width={140}
            height={140}
            alt="프로필 사진"
            unoptimized
          />
          {profileImage && (
            <button
              type="button"
              onClick={() => setProfileImage(null)}
              className={styles["image-delete"]}
            >
              <Image
                src="images/close.svg"
                width={20}
                height={20}
                alt="이미지 제거"
              />
            </button>
          )}
        </div>

        <div className={styles["form-field"]}>
          <label htmlFor="bio">한줄소개</label>
          <textarea
            type="text"
            id="bio"
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            maxLength={40}
            required
          />
          <span>{bio.length}/40</span>
        </div>

        <div className={styles["form-field"]}>
          <label>다크 모드 설정</label>
          <div className={styles["dark-mode"]}>
            <input
              type="radio"
              name="theme"
              id="deviceMode"
              value="deviceMode"
              onChange={handleThemeChange}
              checked={theme === "deviceMode"}
              tabIndex={-1}
            />
            <label
              htmlFor="deviceMode"
              tabIndex={0}
              onKeyDown={handleClickWithKeyboard}
              role="button"
            >
              기기 설정 사용
            </label>

            <input
              type="radio"
              name="theme"
              id="light"
              value="light"
              onChange={handleThemeChange}
              checked={theme === "light"}
              tabIndex={-1}
            />
            <label
              htmlFor="light"
              tabIndex={0}
              onKeyDown={handleClickWithKeyboard}
              role="button"
            >
              라이트 모드
            </label>

            <input
              type="radio"
              name="theme"
              id="dark"
              value="dark"
              onChange={handleThemeChange}
              checked={theme === "dark"}
              tabIndex={-1}
            />
            <label
              htmlFor="dark"
              tabIndex={0}
              onKeyDown={handleClickWithKeyboard}
              role="button"
            >
              다크 모드
            </label>
          </div>
        </div>
      </fieldset>

      <div className={styles.buttons}>
        <button type="button" onClick={onPrevious}>
          이전
        </button>
        <button type="button" onClick={onSkip}>
          다음에 하기
        </button>
        <button type="submit" disabled={bio === ""}>
          다음
        </button>
      </div>
    </form>
  );
}
