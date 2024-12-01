"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import styles from "./page.module.css";
import SocialLogin from "@/components/login/SocialLogin";
import { loginSuccess, logout } from "@/store/authSlice";

export default function Home() {
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

  return (
    <main className={styles.main}>
      <section className={styles.welcome}>
        <h1>환영합니다, {user.userName}님!</h1>
      </section>
    </main>
  );
}
