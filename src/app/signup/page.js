"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useSignupForm } from "@/hooks/signup/useSignupForm";
import { useSignupSubmit } from "@/hooks/signup/useSignupSubmit"; // 추가
import BasicInfoForm from "@/components/signup/BasicInfoForm";
import ProfileForm from "@/components/signup/ProfileForm";
import { validateFirstForm, validateSecondForm } from "@/utils/validation";
import Loading from "@/components/Loading";

export default function Signup() {
  const router = useRouter();

  const [process, setProcess] = useState(0);
  const [isJoined, setIsJoined] = useState(false);

  // 폼 상태들
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(1);
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [theme, setTheme] = useState("deviceMode");

  useEffect(() => {
    if (isJoined) {
      router.push("/");
    }
  }, [isJoined, router]);

  const formData = {
    userId,
    userName,
    year,
    month,
    day,
    profileImage,
    bio,
    theme,
  };

  const setters = {
    setUserId,
    setUserName,
    setYear,
    setMonth,
    setDay,
    setProfileImage,
    setBio,
    setTheme,
  };

  async function handleFirstFormSubmit(e) {
    e.preventDefault();
    const isValid = await validateFirstForm(e, styles);
    if (isValid) {
      setProcess(1);
    }
  }

  const { submitSignup } = useSignupSubmit();

  const handleSecondFormSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateSecondForm(e);

    if (isValid) {
      const success = await submitSignup({
        userId,
        userName,
        year,
        month,
        day,
        profileImage,
        bio,
        theme,
      });

      if (success) {
        setIsJoined(true);
      }
    }
  };

  async function handleSkipForm(e) {
    e.preventDefault();

    setProfileImage("");
    setBio("");
    setTheme("deviceMode");

    const success = await submitSignup({
      userId,
      userName,
      year,
      month,
      day,
      profileImage,
      bio,
      theme,
    });

    if (success) {
      setIsJoined(true);
    }
  }

  // 성공/실패 핸들러
  const handleSuccess = () => {
    setIsJoined(true);
  };

  const handleError = (error) => {
    // 에러 처리 로직
    console.error("회원가입 실패:", error);
  };

  // useSignupSubmit 훅 사용
  const { isLoading, error } = useSignupSubmit({
    process,
    formData,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  return (
    <>
      <header>
        <h1>Dreamer</h1>
      </header>
      <main>
        <h2 className="sr-only">회원 가입</h2>
        {isLoading && <div>처리중...</div>}
        {error && <div className={styles.error}>{error}</div>}
        {isJoined ? (
          <Loading />
        ) : (
          <>
            {process === 0 && (
              <BasicInfoForm
                onSubmit={handleFirstFormSubmit}
                formData={formData}
                setters={setters}
                styles={styles}
              />
            )}
            {process === 1 && (
              <ProfileForm
                onSubmit={handleSecondFormSubmit}
                onSkip={handleSkipForm}
                onPrevious={() => setProcess(0)}
                formData={formData}
                setters={setters}
                styles={styles}
              />
            )}
          </>
        )}
      </main>
    </>
  );
}
