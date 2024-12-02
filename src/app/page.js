"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import styles from "./page.module.css";
import SocialLogin from "@/components/login/SocialLogin";
import Loading from "@/components/Loading";

export default function Home() {
  const router = useRouter();
  const { user, isRegistrationComplete } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && !isRegistrationComplete) {
      router.push("/signup");
    }
    setIsLoading(false);
  }, [user, router]);

  if (isLoading) {
    return <Loading />;
  }

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

  if (!isRegistrationComplete) {
    return <Loading />;
  }

  return (
    <main className={styles.main}>
      <section className={styles.welcome}>
        <h1>환영합니다, {user.userName}님!</h1>
      </section>
    </main>
  );
}
