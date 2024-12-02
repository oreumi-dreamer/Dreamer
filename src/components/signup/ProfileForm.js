"use client";

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

  return (
    <form id="signupFormSecond" noValidate onSubmit={onSubmit}>
      <p>WELCOME DREAMER!</p>
      <p>마지막 단계예요!</p>

      <fieldset>
        <legend>프로필 정보</legend>

        <div className="form-field">
          <label htmlFor="profileImage">프로필 사진</label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="bio">한 줄 소개글</label>
          <input
            type="text"
            id="bio"
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            required
          />
        </div>

        <div className="form-field">
          <label>다크 모드 설정</label>
          <div className="input-wrapper">
            <input
              type="radio"
              name="theme"
              id="deviceMode"
              value="deviceMode"
              onChange={(e) => setTheme(e.target.value)}
              checked={theme === "deviceMode"}
            />
            <label htmlFor="deviceMode">기기 설정 사용</label>

            <input
              type="radio"
              name="theme"
              id="light"
              value="light"
              onChange={(e) => setTheme(e.target.value)}
              checked={theme === "light"}
            />
            <label htmlFor="light">라이트 모드</label>

            <input
              type="radio"
              name="theme"
              id="dark"
              value="dark"
              onChange={(e) => setTheme(e.target.value)}
              checked={theme === "dark"}
            />
            <label htmlFor="dark">다크 모드</label>
          </div>
        </div>
      </fieldset>

      <div className="buttons">
        <button type="button" onClick={onPrevious}>
          <span>이전</span>
        </button>
        <button type="button" onClick={onSkip}>
          <span>나중에 할게요</span>
        </button>
        <button type="submit">
          <span>다음</span>
        </button>
      </div>
    </form>
  );
}
