"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import styles from "./page.module.css";
import SocialLogin from "@/components/login/SocialLogin";
import { loginSuccess, logout } from "@/store/authSlice";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, idToken } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        if (!idToken) {
          setIsLoading(false);
          return;
        }

        const res = await fetch("/api/auth/verify", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("Verification failed");
        } else {
          const data = await res.json();

          if (data.exists) {
            dispatch(
              loginSuccess({
                user: {
                  uid: data.uid,
                  email: data.email,
                  userName: data.userName,
                },
                token: idToken,
              })
            );
          } else {
            console.log("User does not exist");
          }
        }
      } catch (error) {
        console.error("Login check error:", error);
      }

      setIsLoading(false);
    };

    checkLogin();
  }, [idToken]); // idToken이 변경될 때마다 체크

  if (isLoading) {
    return <p>로드 중</p>;
  }

  return user ? <p>환영합니다, {user.userName}님!</p> : <SocialLogin />;
}
