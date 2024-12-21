"use client";

import React, { useState, useEffect } from "react";
import { LoginForm } from "../Controls";
import { Button, Input } from "../Controls";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useDispatch } from "react-redux";
import { setRegistering, resetRegistering } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import styles from "./EmailSignup.module.css";

export default function EmailSignup({
  email,
  setEmail,
  password,
  setPassword,
  setShowSignupForm,
  error,
  setError,
  handleGoogleLogin,
}) {
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailInfo, setEmailInfo] = useState("");
  const [emailProcess, setEmailProcess] = useState("인증 코드 발송");
  const [countdown, setCountdown] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsPasswordValid(validatePassword(password));
    setIsConfirmPasswordValid(
      validatePassword(confirmPassword) && confirmPassword === password
    );
  }, [password, confirmPassword]);

  // 카운트다운 효과
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

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

  const handleEmailChange = (e) => {
    setEmailInfo("");
    setEmail(e.target.value);
  };

  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    setEmailInfo("");

    if (!email) {
      setError("이메일을 입력해주세요.");
      setEmailInfo("이메일을 입력해주세요.");
      return;
    }

    try {
      dispatch(setRegistering());

      // 이메일 중복 체크
      const checkResponse = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const checkData = await checkResponse.json();

      if (checkData.exists) {
        setError("이미 가입된 이메일입니다. 로그인을 시도해주세요.");
        setEmailInfo("이미 가입된 이메일입니다. 로그인을 시도해주세요.");

        setShowSignupForm(false);
        dispatch(resetRegistering());
        return;
      }

      setEmailProcess("발송 중...");
      // 인증 코드 발송
      const response = await fetch("/api/auth/send-email-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "인증 코드 발송 실패");
      }

      setIsEmailSent(true);
      setCountdown(60); // 1분 카운트다운 시작
      setError("인증 코드가 이메일로 발송되었습니다.");
    } catch (error) {
      console.error("인증 코드 발송 오류:", error);
      setError(
        "인증 코드 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
      setEmailInfo(
        "인증 코드 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
      dispatch(resetRegistering());
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      setError("인증 코드를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/auth/check-email-verification", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "인증 코드 확인 실패");
      }

      setIsEmailVerified(true);
      setError("이메일 인증이 완료되었습니다.");
      dispatch(resetRegistering());
    } catch (error) {
      console.error("인증 코드 확인 오류:", error);
      setError(error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      setError("이메일 인증을 먼저 완료해주세요.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함하고 6자 이상이어야 합니다."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      dispatch(setRegistering());

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const idToken = await userCredential.user.getIdToken(true);

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
      setEmailInfo("");
      dispatch(resetRegistering());
      window.location.href = "/signup";
    } catch (error) {
      console.error("가입 오류:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("이미 사용 중인 이메일입니다.");
      } else {
        setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      dispatch(resetRegistering());
    }
  };

  return (
    <LoginForm className={styles["email-signup"]} onSubmit={handleSignup}>
      <div className={styles["input-container"]}>
        <label htmlFor="email">이메일</label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          disabled={isEmailVerified}
          required
          className={styles["email-input"]}
        />
        <Button
          type="button"
          disabled={isEmailSent && countdown > 0}
          className={styles["email-verify-btn"]}
          onClick={handleSendVerificationCode}
        >
          {isEmailVerified
            ? "인증 완료"
            : countdown > 0
              ? `재발송 ${countdown}초`
              : isEmailSent
                ? "재발송"
                : emailProcess}
        </Button>
        <img
          src={isEmailVerified ? "/images/valid.svg" : "/images/invalid.svg"}
          width={40}
          height={40}
          alt={isEmailVerified ? "인증된 이메일" : "인증되지 않은 이메일"}
        />
        <span className={styles["invalid-text"]}>{emailInfo}</span>
      </div>

      {isEmailSent && !isEmailVerified && (
        <div className={styles["input-container"]}>
          <label htmlFor="verificationCode">인증번호</label>
          <Input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            placeholder="6자리 숫자 입력"
            className={styles["code-input"]}
          />
          <Button
            className={styles["code-verify-btn"]}
            type="button"
            onClick={handleVerifyCode}
          >
            확인
          </Button>
          <img
            src={isEmailVerified ? "/images/valid.svg" : "/images/invalid.svg"}
            width={40}
            height={40}
            alt={isEmailVerified ? "인증된 이메일" : "인증되지 않은 이메일"}
          />
        </div>
      )}

      <div className={styles["input-container"]}>
        <label htmlFor="password">비밀번호</label>
        <Input
          type="password"
          id="password"
          value={password}
          onBlur={(e) => {
            validatePassword(e.target.value)
              ? e.target.classList.remove(styles.invalid)
              : e.target.classList.add(styles.invalid);
          }}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!isEmailVerified}
          required
        />
        <img
          src={isPasswordValid ? "/images/valid.svg" : "/images/invalid.svg"}
          width={40}
          height={40}
          alt={isPasswordValid ? "유효한 비밀번호" : "유효하지 않은 비밀번호"}
        />
        <span className={styles["invalid-text"]}>
          {isPasswordValid
            ? ""
            : "비밀번호는 6자 이상, 영문 대,소문자, 숫자, 특수문자를 포함해주세요"}
        </span>
      </div>

      <div className={styles["input-container"]}>
        <label htmlFor="confirmPassword">비밀번호 재확인</label>
        <Input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onBlur={(e) => {
            validatePassword(e.target.value) && confirmPassword === password
              ? e.target.classList.remove(styles.invalid)
              : e.target.classList.add(styles.invalid);
          }}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={!isEmailVerified}
          required
        />
        <img
          src={
            isConfirmPasswordValid ? "/images/valid.svg" : "/images/invalid.svg"
          }
          width={40}
          height={40}
          alt={
            isConfirmPasswordValid
              ? "유효한 비밀번호 재확인"
              : "유효하지 않은 비밀번호 재확인"
          }
        />
        <span className={styles["invalid-text"]}>
          {confirmPassword === "" || isConfirmPasswordValid
            ? ""
            : "비밀번호가 일치하지 않습니다."}
        </span>
      </div>

      <div className={styles["user-login-field"]}>
        <p>이미 회원이신가요? 로그인하여 꿈을 공유해보세요!</p>
        <ul className={styles["login-buttons"]}>
          <li>
            <button type="button" onClick={handleGoogleLogin}>
              <img
                src="/images/google-logo.svg"
                width={40}
                height={40}
                alt="google 로그인"
              />
            </button>
          </li>
          <li className={styles["email-login-button"]}>
            <button
              type="button"
              onClick={() => {
                setEmail("");
                setPassword("");
                setError("");
                setIsEmailSent(false);
                setShowSignupForm(false);
                router.push("/");
              }}
            >
              <img
                src="/images/mail.svg"
                width={20}
                height={20}
                alt="이메일 로그인"
              />
            </button>
          </li>
        </ul>
      </div>

      <Button
        type="submit"
        highlight={true}
        disabled={
          !isEmailVerified || !isPasswordValid || !isConfirmPasswordValid
        }
        className={styles["next-btn"]}
      >
        가입하기
      </Button>
    </LoginForm>
  );
}
