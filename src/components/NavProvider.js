"use client";

import { usePathname } from "next/navigation";

import Header from "./header/Header";
import Footer from "./footer/Footer";
import { useSelector } from "react-redux";

export default function NavProvider({ children }) {
  const { user, isRegistrationComplete } = useSelector((state) => state.auth);

  const isLogin = !!user;
  const isComplete = isRegistrationComplete;

  const pathname = usePathname();

  if (
    !isLogin ||
    !isComplete ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/tomong") ||
    pathname.startsWith("/post")
  ) {
    return <>{children}</>;
  }

  return (
    <div className="root-container">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
