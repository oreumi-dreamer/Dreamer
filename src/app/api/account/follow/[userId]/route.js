// /api/account/follow/[userId]/route.js

// /api/user/follow/toggle/[userId]/route.js

import { headers } from "next/headers";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { verifyUser } from "@/lib/api/auth";

export async function GET(request, { params }) {
  try {
    const { userId } = params;
    const headersList = headers();
    const authorization = headersList.get("Authorization");
    const idToken = authorization.split("Bearer ")[1];

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // 사용자 인증 확인
    const userData = await verifyUser(baseUrl, idToken);
    if (!userData.exists) {
      return new Response(
        JSON.stringify({ error: "인증되지 않은 사용자입니다." }),
        { status: 401 }
      );
    }

    // 대상 사용자의 userId로 UID 조회
    const usersRef = collection(db, "users");
    const targetUserQuery = query(usersRef, where("userId", "==", userId));
    const targetUserSnapshot = await getDocs(targetUserQuery);

    if (targetUserSnapshot.empty) {
      return new Response(
        JSON.stringify({ error: "사용자를 찾을 수 없습니다." }),
        { status: 404 }
      );
    }

    // 자기 자신을 팔로우하는 것 방지
    if (userData.uid === targetUserSnapshot.docs[0].id) {
      return new Response(
        JSON.stringify({ error: "자기 자신을 팔로우할 수 없습니다." }),
        { status: 400 }
      );
    }

    const targetUserRef = doc(db, "users", targetUserSnapshot.docs[0].id);
    const currentUserRef = doc(db, "users", userData.uid);

    // 대상 사용자와 현재 사용자의 문서 조회
    const [targetUserDoc, currentUserDoc] = await Promise.all([
      getDoc(targetUserRef),
      getDoc(currentUserRef),
    ]);

    if (!targetUserDoc.exists() || !currentUserDoc.exists()) {
      return new Response(
        JSON.stringify({ error: "사용자 정보를 찾을 수 없습니다." }),
        { status: 404 }
      );
    }

    const targetUserData = targetUserDoc.data();
    const currentUserData = currentUserDoc.data();

    // 현재 팔로우 상태 확인 (객체 배열에서 uid로 확인)
    const followers = targetUserData.followers || [];
    const isFollowing = followers.some(
      (follower) => follower.uid === userData.uid
    );

    // 사용자 정보 객체 생성
    const targetUserInfo = {
      uid: targetUserDoc.id,
    };

    const currentUserInfo = {
      uid: userData.uid,
    };

    // 트랜잭션으로 두 사용자의 문서를 동시에 업데이트
    if (isFollowing) {
      // 팔로우 해제
      await Promise.all([
        updateDoc(targetUserRef, {
          followers: arrayRemove(currentUserInfo),
          followersCount: (targetUserData.followersCount || 1) - 1,
        }),
        updateDoc(currentUserRef, {
          following: arrayRemove(targetUserInfo),
          followingCount: (currentUserData.followingCount || 1) - 1,
        }),
      ]);
    } else {
      // 팔로우 추가
      await Promise.all([
        updateDoc(targetUserRef, {
          followers: arrayUnion(currentUserInfo),
          followersCount: (targetUserData.followersCount || 0) + 1,
        }),
        updateDoc(currentUserRef, {
          following: arrayUnion(targetUserInfo),
          followingCount: (currentUserData.followingCount || 0) + 1,
        }),
      ]);
    }

    return new Response(
      JSON.stringify({
        success: true,
        isFollowing: !isFollowing,
        followersCount: isFollowing
          ? (targetUserData.followersCount || 1) - 1
          : (targetUserData.followersCount || 0) + 1,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error toggling follow:", error);
    return new Response(
      JSON.stringify({
        error: "팔로우를 토글하는 중 오류가 발생했습니다.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
