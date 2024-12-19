// 사용자 프로필 페이지

import Profile from "@/components/profile/Profile";
import { metadataMaker } from "@/utils/metadata";

export async function generateMetadata({ params }) {
  return metadataMaker(
    `${params.id}님의 프로필: DREAMER`,
    "당신의 꿈을 들려주세요!"
  );
}

export default function UserProfile(props) {
  return (
    <Profile
      userName={props.params.id}
      write={props.searchParams?.write}
      post={props.searchParams?.post}
    />
  );
}
