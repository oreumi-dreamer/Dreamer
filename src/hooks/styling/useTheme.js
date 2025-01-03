import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserTheme } from "@/store/authSlice";

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
export default function useTheme() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user) || {};
  const theme = user ? user.theme : null;

  useEffect(() => {
    const storedTheme = localStorage.getItem("userTheme");

    // 로컬 스토리지를 통해 저장된 테마 또는 사용자 정보의 테마 적용
    if (storedTheme) {
      const appliedTheme =
        storedTheme === "device" ? getSystemTheme() : storedTheme;
      document.documentElement.setAttribute("data-theme", appliedTheme);
      dispatch(setUserTheme({ theme: storedTheme }));
    } else if (theme) {
      const appliedTheme =
        storedTheme === "device" ? getSystemTheme() : storedTheme;
      document.documentElement.setAttribute("data-theme", appliedTheme);
      localStorage.setItem("userTheme", appliedTheme);
      dispatch(setUserTheme({ theme }));
    } else {
      const systemTheme = getSystemTheme();
      document.documentElement.setAttribute("data-theme", systemTheme);
      localStorage.setItem("userTheme", "device");
      dispatch(setUserTheme({ theme: "device" }));
    }
  }, [theme, dispatch]);

  const changeTheme = (newTheme) => {
    try {
      if (["light", "dark", "device"].includes(newTheme)) {
        const appliedTheme =
          newTheme === "device" ? getSystemTheme() : newTheme;
        localStorage.setItem("userTheme", newTheme);
        document.documentElement.setAttribute("data-theme", appliedTheme);
        dispatch(setUserTheme({ theme: newTheme }));
      }
    } catch (error) {
      console.error("Error changing theme:", error);
    }
  };

  return {
    theme,
    changeTheme,
  };
}
