// 사용자 프로필 페이지

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Profile from "@/components/profile/Profile";
import styles from "@/app/page.module.css";

export default function UserProfile(props) {
  return (
    <div className={styles.container}>
      <Header />
      <Profile userName={props.params.id} />
      <Footer />
    </div>
  );
}
