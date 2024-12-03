"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/store/authSlice";
import { checkUserExists } from "@/utils/auth/checkUser";
import styles from "./SocialLogin.module.css";

export default function SocialLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkUser = async () => {
      if (!user) return;

      const exists = await checkUserExists(dispatch);
      if (exists === false) {
        router.push("/signup");
      }
    };

    checkUser();
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

  return (
    <section className="loginContainer">
      {error && (
        <p role="alert" className="errorMessage">
          {error}
        </p>
      )}

      <ul className={styles["login-buttons"]}>
        <li>
          <button onClick={handleGoogleLogin} type="button">
            Google로 로그인
          </button>
        </li>
        <li>
          <button>이메일로 로그인</button>
        </li>
      </ul>
    </section>
  );
}
