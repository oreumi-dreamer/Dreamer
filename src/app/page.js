"use client";

import { useSelector } from "react-redux";
import styles from "./page.module.css";
import SocialLogin from "@/components/login/SocialLogin";
import Link from "next/link";
import MainList from "@/components/main/MainList";

export default function Home() {
  const { user, isRegistrationComplete } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <>
        <main className={styles.main}>
          <h1>
            <Link href="/">
              <img src="/images/logo-full.svg" width={600} alt="Dreamer" />
            </Link>
          </h1>
          <SocialLogin />
        </main>
      </>
    );
  }

  if (!isRegistrationComplete) {
    return null;
  }

  return <MainList />;
}
