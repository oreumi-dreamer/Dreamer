"use client";

import { useState, useEffect } from "react";
import styles from "./BasicInfoForm.module.css";
import { useRouter } from "next/navigation";
import { Checkbox, Select } from "../Controls";

export default function BasicInfoForm({ onSubmit, formData, setters }) {
  const { userId, userName, year, month, day } = formData;
  const { setUserId, setUserName, setYear, setMonth, setDay } = setters;
  const [lastDay, setLastDay] = useState(31);
  const [isIdValid, setIsIdValid] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const [isBirthValid, setIsBirthValid] = useState(false);
  const [isAgree, setIsAgree] = useState(false);

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
    const idPattern = /^[a-z0-9]{4,20}$/;
    !idPattern.test(userId) ? setIsIdValid(false) : setIsIdValid(true);

    userName.length < 2 || userName.length > 20
      ? setIsNameValid(false)
      : setIsNameValid(true);

    year !== 0 && month !== 0 && day !== 0
      ? setIsBirthValid(true)
      : setIsBirthValid(false);
  }, [year, month, day, userId, userName]);

  const preventBlank = (e, setState) => {
    if (e.target.value.includes(" ")) {
      e.target.value = e.target.value.trim();
    }
    setState(e.target.value);
  };

  const validationItem = (e, type) => {
    const valid = e.target.validity.valid;
    const inputClass = e.target.classList;

    if (type === "userId") {
      if (!valid) {
        inputClass.add(`${styles.invalid}`);
      } else {
        inputClass.remove(`${styles.invalid}`);
      }
    }

    if (type === "userName") {
      if (!valid) {
        inputClass.add(`${styles.invalid}`);
      } else {
        inputClass.remove(`${styles.invalid}`);
      }
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
            <img
              src={isIdValid ? "/images/valid.svg" : "/images/invalid.svg"}
              width={40}
              height={40}
              alt={isIdValid ? "유효한 아이디" : "유효하지 않은 아이디"}
            />
            아이디
          </label>
          <input
            type="text"
            id="userId"
            onChange={(e) => preventBlank(e, setUserId)}
            onBlur={(e) => validationItem(e, "userId")}
            value={userId}
            minLength={4}
            maxLength={20}
            pattern="^[a-z0-9]+$"
            required
          />
          <span className={styles["invalid-text"]}>
            {!isIdValid &&
              "아이디는 4~20자의 영문 소문자와 숫자로 입력해주세요."}
          </span>
        </div>

        <div className={styles["form-field"]}>
          <label htmlFor="userName">
            <img
              src={isNameValid ? "/images/valid.svg" : "/images/invalid.svg"}
              width={40}
              height={40}
              alt={isNameValid ? "유효한 이름" : "유효하지 않은 이름"}
            />
            이름
          </label>
          <input
            type="text"
            id="userName"
            onChange={(e) => setUserName(e.target.value)}
            onBlur={(e) => validationItem(e, "userName")}
            value={userName}
            minLength={2}
            maxLength={20}
            required
          />
          <span className={styles["invalid-text"]}>
            {!isNameValid && "이름은 2~20자로 입력해주세요."}
          </span>
        </div>

        <div className={styles["form-field"]}>
          <label htmlFor="birthDate">
            <img
              src={isBirthValid ? "/images/valid.svg" : "/images/invalid.svg"}
              width={40}
              height={40}
              alt={isBirthValid ? "유효한 생일" : "유효하지 않은 생일"}
            />
            생일
          </label>
          <div className={styles["input-wrapper"]}>
            <Select
              id="birth-year"
              name="birthYear"
              onChange={(e) => setYear(e.target.value)}
              value={year}
              required
              options={Array.from({ length: 120 }, (_, i) => ({
                value: todayYear - i,
                label: `${todayYear - i}년`,
              }))}
              placeholder="년"
              className={
                (year === 0 && month !== 0) || (year === 0 && day !== 0)
                  ? styles.invalid
                  : ""
              }
            />
            <Select
              id="birth-month"
              name="birthMonth"
              onChange={(e) => setMonth(e.target.value)}
              value={month}
              options={Array.from({ length: 12 }, (_, i) => ({
                value: i + 1,
                label: `${i + 1}월`,
              }))}
              placeholder="월"
              className={month === 0 && day !== 0 ? styles.invalid : ""}
            />
            <Select
              id="birth-day"
              name="birthDay"
              onChange={(e) => setDay(e.target.value)}
              value={day}
              options={Array.from({ length: lastDay }, (_, i) => ({
                value: i + 1,
                label: `${i + 1}일`,
              }))}
              placeholder="일"
              className={
                day === 0 && month !== 0 && year === 0 ? styles.invalid : ""
              }
            />
          </div>
          <span className={styles["invalid-text"]}>
            {!isBirthValid && "생일은 필수 입력 값 입니다."}
          </span>
        </div>

        <div className={`${styles["form-field"]} ${styles["agree"]}`}>
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
      </fieldset>
      <button
        type="button"
        onClick={() => router.push("/logout")}
        className={styles["main-btn"]}
      >
        메인으로 돌아가기
      </button>
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
