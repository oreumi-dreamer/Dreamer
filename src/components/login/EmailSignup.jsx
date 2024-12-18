"use client";

import React, { useState, useEffect } from "react";
import { LoginForm } from "../Controls";
import { Button, Input } from "../Controls";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  deleteUser,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  updatePassword,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  setRegistering,
  resetRegistering,
  setEmailVerified,
} from "@/store/authSlice";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isWaitingVerification, setIsWaitingVerification] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);

  const dispatch = useDispatch();

  const actionCodeSettings = {
    url: `${window.location.origin}/join/verify-email?email=${encodeURIComponent(email)}`,
    handleCodeInApp: true,
  };

  useEffect(() => {
    const handleEmailVerification = async () => {
      // 새 창인지 확인 (window.opener가 있으면 새 창)
      const isPopup = window.opener;

      if (isSignInWithEmailLink(auth, window.location.href)) {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const emailFromUrl = urlParams.get("email");

          if (!emailFromUrl) {
            setError("이메일 정보를 찾을 수 없습니다. 다시 시도해주세요.");
            return;
          }

          if (auth.currentUser) {
            await auth.signOut();
          }

          await signInWithEmailLink(auth, emailFromUrl, window.location.href);

          if (isPopup) {
            // 새 창인 경우
            window.localStorage.setItem("verifiedEmail", emailFromUrl);
            window.localStorage.setItem("emailVerified", "true");
            setError(
              "이메일 인증이 완료되었습니다. 원래 창에서 비밀번호를 입력해주세요."
            );
            window.close();
          } else {
            // 원래 창인 경우
            setEmail(emailFromUrl);
            setIsEmailVerified(true);
            setIsEmailSent(true);
            setError("이메일 인증이 완료되었습니다. 비밀번호를 입력해주세요.");
          }
        } catch (error) {
          console.error("이메일 링크 인증 오류:", error);
          handleVerificationError(error);
        }
      }
    };

    handleEmailVerification();
  }, []);

  // 원래 창에서 주기적으로 인증 상태 체크
  useEffect(() => {
    if (!isEmailVerified) {
      const checkVerification = async () => {
        try {
          const response = await fetch("/api/auth/verify-email");
          const data = await response.json();

          if (data.verified && data.email === email) {
            setIsEmailVerified(true);
            dispatch(setEmailVerified(true));
            setIsEmailSent(true);
            setError("이메일 인증이 완료되었습니다. 비밀번호를 입력해주세요.");
          }
        } catch (error) {
          console.error("Verification check error:", error);
        }
      };

      const interval = setInterval(checkVerification, 2000);
      return () => clearInterval(interval);
    }
  }, [email, isEmailVerified]);

  const handleVerificationError = (error) => {
    if (error.code === "auth/invalid-action-code") {
      setError("유효하지 않은 인증 링크입니다. 다시 시도해주세요.");
    } else if (error.code === "auth/invalid-email") {
      setError("이메일 정보가 올바르지 않습니다. 다시 시도해주세요.");
    } else {
      setError("인증 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
    setIsEmailSent(false);
  };

  useEffect(() => {
    setIsPasswordValid(validatePassword(password));
    setIsConfirmPasswordValid(
      validatePassword(confirmPassword) && confirmPassword === password
    );
  }, [password, confirmPassword]);

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

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    try {
      // 이메일 인증 시작할 때 isRegistering 설정
      dispatch(setRegistering());

      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.exists) {
        setError("이미 가입된 이메일입니다. 로그인을 시도해주세요.");
        setShowSignupForm(false);
        dispatch(resetRegistering()); // 에러시 상태 초기화
        return;
      }

      if (auth.currentUser) {
        await auth.signOut();
      }

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setIsEmailSent(true);
      setIsWaitingVerification(true);
      setError("인증 이메일이 발송되었습니다. 이메일을 확인해주세요.");
    } catch (error) {
      console.error("인증 오류:", error);
      setError("이메일 인증 중 오류가 발생했습니다. 다시 시도해주세요.");
      dispatch(resetRegistering());
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
      // 현재 인증된 사용자가 있는지 확인
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("인증 세션이 만료되었습니다. 다시 시도해주세요.");
        return;
      }

      // 비밀번호 업데이트
      await updatePassword(currentUser, password);

      const idToken = await currentUser.getIdToken(true);

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
      window.location.href = "/signup";
    } catch (error) {
      console.error("가입 오류:", error);
      if (error.code === "auth/requires-recent-login") {
        setError("인증이 만료되었습니다. 다시 인증을 진행해주세요.");
        // 필요한 경우 여기서 재인증 로직 추가
      } else {
        setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
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
          onChange={(e) => setEmail(e.target.value)}
          disabled={isEmailSent}
          required
          className={styles["email-input"]}
        />

        <Button
          type="button"
          disabled={isEmailSent}
          className={styles["email-verify-btn"]}
          onClick={(e) => handleEmailVerification(e)}
        >
          {isEmailVerified ? "인증 완료" : "인증 메일 발송"}
        </Button>

        <img
          src={isEmailVerified ? "/images/valid.svg" : "/images/invalid.svg"}
          width={40}
          height={40}
          alt={isEmailVerified ? "유효한 이메일" : "유효하지 않은 이메일"}
        />
        <span className={styles["invalid-text"]}>
          {isPasswordValid
            ? ""
            : error
              ? error
              : "유효한 이메일을 입력해주세요."}
        </span>
      </div>
      {/* {isWaitingVerification ? (
        <p className={styles["check-your-email"]}>
          이제 이 창을 닫으셔도 됩니다.
          <br />
          발송된 메일을 확인하여 가입 절차를 마저 진행해주세요.
        </p>
      ) : ( */}
      <>
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
              isConfirmPasswordValid
                ? "/images/valid.svg"
                : "/images/invalid.svg"
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
      </>
      {/* )} */}

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
        다음
      </Button>
    </LoginForm>
  );
}
