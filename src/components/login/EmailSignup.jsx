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
import Loading from "../Loading";

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
  const [isEmailSentBtnClicked, setIsEmailSentBtnClicked] = useState(false);
  const [isCodeBtnClicked, setIsCodeBtnClicked] = useState(false);
  const [isSubmitBtnClicked, setIsSubmitBtnClicked] = useState(false);
  const [emailInfo, setEmailInfo] = useState("");
  const [codeInfo, setCodeInfo] = useState("");
  const [emailProcess, setEmailProcess] = useState("코드 발송");
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
    if (isEmailVerified) {
      return;
    }

    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown, isEmailVerified]);

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

    setIsEmailSentBtnClicked(true);
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
      setEmailInfo("인증 코드가 이메일로 발송되었습니다.");
    } catch (error) {
      console.error("인증 코드 발송 오류:", error);
      setEmailInfo(
        "인증 코드 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
      setEmailProcess("재시도");
      dispatch(resetRegistering());
    } finally {
      setIsEmailSentBtnClicked(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setCodeInfo("");
    if (!verificationCode) {
      setCodeInfo("인증 코드를 입력해주세요.");
      return;
    }

    setIsCodeBtnClicked(true);
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
      setEmailInfo("이메일 인증이 완료되었습니다.");
      dispatch(resetRegistering());
    } catch (error) {
      console.error("인증 코드 확인 오류:", error);
      setCodeInfo(error.message);
    } finally {
      setIsCodeBtnClicked(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitBtnClicked(true);
    if (!isEmailVerified) {
      setError("이메일 인증을 먼저 완료해주세요.");
      setIsSubmitBtnClicked(false);
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함하고 6자 이상이어야 합니다."
      );
      setIsSubmitBtnClicked(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setIsSubmitBtnClicked(false);
      return;
    }

    let verifiedEmailAddress;

    try {
      const response = await fetch(`/api/auth/check-email-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "인증 코드 확인 실패");
      }

      if (!data.verified) {
        setError(
          "이메일 인증 과정에서 오류가 발생했습니다. 다시 시도해주세요."
        );
        return;
      } else {
        verifiedEmailAddress = data.email;
      }
    } catch (error) {
      console.error("이메일 인증 확인 오류:", error);
      setError("이메일 인증 확인 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsSubmitBtnClicked(false);
      return;
    }

    try {
      dispatch(setRegistering());

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        verifiedEmailAddress,
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
      setIsSubmitBtnClicked(false);
      dispatch(resetRegistering());
    }
  };

  return (
    <LoginForm className={styles["email-signup"]} onSubmit={handleSignup}>
      <fieldset>
        <div className={styles["input-container"]}>
          <label htmlFor="email">이메일</label>
          <div className={styles["input-group"]}>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSendVerificationCode(e)
              }
              disabled={isEmailVerified}
              required
              className={styles["email-input"]}
            />
            <Button
              type="button"
              disabled={(isEmailSent && countdown > 0) || isEmailVerified}
              className={styles["email-verify-btn"]}
              onClick={handleSendVerificationCode}
            >
              {isEmailSentBtnClicked ? (
                <Loading type="miniCircle" />
              ) : isEmailVerified ? (
                "인증 완료"
              ) : countdown > 0 ? (
                `재발송 ${countdown}초`
              ) : isEmailSent ? (
                "재발송"
              ) : (
                emailProcess
              )}
            </Button>
          </div>
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
            <div className={styles["input-group"]}>
              <Input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyCode(e)}
                maxLength={6}
                placeholder="6자리 숫자 입력"
                className={styles["code-input"]}
              />
              <Button
                className={styles["code-verify-btn"]}
                type="button"
                onClick={handleVerifyCode}
              >
                {isCodeBtnClicked ? <Loading type="miniCircle" /> : "확인"}
              </Button>
            </div>
            <img
              src={
                isEmailVerified ? "/images/valid.svg" : "/images/invalid.svg"
              }
              width={40}
              height={40}
              alt={isEmailVerified ? "인증된 이메일" : "인증되지 않은 이메일"}
            />
            <span className={styles["invalid-text"]}>{codeInfo}</span>
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
      </fieldset>
      <div className={styles["next-btn-row"]}>
        {error && <p className={styles["error-message"]}>{error}</p>}

        <Button
          type="submit"
          highlight={true}
          disabled={
            !isEmailVerified ||
            !isPasswordValid ||
            !isConfirmPasswordValid ||
            isSubmitBtnClicked
          }
          className={styles["next-btn"]}
        >
          {isSubmitBtnClicked ? <Loading type="miniCircle" /> : "가입하기"}
        </Button>
      </div>
    </LoginForm>
  );
}
