"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import styles from "./page.module.css";
import SocialLogin from "@/components/login/SocialLogin";
import Loading from "@/components/Loading";
import Header from "@/components/header/Header";
import Image from "next/image";
import Link from "next/link";
import PostModal from "@/components/modal/PostModal";
import Footer from "@/components/footer/Footer";

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
    return <Loading />;
  }

  return (
    <>
      <Header />
      <PostModal />
    </>
  );
}
