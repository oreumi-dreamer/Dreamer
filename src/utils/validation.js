"use client";

export async function validateFirstForm(e) {
  const form = e.target;
  const userId = form.querySelector("#userId");
  const userName = form.querySelector("#userName");
  const birthYear = form.querySelector("#birth-year + select");
  const birthMonth = form.querySelector("#birth-month + select");
  const birthDay = form.querySelector("#birth-day + select");

  if (
    !userId.value ||
    !userName.value ||
    !birthYear.value ||
    !birthMonth.value ||
    !birthDay.value
  ) {
    alert("모든 항목을 입력해주세요.");
    return false;
  }

  async function checkLegal() {
    // 만 14세 이상인지 확인하는 코드
    // 현재 날짜: GET /api/today

    const today = await fetch("/api/today");
    const todayData = await today.json();
    const currentDateISO = new Date(todayData.date);
    const currentDate = new Date(
      currentDateISO.getFullYear(),
      currentDateISO.getMonth(),
      currentDateISO.getDate()
    );

    const birthDate = new Date(
      birthYear.value,
      birthMonth.value - 1,
      birthDay.value
    );

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 14) {
      return false;
    } else {
      return true;
    }
  }

  const isLegal = await checkLegal();

  if (!isLegal) {
    alert("만 14세 이상만 가입이 가능합니다.");
    return false;
  } else {
    return true;
  }
}

export function validateSecondForm(e) {
  const form = e.target;
  const profileImage = form.querySelector("#profileImage").value;
  const bio = form.querySelector("#bio").value;
  const theme = form.querySelector('input[name="theme"]:checked').value;

  if (!bio || !theme) {
    alert("모든 항목을 입력해주세요.");
    return false;
  }

  return true;
}

export function validatePassword(password) {
  const minLength = 6;
  const maxLength = 4096;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isValidLength =
    password.length >= minLength && password.length <= maxLength;

  return (
    hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength
  );
}
