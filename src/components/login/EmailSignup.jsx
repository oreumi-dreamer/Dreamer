"use client";

import React, { useState, useEffect } from "react";
import { LoginForm } from "../Controls";
import { Button, Input } from "../Controls";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setRegistering, resetRegistering } from "@/store/authSlice";
import styles from "./EmailSignup.module.css";

export default function EmailSignup({
  email,
  setEmail,
  password,
  setPassword,
  setShowSignupForm,
  error,
  setError,
}) {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [tempUser, setTempUser] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  // 이메일 인증 상태 주기적 체크
  useEffect(() => {
    let intervalId;
    let retryCount = 0;
    const maxRetries = 5;

    if (isEmailSent && tempUser && !isEmailVerified) {
      intervalId = setInterval(async () => {
        try {
          await tempUser.reload();
          if (tempUser.emailVerified) {
            setIsEmailVerified(true);
            setError("이메일 인증이 완료되었습니다. 비밀번호를 입력해주세요.");
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error("이메일 확인 중 오류:", error);
          retryCount++;
          if (retryCount >= maxRetries) {
            clearInterval(intervalId);
            setError("이메일 확인 중 오류가 발생했습니다. 다시 시도해주세요.");
          }
        }
      }, 5000); // 5초
    }
    return () => intervalId && clearInterval(intervalId);
  }, [isEmailSent, tempUser]);

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    dispatch(setRegistering());

    try {
      const temporaryPassword = `Temp${Math.random().toString(36).slice(2)}!${Date.now()}`;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        temporaryPassword
      );
      const user = userCredential.user;
      setTempUser(user);
      await sendEmailVerification(user);
      setIsEmailSent(true);
      setError("인증 이메일이 발송되었습니다. 이메일을 확인해주세요.");
    } catch (error) {
      setError("이메일 인증 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("인증 오류:", error);
    }
  };

  // 유효성 검사 함수 추가
  const validatePassword = (password) => {
    const minLength = 6;
    const maxLength = 4096;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength =
      password.length >= minLength && password.length <= maxLength;

    return (
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      isValidLength
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      setError("이메일 인증을 먼저 완료해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함하고 6자 이상이어야 합니다."
      );
      return;
    }

    try {
      // 1. 임시 계정 삭제
      await tempUser.delete();

      // 2. 실제 계정 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken(true);

      // 3. 서버에 토큰 저장
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

      setError("계정이 생성되었습니다. 프로필 정보를 입력해주세요.");
      dispatch(resetRegistering());
      router.push("/signup"); // 프로필 설정 페이지로 이동
    } catch (error) {
      setError("회원가입 중 오류가 발생했습니다.");
      console.error("가입 오류:", error);
    }
  };

  return (
    <LoginForm className={styles["email-signup"]} onSubmit={handleSignup}>
      {error && (
        <p role="alert" className={styles["error-message"]}>
          {error}
        </p>
      )}
      <label>
        이메일
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isEmailSent}
          required
          className={styles["email-input"]}
        />
        {!isEmailVerified && (
          <Button
            type="button"
            disabled={isEmailSent}
            className={styles["email-verify-btn"]}
            onClick={(e) => handleEmailVerification(e)}
          >
            인증 메일 발송
          </Button>
        )}
      </label>

      {isEmailVerified && (
        <>
          <label>
            비밀번호
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label>
            비밀번호 재확인
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
        </>
      )}
      <div className={styles["btn-row"]}>
        {isEmailVerified && (
          <Button type="submit" highlight={true}>
            다음 단계로
          </Button>
        )}
        <Button
          type="button"
          onClick={() => setShowSignupForm(false)}
          className={styles["back-btn"]}
        >
          돌아가기
        </Button>
      </div>
    </LoginForm>
  );
}
