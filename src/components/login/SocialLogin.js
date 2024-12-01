"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

export default function SocialLogin() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const checkUserExists = async () => {
    try {
      const res = await fetch("/api/auth/verify", {
        method: "GET",
        credentials: "include",
      });

      const result = await res.json();

      if (res.status === 401) {
        return;
      }

      const { exists } = result;

      if (!exists) {
        router.push("/signup");
      }
    } catch (error) {
      console.error("User verification error:", error);
    }
  };

  useEffect(() => {
    checkUserExists();
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const uid = result.user.uid;
      const token = await result.user.getIdToken();

      // 1. 먼저 토큰을 쿠키에 저장
      const tokenRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!tokenRes.ok) {
        throw new Error("토큰 쿠키 저장 중 오류 발생");
      }

      // 2. 사용자 존재 여부 확인
      const userRes = await fetch("/api/auth/verify", {
        method: "GET",
        credentials: "include",
      });

      const { exists } = await userRes.json();

      setUser(result.user);
      setError("");

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

  const handleLogout = async () => {
    try {
      await signOut(auth);

      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);
      setError("");
      router.push("/");
    } catch (error) {
      setError("로그아웃 중 오류가 발생했습니다.");
      console.error("Logout error:", error);
    }
  };

  return (
    <section className="loginContainer">
      {error && (
        <p role="alert" className="errorMessage">
          {error}
        </p>
      )}

      {!user ? (
        <button
          onClick={handleGoogleLogin}
          className="loginButton"
          type="button"
        >
          Google로 로그인
        </button>
      ) : (
        <div>
          <p>환영합니다, {user.displayName}님!</p>
          <button onClick={handleLogout} className="logoutButton" type="button">
            로그아웃
          </button>
        </div>
      )}
    </section>
  );
}
