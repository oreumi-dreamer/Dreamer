import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import { useState, useEffect } from "react";
import {
  Button,
  ButtonLabel,
  Checkbox,
  Input,
  Select,
  Textarea,
} from "../Controls";
import { useRouter } from "next/navigation";
import { loginSuccess } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import useTheme from "@/hooks/styling/useTheme";
import Loading from "../Loading";

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

  const birthDate = new Date(profile.birthDate);

  const [year, setYear] = useState(birthDate.getFullYear());
  const [month, setMonth] = useState(birthDate.getMonth() + 1);
  const [day, setDay] = useState(birthDate.getDate());
  const [lastDay, setLastDay] = useState(31);
  const [isPrivate, setIsPrivate] = useState(profile.isPrivate);

  const [newImage, setNewImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

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

  useEffect(() => {
    setProfile((pervProfile) => ({
      ...pervProfile,
      isPrivate: isPrivate,
    }));
  }, [isPrivate, setProfile]);

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
      setIsLoading(true);
      const res = await fetchWithAuth("/api/account/modify", {
        method: "PUT",
        body: body,
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error(data.message || "프로필 수정에 실패했습니다.");
      }
      // Redux 상태 업데이트
      dispatch(
        loginSuccess({
          user: {
            userId: userId,
            userName: userName,
            bio: bio,
            profileImageUrl: data.profileImageUrl,
            isPrivate: isPrivate,
          },
        })
      );

      // alert("프로필이 성공적으로 수정되었습니다!"); // 임시로 alert를 사용함
      if (newImage) {
        setProfile({
          ...profile,
          name: userName,
          id: userId,
          bio,
          isPrivate: isPrivate,
          birthDate: new Date(year, month - 1, day),
          profileImageUrl: newImage,
        });
      } else {
        setProfile({
          ...profile,
          name: userName,
          id: userId,
          bio,
          isPrivate: isPrivate,
          birthDate: new Date(year, month - 1, day),
        });
      }
      setIsEdit(false);
      location.href = `/users/${userId}`;
    } catch (err) {
      alert(err.message); // 임시로 alert를 사용함
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className={styles["edit-profile-wrap"]}>
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
            width={150}
            height={150}
            alt={profile.name + "님의 프로필 이미지"}
          />
          <ButtonLabel highlight={true}>
            사진 변경
            <input type="file" accept="image/*" onChange={handleNewImage} />
          </ButtonLabel>
        </fieldset>
        <fieldset className={styles["profile-form-info"]}>
          <label className={styles["relative"]}>
            이름
            <Input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              minLength={2}
              maxLength={20}
            />
            <span className={styles["char-limits"]}>{userName.length}/20</span>
          </label>
          <label className={styles["relative"]}>
            아이디
            <Input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              minLength={4}
              maxLength={20}
            />
            <span className={styles["char-limits"]}>{userId.length}/20</span>
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
          <div className={styles["profile-form-birthdates"]}>
            <label htmlFor="" className={styles["profile-form-birthdate"]}>
              생년월일
              <div>
                <Select
                  type="ProfileEdit"
                  id="year"
                  name="year"
                  onChange={(e) => setYear(e.target.value)}
                  value={year}
                  options={Array.from({ length: 120 }, (_, i) => ({
                    value: todayYear - i,
                    label: `${todayYear - i}년`,
                  }))}
                />
                <Select
                  type="ProfileEdit"
                  id="month"
                  name="month"
                  onChange={(e) => setMonth(e.target.value)}
                  value={month}
                  options={Array.from({ length: 12 }, (_, i) => ({
                    value: i + 1,
                    label: `${i + 1}월`,
                  }))}
                />
                <Select
                  type="ProfileEdit"
                  id="day"
                  name="day"
                  onChange={(e) => setDay(e.target.value)}
                  value={day}
                  options={Array.from({ length: lastDay }, (_, i) => ({
                    value: i + 1,
                    label: `${i + 1}일`,
                  }))}
                />
                <Checkbox
                  type="col"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                >
                  비공개
                </Checkbox>
              </div>
            </label>
          </div>
          <div className={styles["form-btn-row"]}>
            {isLoading ? (
              <button type="button">
                <Loading type="miniCircle" className={styles["loading"]} />
              </button>
            ) : (
              <>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEdit(false);
                  }}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  highlight={true}
                  disabled={userName.length < 2 || userId.length < 4}
                >
                  수정 완료
                </Button>
              </>
            )}
          </div>
        </fieldset>
      </form>
    </article>
  );
}
