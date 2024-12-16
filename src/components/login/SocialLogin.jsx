"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/store/authSlice";
import { checkUserExists } from "@/utils/auth/checkUser";
import { Button, Form, Input, LoginForm } from "../Controls";
import styles from "./SocialLogin.module.css";
import EmailSignup from "./EmailSignup";

export default function SocialLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { user: reduxUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkUser = async () => {
      if (!reduxUser) return;

      const exists = await checkUserExists(dispatch);
      if (exists === false && !showSignupForm) {
        router.push("/signup");
      } else if (!reduxUser.emailVerified) {
        setError("이메일 인증이 필요합니다. 이메일을 확인하세요.");
      } else {
        router.push("/");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        checkUser();
      }
    });

    return () => unsubscribe();
  }, [router, dispatch]);

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
        router.push("/signup");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다.");
      console.error("Login error:", error);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken(true);

      // ID 토큰을 API로 전달하여 세션 토큰을 쿠키에 저장
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

      // 사용자 존재 여부 확인
      const exists = await checkUserExists(dispatch);

      // 결과에 따라 리다이렉트
      // 이메일 회원가입 중인 경우는 리다이렉션하지 않음
      if (exists === false && !showSignupForm) {
        router.push("/signup");
      } else if (!reduxUser.emailVerified && !showSignupForm) {
        setError("이메일 인증이 필요합니다. 이메일을 확인하세요.");
      } else if (exists && reduxUser.emailVerified && !showSignupForm) {
        router.push("/");
      }
    } catch (error) {
      setError("이메일 로그인 중 오류가 발생했습니다.");
      console.error("Email login error:", error);
    }
  };

  return (
    <section className={styles["login-container"]}>
      {showEmailForm && !showSignupForm ? (
        <>
          <h2>이메일로 로그인</h2>
          <LoginForm
            onSubmit={handleEmailLogin}
            className={styles["login-form"]}
          >
            {error && (
              <p role="alert" className={styles["error-message"]}>
                {error}
              </p>
            )}
            <label>
              이메일
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              비밀번호
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <Button type="submit" highlight={true}>
              로그인
            </Button>
            <div className={styles["join-button"]}>
              <p>회원이 아니신가요?</p>
              <Button type="button" onClick={() => setShowSignupForm(true)}>
                가입하기
              </Button>
            </div>
            <Button
              type="button"
              onClick={() => setShowEmailForm(false)}
              className={styles["back-btn"]}
            >
              돌아가기
            </Button>
          </LoginForm>
        </>
      ) : showSignupForm ? (
        <>
          <h2>회원가입</h2>
          <EmailSignup
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            setShowSignupForm={setShowSignupForm}
            error={error}
            setError={setError}
            checkUserExists={checkUserExists}
          />
        </>
      ) : (
        <>
          <h2 className="sr-only">로그인</h2>
          <ul className={styles["login-buttons"]}>
            <li>
              <button onClick={handleGoogleLogin} type="button">
                <img src="/images/google-logo.svg" alt="" srcset="" />
                Google로 로그인
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setShowEmailForm(true)}>
                <img src="/images/mail.svg" alt="" srcset="" />
                이메일로 로그인
              </button>
            </li>
          </ul>
        </>
      )}
    </section>
  );
}
