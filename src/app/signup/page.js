"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useSignupSubmit } from "@/hooks/signup/useSignupSubmit";
import BasicInfoForm from "@/components/signup/BasicInfoForm";
import ProfileForm from "@/components/signup/ProfileForm";
import { validateFirstForm, validateSecondForm } from "@/utils/validation";
import Loading from "@/components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { checkUserExists } from "@/utils/auth/checkUser";
import SignupHeader from "@/components/signup/SignupHeader";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";

export default function Signup() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [process, setProcess] = useState(0);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetchWithAuth("/api/auth/verify");
        const result = await res.json();

        if (result.exists === true || !result.uid) {
          router.push("/");
        }
        setIsLoading(false); // 체크 완료 후 로딩 상태 해제
      } catch (error) {
        console.error("Auth check error:", error);
        setIsLoading(false); // 에러 발생시에도 로딩 상태 해제
      }
    };

    checkAuth();
  }, [user, router, dispatch]);

  // 회원가입 완료 시 홈으로 이동
  useEffect(() => {
    if (isJoined) {
      router.push("/");
    }
  }, [isJoined, router]);

  // 폼 상태들
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(0);
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [theme, setTheme] = useState("deviceMode");

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
    const isValid = await validateFirstForm(e);
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
  const { error } = useSignupSubmit({
    process,
    formData,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  return (
    <main className={styles["signup-main"]}>
      <SignupHeader />
      <h2 className="sr-only">회원 가입</h2>
      {isLoading && <Loading type="small" />}
      {error && <div className={styles.error}>{error}</div>}
      {isJoined ? (
        <Loading type="small" />
      ) : (
        <>
          {process === 0 && (
            <BasicInfoForm
              onSubmit={handleFirstFormSubmit}
              formData={formData}
              setters={setters}
            />
          )}
          {process === 1 && (
            <ProfileForm
              onSubmit={handleSecondFormSubmit}
              onSkip={handleSkipForm}
              onPrevious={() => {
                setProcess(0);
              }}
              formData={formData}
              setters={setters}
            />
          )}
        </>
      )}
    </main>
  );
}
