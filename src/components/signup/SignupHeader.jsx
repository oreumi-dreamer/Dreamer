import Image from "next/image";
import styles from "./SignupHeader.module.css";

export default function SignupHeader() {
  return (
    <header className={styles["signup-header"]}>
      <h1>
        <Image
          src="/images/logo-full.svg"
          width={480}
          height={200}
          alt="Dreamer"
        ></Image>
      </h1>
    </header>
  );
}
