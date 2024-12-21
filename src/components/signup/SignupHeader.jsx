import styles from "./SignupHeader.module.css";

export default function SignupHeader() {
  return (
    <header className={styles["signup-header"]}>
      <h1>
        <img
          src="/images/logo-full.svg"
          width={480}
          height={200}
          alt="DREAMER"
        ></img>
      </h1>
    </header>
  );
}
