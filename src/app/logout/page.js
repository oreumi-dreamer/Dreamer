"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout, resetRegistrationComplete } from "@/store/authSlice";
import { persistor } from "@/store/store";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Loading from "@/components/Loading";

export default function Logout() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Firebase 로그아웃
      await signOut(auth);

      // API 로그아웃 및 쿠키 초기화
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        // Redux state 초기화
        dispatch(logout());
        dispatch(resetRegistrationComplete());
        // Redux Persist storage 초기화
        await persistor.purge();

        // 상태 초기화 후 리다이렉트
        router.push("/");
      } else {
        throw new Error("로그아웃 중 오류 발생");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return <Loading />;
}
