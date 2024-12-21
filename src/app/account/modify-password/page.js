"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@/components/Controls";
import styles from "./ModifyPassword.module.css";
import { verifyPassword } from "@/utils/auth/verifyPassword";
import Loading from "@/components/Loading";
import { auth } from "@/lib/firebase";
import { updatePassword } from "firebase/auth";

const validatePassword = (password) => {
  const minLength = 6;
  const maxLength = 4096;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isValidLength =
    password.length >= minLength && password.length <= maxLength;

  return {
    isValid:
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      isValidLength,
    checks: {
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isValidLength,
    },
  };
};

export default function ModifyPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isValidation, setIsValidation] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  useEffect(() => {
    if (newPassword) {
      const { isValid } = validatePassword(newPassword);
      setIsValidation(isValid);
    }
  }, [newPassword]);

  useEffect(() => {
    if (newPassword !== confirmPassword || confirmPassword === "") {
      setIsPasswordMatch(false);
    } else {
      setIsPasswordMatch(true);
    }
  }, [newPassword, confirmPassword]);

  const handlePasswordVerify = async (e) => {
    e.preventDefault();
    setIsVerifyingPassword(true);
    try {
      await verifyPassword(currentPassword);
      setIsPasswordVerified(true);
      setError("");
    } catch (err) {
      setError("비밀번호가 일치하지 않습니다.");
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 새 비밀번호 유효성 검사
      const { isValid } = validatePassword(newPassword);
      if (!isValid) {
        throw new Error("비밀번호가 유효성 검사 규칙을 만족하지 않습니다.");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("새 비밀번호가 일치하지 않습니다.");
      }

      const user = auth.currentUser;
      if (!user) {
        throw new Error("로그인이 필요합니다.");
      }

      // Firebase 비밀번호 업데이트
      await updatePassword(user, newPassword);

      // 성공 시 처리
      alert("비밀번호가 성공적으로 변경되었습니다.\n다시 로그인해주세요.");
      location.href = "/logout";
    } catch (err) {
      setError(
        err.message || "비밀번호 변경에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles["password-container"]}>
      <h1 className={styles["page-title"]}>비밀번호 변경</h1>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className={styles["password-form"]}>
        {!isPasswordVerified ? (
          <fieldset className={styles["form-fieldset"]}>
            <div className={styles["input-group"]}>
              <label
                htmlFor="currentPassword"
                className={styles["input-label"]}
              >
                먼저, 현재 비밀번호를 입력해주세요.
              </label>
              <Input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
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
              <label htmlFor="newPassword" className={styles["input-label"]}>
                새 비밀번호
              </label>
              <Input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={styles["form-input"]}
              />
              <span className={styles["mismatch-message"]}>
                {isValidation
                  ? ""
                  : "비밀번호는 6자 이상, 영문 대,소문자, 숫자, 특수문자를 포함해주세요"}
              </span>
              <img
                src={isValidation ? "/images/valid.svg" : "/images/invalid.svg"}
                width={40}
                height={40}
                alt={
                  isValidation ? "유효한 비밀번호" : "유효하지 않은 비밀번호"
                }
              />
            </div>

            <div className={styles["input-group"]}>
              <label
                htmlFor="confirmPassword"
                className={styles["input-label"]}
              >
                새 비밀번호 확인
              </label>
              <Input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles["form-input"]}
              />
              <span className={styles["mismatch-message"]}>
                {isPasswordMatch ? "" : "비밀번호가 일치하지 않습니다."}
              </span>
              <img
                src={
                  isPasswordMatch ? "/images/valid.svg" : "/images/invalid.svg"
                }
                width={40}
                height={40}
                alt={
                  isPasswordMatch
                    ? "유효한 비밀번호 재확인"
                    : "유효하지 않은 비밀번호 재확인"
                }
              />
            </div>
            <Button
              type="submit"
              highlight={true}
              className={styles["submit-button"]}
              disabled={
                !newPassword ||
                !confirmPassword ||
                !isPasswordMatch ||
                !isValidation
              }
            >
              {isSubmitting ? <Loading type="miniCircle" /> : "변경하기"}
            </Button>
          </fieldset>
        )}
      </form>
    </main>
  );
}
