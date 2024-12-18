// app/join/verify-email/page.js
"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setEmailVerified } from "@/store/authSlice";

export default function VerifyEmail() {
  const [status, setStatus] = useState("verifying");
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyEmail = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const email = urlParams.get("email");

          if (!email) {
            setStatus("error");
            return;
          }

          if (auth.currentUser) {
            await auth.signOut();
          }

          await signInWithEmailLink(auth, email, window.location.href);

          // 인증 상태 저장
          await fetch("/api/auth/verify-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              status: true,
            }),
          });
          dispatch(setEmailVerified(true));
          setStatus("success");
        } catch (error) {
          console.error("Verification error:", error);
          setStatus("error");
        }
      }
    };

    verifyEmail();
  }, []);

  return (
    <div>
      {status === "verifying" && <p>이메일 인증을 처리하고 있습니다...</p>}
      {status === "success" && (
        <div>
          <h1>이메일 인증이 완료되었습니다!</h1>
          <p>원래 창으로 돌아가서 회원가입을 계속 진행해주세요.</p>
        </div>
      )}
      {status === "error" && (
        <p>인증 처리 중 오류가 발생했습니다. 다시 시도해주세요.</p>
      )}
    </div>
  );
}
