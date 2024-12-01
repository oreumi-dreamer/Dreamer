"use client";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/");
      } else {
        throw new Error("로그아웃 중 오류 발생");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  handleLogout();

  return null;
}
