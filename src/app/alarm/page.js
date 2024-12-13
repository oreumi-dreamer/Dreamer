import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import React from "react";
import basicStyles from "../page.module.css";
import styles from "./page.module.css";

export default function search() {
  return (
    <div
      id="container"
      className={`${basicStyles.container} ${styles.container}`}
    >
      <Header />
      <div>아쉽지만 아직은 이용할 수 없는 기능이에요</div>
      <Footer />
    </div>
  );
}
