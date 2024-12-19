"use client";

import { useState } from "react";
import { Button, Input } from "@/components/Controls";
import styles from "./ModifyEmail.module.css";
import { verifyPassword } from "@/utils/auth/verifyPassword";
import { updateEmail } from "@/utils/auth/updateEmail";
import Loading from "@/components/Loading";

export default function ModifyEmail() {
  const [password, setPassword] = useState("");
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailSentBtnClicked, setIsEmailSentBtnClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordVerify = async (e) => {
    e.preventDefault();
    setIsVerifyingPassword(true);
    try {
      await verifyPassword(password);
      setIsPasswordVerified(true);
      setError("");
    } catch (err) {
      setError("비밀번호가 일치하지 않습니다.");
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  const handleSendVerification = async (e) => {
    e.preventDefault();
    setIsEmailSentBtnClicked(true);
    try {
      const checkEmail = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (checkEmail.exists || checkEmail.error) {
        setError("이메일 확인에 실패했습니다. 다시 시도해주세요.");
        return;
      } else {
        const sendEmail = await fetch("/api/auth/send-email-verification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: newEmail }),
        });

        if (!sendEmail.ok) {
          setError("인증 코드 발송에 실패했습니다. 다시 시도해주세요.");
          return;
        } else {
          setIsEmailSent(true);
          setError("");
        }
      }
    } catch (err) {
      setError("인증 코드 발송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsEmailSentBtnClicked(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateEmail(password, newEmail, verificationCode);

      // 이메일 변경 성공 시, 초기화
      setError("");

      alert("이메일이 성공적으로 변경되었습니다.\n다시 로그인해주세요.");
      location.href = "/";
    } catch (err) {
      setError("이메일 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <main className={styles["email-container"]}>
      <h1 className={styles["page-title"]}>이메일 변경</h1>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className={styles["email-form"]}>
        {!isPasswordVerified ? (
          <fieldset className={styles["form-fieldset"]}>
            <div className={styles["input-group"]}>
              <label htmlFor="password" className={styles["input-label"]}>
                먼저, 현재 비밀번호를 입력해주세요.
              </label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordVerify(e)}
                required
                className={styles["form-input"]}
              />
              <Button
                type="button"
                highlight={true}
                onClick={handlePasswordVerify}
                className={styles["form-button"]}
              >
                {isVerifyingPassword ? <Loading type="miniCircle" /> : "확인"}
              </Button>
            </div>
          </fieldset>
        ) : (
          <fieldset className={styles["form-fieldset"]}>
            <div className={styles["input-group"]}>
              <label htmlFor="newEmail" className={styles["input-label"]}>
                변경할 이메일 주소를 입력해주세요.
              </label>
              <Input
                type="email"
                id="newEmail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSendVerification(e)
                }
                required
                className={styles["form-input"]}
              />
              <Button
                type="button"
                onClick={handleSendVerification}
                disabled={isEmailSent}
                className={styles["form-button"]}
              >
                {isEmailSentBtnClicked ? (
                  <Loading type="miniCircle" />
                ) : isEmailSent ? (
                  "전송 완료"
                ) : (
                  "인증 코드 전송"
                )}
              </Button>
            </div>

            {isEmailSent && (
              <div className={styles["input-group"]}>
                <label
                  htmlFor="verificationCode"
                  className={styles["input-label"]}
                >
                  인증 코드
                </label>
                <Input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  highlight={!isEmailSent}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  maxLength={6}
                  className={styles["form-input"]}
                />
                <Button
                  type="submit"
                  highlight={true}
                  className={styles["submit-button"]}
                  disabled={!verificationCode}
                >
                  {isSubmitting ? <Loading type="miniCircle" /> : "변경하기"}
                </Button>
              </div>
            )}
          </fieldset>
        )}
      </form>
    </main>
  );
}
