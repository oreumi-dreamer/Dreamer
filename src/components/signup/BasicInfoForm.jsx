"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./BasicInfoForm.module.css";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { checkUserExists } from "@/utils/auth/checkUser";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Checkbox } from "../Controls";

export default function BasicInfoForm({ onSubmit, formData, setters }) {
  const { userId, userName, year, month, day } = formData;
  const { setUserId, setUserName, setYear, setMonth, setDay } = setters;
  const [lastDay, setLastDay] = useState(31);
  const [isIdValid, setIsIdValid] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const [isBirthValid, setIsBirthValid] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const router = useRouter();

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
    // 아이디, 이름, 생일 값이 각각 유효한경우 state 값을 true로 지정
    userId.length < 4 || userId.length > 20
      ? setIsIdValid(false)
      : setIsIdValid(true);

    userName.length < 2 || userName.length > 20
      ? setIsNameValid(false)
      : setIsNameValid(true);

    year !== 0 && month !== 0 && day !== 0
      ? setIsBirthValid(true)
      : setIsBirthValid(false);
  }, [year, month, day, userId, userName]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken(true);

      // 1. ID 토큰을 API로 전달하여 세션 토큰을 쿠키에 저장
      const tokenRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!tokenRes.ok) {
        throw new Error("토큰 쿠키 저장 중 오류 발생");
      }

      // 2. 사용자 존재 여부 확인
      const exists = await checkUserExists(dispatch);

      // 3. 결과에 따라 리다이렉트
      if (!exists) {
        alert("존재하지 않는 사용자 입니다. 회원가입을 이어서 진행해주세요!");
      }
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다.");
      console.error("Login error:", error);
    }
  };

  const preventBlank = (e, setState) => {
    if (e.target.value.includes(" ")) {
      e.target.value = e.target.value.trim();
    }
    setState(e.target.value);
  };

  const validationItem = (e, type) => {
    const value = e.target.value;

    if (type === "userId") {
      if (value.length < 4 || value.length > 20) {
        e.target.classList.add(`${styles.invalid}`);
      } else {
        e.target.classList.remove(`${styles.invalid}`);
      }
    }

    if (type === "userName") {
      if (value.length < 2 || value.length > 20) {
        e.target.classList.add(`${styles.invalid}`);
      } else {
        e.target.classList.remove(`${styles.invalid}`);
      }
    }
  };

  const handleSelectChange = (e) => {
    const yearData = e.currentTarget.children[0];
    const monthData = e.currentTarget.children[1];
    const dayData = e.currentTarget.children[2];

    if (dayData.value && !monthData.value && !yearData.value) {
      yearData.classList.add(`${styles.invalid}`);
      monthData.classList.add(`${styles.invalid}`);
    } else if (dayData.value === "0" && monthData.value && !yearData.value) {
      yearData.classList.add(`${styles.invalid}`);
      dayData.classList.add(`${styles.invalid}`);
    }

    if (dayData.value !== "0") {
      dayData.classList.remove(`${styles.invalid}`);
      dayData.classList.add(`${styles.selected}`);
    }
    if (monthData.value) {
      monthData.classList.remove(`${styles.invalid}`);
      monthData.classList.add(`${styles.selected}`);
    }
    if (yearData.value) {
      yearData.classList.remove(`${styles.invalid}`);
      yearData.classList.add(`${styles.selected}`);
    }
  };

  const todayYear = new Date().getFullYear();

  const handleAgree = () => {
    setIsAgree(!isAgree);
  };

  return (
    <form
      id="signupFormFirst"
      noValidate
      onSubmit={onSubmit}
      className={styles["signup-form"]}
    >
      <p>안녕하세요! 드리머가 되신것을 환영합니다.</p>
      <p>시작하기에 앞서, 궁금한게 있어요. 당신에 대해 알려주세요!</p>

      <fieldset className={styles["signup-fieldset"]}>
        <legend className="sr-only">기본 정보</legend>

        <div className={styles["form-field"]}>
          <label htmlFor="userId">
            <Image
              src={isIdValid ? "/images/valid.svg" : "/images/invalid.svg"}
              width={40}
              height={40}
              alt="유효하지 않은 아이디"
            />
            아이디
          </label>
          <input
            type="text"
            id="userId"
            onChange={(e) => preventBlank(e, setUserId)}
            onBlur={(e) => validationItem(e, "userId")}
            value={userId}
            required
          />
          <span className={styles["invalid-text"]}>
            {!isIdValid && "아이디는 4~20자로 입력해주세요."}
          </span>
        </div>

        <div className={styles["form-field"]}>
          <label htmlFor="userName">
            <Image
              src={isNameValid ? "/images/valid.svg" : "/images/invalid.svg"}
              width={40}
              height={40}
              alt="유효하지 않은 이름"
            />
            이름
          </label>
          <input
            type="text"
            id="userName"
            onChange={(e) => setUserName(e.target.value)}
            onBlur={(e) => validationItem(e, "userName")}
            value={userName}
            required
          />
          <span className={styles["invalid-text"]}>
            {!isNameValid && "이름은 2~20자로 입력해주세요."}
          </span>
        </div>

        <div className={styles["form-field"]}>
          <label htmlFor="birthDate">
            <Image
              src={isBirthValid ? "/images/valid.svg" : "/images/invalid.svg"}
              width={40}
              height={40}
              alt="유효하지 않은 생일"
            />
            생일
          </label>
          <div
            className={styles["input-wrapper"]}
            onChange={handleSelectChange}
          >
            <select
              id="birth-year"
              name="birthYear"
              onChange={(e) => setYear(e.target.value)}
              value={year}
              required
            >
              <option value="">연도</option>
              {Array.from({ length: 120 }, (_, i) => (
                <option key={`year-${todayYear - i}`} value={todayYear - i}>
                  {todayYear - i}년
                </option>
              ))}
            </select>
            <select
              id="birth-month"
              name="birthMonth"
              onChange={(e) => setMonth(e.target.value)}
              value={month}
              required
            >
              <option value="">월</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={`month-${i + 1}`} value={i + 1}>
                  {i + 1}월
                </option>
              ))}
            </select>
            <select
              id="birth-day"
              name="birthDay"
              onChange={(e) => {
                const value = Math.min(Math.max(1, e.target.value), 31);
                setDay(e.target.value);
              }}
              value={day}
              required
            >
              <option value="0">일</option>
              {Array.from({ length: lastDay }, (_, i) => (
                <option key={`day-${i + 1}`} value={i + 1}>
                  {i + 1}일
                </option>
              ))}
            </select>
          </div>
          <span className={styles["invalid-text"]}>
            {!isBirthValid && "생일은 필수 입력 값 입니다."}
          </span>
        </div>

        <div className={styles["form-field"]}>
          <Checkbox onChange={handleAgree}>
            <span>
              <a href="/terms" target="_blank">
                이용 약관{" "}
              </a>
              및{" "}
              <a href="/privacy" target="_blank">
                개인정보 처리방침
              </a>
              에 동의합니다.
            </span>
          </Checkbox>
        </div>

        <div className={styles["user-login-field"]}>
          <p>이미 회원이신가요? 로그인하여 꿈을 공유해보세요!</p>
          <ul className={styles["login-buttons"]}>
            <li>
              <button type="button" onClick={handleGoogleLogin}>
                <Image
                  src="/images/google-logo.svg"
                  width={40}
                  height={40}
                  alt="google 로그인"
                />
              </button>
            </li>
            <li>
              <button type="button" onClick={() => router.push("/logout")}>
                <Image
                  src="/images/mail.svg"
                  width={20}
                  height={20}
                  alt="이메일 로그인"
                />
              </button>
            </li>
          </ul>
        </div>
      </fieldset>

      <button
        type="submit"
        className={styles["next-btn"]}
        disabled={!isIdValid || !isNameValid || !isBirthValid || !isAgree}
      >
        다음
      </button>
    </form>
  );
}
