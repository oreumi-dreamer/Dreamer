"use client";

import { useState } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

export default function SocialLogin() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        throw new Error("토큰 쿠키 저장 중 오류 발생");
      }

      setUser(result.user);
      setError("");
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
