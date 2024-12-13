"use client";

import { useSelector } from "react-redux";
import styles from "./page.module.css";
import SocialLogin from "@/components/login/SocialLogin";
import Header from "@/components/header/Header";
import Link from "next/link";
import Footer from "@/components/footer/Footer";
import MainList from "@/components/main/MainList";
import { CustomScrollbar } from "@/components/Controls";

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
          <SocialLogin className={styles.login} />
        </main>
      </>
    );
  }

  if (!isRegistrationComplete) {
    return null;
  }

  return (
    <div id="container" className={styles.container}>
      <Header />
      <MainList />
      <Footer />
      <CustomScrollbar />
    </div>
  );
}
