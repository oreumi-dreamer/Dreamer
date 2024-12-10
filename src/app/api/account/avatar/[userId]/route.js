// /api/account/avatar/[userId]/route.js
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { userId } = params;

  try {
    // Firestore users 컬렉션에서 userId로 검색
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("userId", "==", userId));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const userData = userSnapshot.docs[0].data();
    const profileImageUrl = userData.profileImageUrl;

    if (!profileImageUrl) {
      return NextResponse.redirect("/images/rabbit.svg");
    }

    // 이미지 URL로 리다이렉트
    return NextResponse.redirect(profileImageUrl);
  } catch (error) {
    console.error("Error fetching user avatar:", error);
    return NextResponse.json(
      { error: "프로필 이미지를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
