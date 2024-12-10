import Image from "next/image";
import styles from "./Loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loading}>
      <div></div>
      {/* <Image src="images/moon1.svg" width={106} height={106}></Image> */}
    </div>
  );
}
