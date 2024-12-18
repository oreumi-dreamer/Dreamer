"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase";
import {
  signInWithPopup,
  isSignInWithEmailLink,
  signInWithEmailLink,
  onAuthStateChanged,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { checkUserExists } from "@/utils/auth/checkUser";
import styles from "./page.module.css";
import EmailSignup from "@/components/login/EmailSignup";

export default function Join() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { user: reduxUser } = useSelector((state) => state.auth);

  // 이메일 링크 인증 처리
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const emailParam = searchParams.get("email");
      if (emailParam) {
        setEmail(emailParam);
        // 새 창에서는 별도의 UI 표시
        if (window.opener) {
          setShowSignupForm(false);
        } else {
          // 원래 창에서는 회원가입 폼 표시
          setShowSignupForm(true);
        }
      }
    } else {
      setShowSignupForm(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const checkUser = async () => {
      if (!reduxUser) return;

      const exists = await checkUserExists(dispatch);
      if (exists === false && !showSignupForm) {
        // router.push("/signup");
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
  }, [router, dispatch, showSignupForm, reduxUser]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken(true);

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

      const exists = await checkUserExists(dispatch);

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

  return (
    <>
      <main className={styles.main}>
        <h1>
          <a href="/">
            <img src="/images/logo-full.svg" width={600} alt="Dreamer" />
          </a>
        </h1>
        <section className={styles["login-container"]}>
          <>
            <h2 className={styles["login-title"]}>회원가입</h2>
            <p>새로운 드리머가 되어 당신이 꾼 꿈을 알려주세요!</p>
            <EmailSignup
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              setShowSignupForm={setShowSignupForm}
              error={error}
              setError={setError}
              checkUserExists={checkUserExists}
              handleGoogleLogin={handleGoogleLogin}
            />
          </>
        </section>
      </main>
    </>
  );
}
