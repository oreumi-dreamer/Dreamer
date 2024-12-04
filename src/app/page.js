"use client";

import { useSelector } from "react-redux";
import styles from "./page.module.css";
import SocialLogin from "@/components/login/SocialLogin";
import Header from "@/components/header/Header";
import Image from "next/image";
import Link from "next/link";
import PostModal from "@/components/modal/PostModal";
import Footer from "@/components/footer/Footer";

export default function Home() {
  const { user, isRegistrationComplete } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <h1>
            <Link href="/">
              <Image
                src="/images/logo-full.svg"
                width={800}
                height={340}
              ></Image>
            </Link>
          </h1>
          <SocialLogin className={styles.login} />
        </main>
        <Footer />
      </>
    );
  }

  if (!isRegistrationComplete) {
    return null;
  }

  return (
    <>
      <Header />
      <PostModal />
    </>
  );
}
