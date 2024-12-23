import { useState, useEffect } from "react";
import { Button, Input, LoginForm } from "../Controls";
import { validatePassword } from "@/utils/validation";
import Loading from "../Loading";

export default function FindPassword({ styles, setShowFindPassword }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailClicked, setIsEmailClicked] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  useEffect(() => {
    if (password === "") {
      setIsPasswordValid(false);
    } else {
      setIsPasswordValid(validatePassword(password));
    }
  }, [password]);

  useEffect(() => {
    if (password === passwordConfirm) {
      setIsPasswordMatch(true);
    } else {
      setIsPasswordMatch(false);
    }
  }, [password, passwordConfirm]);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setIsEmailClicked(true);

    try {
      const checkEmail = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const result = await checkEmail.json();

      if (!result.exists || result.error) {
        setError("이메일 확인에 실패했습니다. 다시 시도해주세요.");
        setEmailError("이메일을 확인해주세요.");
        return;
      } else {
        const sendEmail = await fetch("/api/auth/send-email-verification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        });

        if (!sendEmail.ok) {
          setError("인증 코드 발송에 실패했습니다. 다시 시도해주세요.");
          setEmailError("인증 코드 발송에 실패했습니다.");
          return;
        } else {
          setIsEmailSent(true);
          setError("");
        }
        setEmailError("");
      }
    } catch (err) {
      setError("인증 코드 발송에 실패했습니다. 다시 시도해주세요.");
      setEmailError("인증 코드 발송에 실패했습니다.");
    } finally {
      setIsEmailClicked(false);
    }
  };

  const handleFindPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code, newPassword: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
      setShowFindPassword(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <h2 className={styles["login-title"]}>비밀번호 찾기</h2>
      <p>가입하신 이메일을 입력해주세요.</p>
      <LoginForm onSubmit={handleFindPassword} className={styles["find-form"]}>
        <label className={styles["id-label"]}>
          이메일
          <div className={styles["input-wrap"]}>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleVerifyEmail(e);
              }}
              required
            />
            <Button
              onClick={handleVerifyEmail}
              disabled={isEmailClicked}
              highlight={true}
            >
              {isEmailClicked ? (
                <Loading type="miniCircle" />
              ) : isEmailSent ? (
                "발송됨"
              ) : (
                "코드 발송"
              )}
            </Button>
          </div>
          <span className={styles["invalid-text"]}>
            {emailError ? emailError : ""}
          </span>
        </label>
        {isEmailSent && (
          <label className={styles["id-label"]}>
            인증번호
            <Input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </label>
        )}

        <label className={styles["id-label"]}>
          새 비밀번호
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={code === ""}
          />
          <span className={styles["invalid-text"]}>
            {isPasswordValid
              ? ""
              : "비밀번호는 6자 이상, 영문 대,소문자, 숫자, 특수문자를 포함해주세요"}
          </span>
        </label>
        <label className={styles["id-label"]}>
          비밀번호 재확인
          <Input
            type="password"
            id="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            disabled={code === ""}
          />
          <span className={styles["invalid-text"]}>
            {passwordConfirm !== "" && isPasswordMatch
              ? ""
              : "비밀번호가 일치하지 않습니다."}
          </span>
        </label>
        <ul className={styles["bottom-btns"]}>
          <li>
            <Button
              className={styles["login-button"]}
              onClick={(e) => {
                e.preventDefault();
                setShowFindPassword(false);
              }}
            >
              돌아가기
            </Button>
          </li>
          <li>
            <Button
              type="submit"
              highlight={true}
              className={styles["login-button"]}
              disabled={
                !isEmailSent || passwordConfirm === "" || !isPasswordMatch
              }
            >
              비밀번호 변경
            </Button>
          </li>
        </ul>
      </LoginForm>
    </>
  );
}
