"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/store/authSlice";
import { checkUserExists } from "@/utils/auth/checkUser";

export default function SocialLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { idToken } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkUser = async () => {
      const exists = await checkUserExists(idToken, dispatch);
      if (exists === false) {
        router.push("/signup");
      }
    };

    checkUser();
  }, [router, idToken, dispatch]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const refreshToken = result.user.refreshToken;
      const idToken = await result.user.getIdToken();

      // 1. 리프레시 토큰을 쿠키에 저장
      const tokenRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: refreshToken }),
      });

      if (!tokenRes.ok) {
        throw new Error("토큰 쿠키 저장 중 오류 발생");
      }

      // 2. 사용자 존재 여부 확인
      const exists = await checkUserExists(idToken, dispatch);

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

      <button onClick={handleGoogleLogin} className="loginButton" type="button">
        Google로 로그인
      </button>
    </section>
  );
}
