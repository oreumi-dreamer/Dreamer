"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./BasicInfoForm.module.css";

export default function BasicInfoForm({ onSubmit, formData, setters }) {
  const { userId, userName, year, month, day } = formData;
  const { setUserId, setUserName, setYear, setMonth, setDay } = setters;
  const [lastDay, setLastDay] = useState(31);

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
        e.target.classList.add(styles.invalid);
      } else {
        e.target.classList.remove(styles.invalid);
      }
    }

    if (type === "userName") {
      if (value.length < 2 || value.length > 20) {
        e.target.classList.add(styles.invalid);
      } else {
        e.target.classList.remove(styles.invalid);
      }
    }
  };

  const todayYear = new Date().getFullYear();

  return (
    <form
      id="signupFormFirst"
      noValidate
      onSubmit={onSubmit}
      className={styles["signup-form"]}
    >
      <p>안녕하세요! 드리머가 되신것을 환영합니다.</p>
      <p>시작하기에 앞서, 궁금한게 있어요. 당신에 대해 알려주세요!</p>

      <fieldset>
        <legend className="sr-only">기본 정보</legend>

        <div className="form-field">
          <label htmlFor="userId">아이디</label>
          <input
            type="text"
            id="userId"
            onChange={(e) => preventBlank(e, setUserId)}
            onBlur={(e) => validationItem(e, "userId")}
            value={userId}
            required
          />
        </div>
        {/* <span>아이디 양식을 맞춰주세요(아이디 형식 표기)</span> */}

        <div className="form-field">
          <label htmlFor="userName">이름</label>
          <input
            type="text"
            id="userName"
            onChange={(e) => setUserName(e.target.value)}
            onBlur={(e) => validationItem(e, "userName")}
            value={userName}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="birthDate">생일</label>
          <div className="input-wrapper">
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
            <input
              type="number"
              id="birthDay"
              name="birthDay"
              min="1"
              max={lastDay}
              value={day}
              onChange={(e) => {
                const value = Math.min(Math.max(1, e.target.value), 31);
                setDay(value);
              }}
              required
            />
            <span className="icon">일</span>
          </div>
        </div>

        <div>
          <p>이미 회원이신가요? 로그인하여 꿈을 공유해보세요!</p>
          <ul className={styles["login-buttons"]}>
            <li>
              <button type="button">
                <Image
                  src="/images/google-logo.svg"
                  width={40}
                  height={40}
                  alt="google 로그인"
                ></Image>
              </button>
            </li>
            <li>
              <button type="button">
                <Image
                  src="/images/mail.svg"
                  width={20}
                  height={20}
                  alt="이메일 로그인"
                ></Image>
              </button>
            </li>
          </ul>
        </div>
      </fieldset>

      <button type="submit">
        <span>다음</span>
        <img src="/arrow-icon.png" alt="" aria-hidden="true" />
      </button>
    </form>
  );
}
