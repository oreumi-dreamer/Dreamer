"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import styles from "./page.module.css";
import SocialLogin from "@/components/login/SocialLogin";
import { loginSuccess, logout } from "@/store/authSlice";
import Loading from "@/components/Loading";

export default function Home() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <main className={styles.main}>
        <section className={styles.login}>
          <h1>로그인</h1>
          <SocialLogin />
        </section>
      </main>
    );
  }

  if (!user.isRegistrationComplete) {
    router.push("/signup");

    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <main className={styles.main}>
      <section className={styles.welcome}>
        <h1>환영합니다, {user.userName}님!</h1>
      </section>
    </main>
  );
}
