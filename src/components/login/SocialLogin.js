"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "@/store/authSlice";

export default function SocialLogin() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { idToken } = useSelector((state) => state.auth);

  const checkUserExists = async (idToken) => {
    if (!idToken) {
      return { result: "no token" };
    }

    try {
      const res = await fetch("/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const result = await res.json();

      if (res.status === 401) {
        return;
      }

      const { exists } = result;

      console.log(result);

      const user = {
        uid: result.uid,
        email: result.email,
        userName: result.userName,
      };

      dispatch(loginSuccess({ user, token: idToken }));

      if (!exists) {
        return false;
      }
    } catch (error) {
      console.error("User verification error:", error);
    }

    return true;
  };

  useEffect(() => {
    const checkUser = async () => {
      const result = await checkUserExists(idToken);
      if (result === false) {
        router.push("/signup");
      }
    };

    checkUser();
  }, [router, idToken]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const refreshToken = result.user.refreshToken;
      const idToken = await result.user.getIdToken();

      // 1. 먼저 리프레시 토큰을 쿠키에 저장
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

      // 2. ID 토큰을 Redux에 저장
      dispatch(
        loginSuccess({
          user: {
            uid: result.user.uid,
            email: result.user.email,
          },
          token: idToken,
        })
      );

      // 3. 사용자 존재 여부 확인
      const exists = await checkUserExists(idToken);

      // 4. 결과에 따라 리다이렉트
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
          <p>환영합니다, {user.userName}님!</p>
          <button onClick={handleLogout} className="logoutButton" type="button">
            로그아웃
          </button>
        </div>
      )}
    </section>
  );
}
