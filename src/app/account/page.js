"use client";

import { Button, ButtonLink, WithdrawModal } from "@/components/Controls";
import Loading from "@/components/Loading";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import { useState, useEffect } from "react";
import styles from "./Account.module.css";

export default function Account() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [via, setVia] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await fetchWithAuth("/api/auth/verify");
        const data = await response.json();
        setEmail(data.email);
        setUserId(data.userId);
        setUserName(data.userName);
        setVia(data.via);
      } catch (error) {
        console.error("Error fetching account info:", error);
      }

      setIsLoading(false);
    };

    fetchAccountInfo();
  }, []);

  if (isLoading) return <Loading type="full" />;

  return (
    <>
      <main className={styles["container"]}>
        <header className={styles["header"]}>
          <h1 className={styles["title"]}>계정 설정</h1>
        </header>

        <section className={styles["section"]}>
          <h2 className={styles["section-title"]}>계정 정보</h2>
          <dl className={styles["info-list"]}>
            <dt className={styles["info-label"]}>이메일</dt>
            <dd className={styles["info-value"]}>{email}</dd>
            <dt className={styles["info-label"]}>아이디</dt>
            <dd className={styles["info-value"]}>{userId}</dd>
            <dt className={styles["info-label"]}>사용자 이름</dt>
            <dd className={styles["info-value"]}>{userName}</dd>
            <dt className={styles["info-label"]}>계정 유형</dt>
            <dd className={styles["info-value"]}>
              {via === "google.com" ? "Google 계정" : "이메일 계정"}
            </dd>
          </dl>
        </section>

        <section className={styles["section"]}>
          <h2 className={styles["section-title"]}>계정 관리</h2>
          <div className={styles["button-group"]}>
            <ButtonLink
              disabled={via === "password" ? false : true}
              href="/account/modify-email"
              className={styles["button"]}
            >
              이메일 변경
            </ButtonLink>
            <ButtonLink
              disabled={via === "password" ? false : true}
              href="/account/modify-password"
              className={styles["button"]}
            >
              비밀번호 변경
            </ButtonLink>
          </div>
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className={styles["delete-button"]}
          >
            회원 탈퇴
          </button>
        </section>
      </main>
      {isWithdrawModalOpen && (
        <WithdrawModal
          isOpen={isWithdrawModalOpen}
          closeModal={() => setIsWithdrawModalOpen(false)}
          userId={userId}
        />
      )}
    </>
  );
}
