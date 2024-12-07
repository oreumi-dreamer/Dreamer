import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import { useState, useEffect } from "react";
import { Button, ButtonLabel, Input, Textarea } from "../Controls";

export default function ProfileEdit({
  profile,
  setProfile,
  setIsEdit,
  styles,
}) {
  const today = new Date();
  const todayYear = today.getFullYear();
  const [userName, setUserName] = useState(profile.name);
  const [userId, setUserId] = useState(profile.id);
  const [bio, setBio] = useState(profile.bio);
  const [year, setYear] = useState(todayYear);
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());
  const [lastDay, setLastDay] = useState(31);
  const [isPrivate, setIsPrivate] = useState(profile.isPrivate);

  const [newImage, setNewImage] = useState(null);

  const handleNewImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // year나 month가 변경될 때마다 해당 월의 마지막 날짜를 계산
  useEffect(() => {
    if (year && month) {
      const newLastDay = new Date(year, month, 0).getDate();
      setLastDay(newLastDay);

      // 현재 선택된 day가 새로운 lastDay보다 크다면 day를 lastDay로 조정
      if (day > newLastDay) {
        setDay(newLastDay);
      }
    }
  }, [year, month]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let body = {};
    if (newImage) {
      body = {
        userId,
        userName,
        year,
        month,
        day,
        profileImage: newImage,
        bio,
        isPrivate,
      };
    } else {
      body = {
        userId,
        userName,
        year,
        month,
        day,
        bio,
        isPrivate,
      };
    }

    // API 호출
    try {
      const res = await fetchWithAuth("/api/account/modify", {
        method: "PUT",
        body: body,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "프로필 수정에 실패했습니다.");
      }

      alert("프로필이 성공적으로 수정되었습니다!"); // 임시로 alert를 사용함
      if (newImage) {
        setProfile({
          ...profile,
          name: userName,
          id: userId,
          bio,
          isPrivate,
          profileImageUrl: newImage,
        });
      } else {
        setProfile({
          ...profile,
          name: userName,
          id: userId,
          bio,
          isPrivate,
        });
      }
      setIsEdit(false);
    } catch (err) {
      alert(err.message); // 임시로 alert를 사용함
    }
  };

  return (
    <article className={styles["profile-wrap"]}>
      <h2 className="sr-only">프로필 편집</h2>
      <form onSubmit={handleSubmit} className={styles["profile-form"]}>
        <fieldset className={styles["profile-form-pic"]}>
          <img
            src={
              newImage
                ? newImage
                : profile.profileImageUrl
                  ? profile.profileImageUrl
                  : "/images/rabbit.svg"
            }
            className={styles["profile-image"]}
            width={160}
            height={160}
            alt={profile.name + "님의 프로필 이미지"}
          />
          <ButtonLabel highlight={true}>
            사진 변경
            <input type="file" accept="image/*" onChange={handleNewImage} />
          </ButtonLabel>
        </fieldset>
        <fieldset className={styles["profile-form-info"]}>
          <label>
            이름
            <Input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </label>
          <label>
            아이디
            <Input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </label>
          <label className={styles["relative"]}>
            한줄소개
            <Textarea
              value={bio}
              maxLength={40}
              onChange={(e) => setBio(e.target.value)}
            />
            <span className={styles["char-limits"]}>{bio.length}/40</span>
          </label>
          <label htmlFor="year">
            생년월일
            <div>
              <select
                id="year"
                name="year"
                onChange={(e) => setYear(e.target.value)}
                value={year}
              >
                {Array.from({ length: 120 }, (_, i) => (
                  <option key={`year-${todayYear - i}`} value={todayYear - i}>
                    {todayYear - i}년
                  </option>
                ))}
              </select>
              <select
                id="month"
                name="month"
                onChange={(e) => setMonth(e.target.value)}
                value={month}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={`month-${i + 1}`} value={i + 1}>
                    {i + 1}월
                  </option>
                ))}
              </select>
              <select
                id="day"
                name="day"
                onChange={(e) => setDay(e.target.value)}
                value={day}
              >
                {Array.from({ length: lastDay }, (_, i) => (
                  <option key={`day-${i + 1}`} value={i + 1}>
                    {i + 1}일
                  </option>
                ))}
              </select>
              <label>
                <input
                  type="checkbox"
                  value={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.value)}
                />
                비공개
              </label>
            </div>
          </label>
          <div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setIsEdit(false);
              }}
            >
              취소
            </Button>
            <Button type="submit" highlight={true}>
              수정 완료
            </Button>
          </div>
        </fieldset>
      </form>
    </article>
  );
}
