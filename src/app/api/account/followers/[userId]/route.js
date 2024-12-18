// /api/account/follow/[userId]/route.js

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request, { params }) {
  const { userId } = params;
  const { searchParams } = new URL(request.url);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // 쿼리 파라미터 파싱
  const summary = searchParams.get("summary") === "true";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 20;
  const type = searchParams.get("type"); // 'followers' 또는 'following'

  // 먼저 userId로 사용자의 UID를 조회
  const usersRef = collection(db, "users");
  const userQuery = query(usersRef, where("userId", "==", userId));
  const userSnapshot = await getDocs(userQuery);

  if (userSnapshot.empty) {
    return NextResponse.json(
      { error: "사용자를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  // 대상 사용자의 UID와 문서를 가져옴
  const targetUid = userSnapshot.docs[0].id;

  // 현재 로그인한 사용자 정보 확인
  const headersList = headers();
  const authorization = headersList.get("Authorization");
  let currentUserUid = null;

  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];
    const response = await fetch(`${baseUrl}/api/auth/verify`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    const result = response.ok ? await response.json() : null;
    currentUserUid = result?.uid;
  }

  try {
    // 대상 사용자의 문서를 가져옴
    const targetUserDoc = await getDoc(doc(db, "users", targetUid));
    const targetUserData = targetUserDoc.data();

    // 팔로워/팔로잉 목록을 가져옴
    const followers = targetUserData.followers || [];
    const following = targetUserData.following || [];

    // UID 배열을 사용하여 사용자 정보를 가져오는 함수
    const getUserInfo = async (uids) => {
      const userInfos = [];
      for (const { uid } of uids) {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          userInfos.push({
            uid,
            userName: userData.userName,
            userId: userData.userId,
            profileImageUrl: userData.profileImageUrl,
            isFollowing: userData.followers.some(
              (follower) => follower.uid === currentUserUid
            ),
            isMyself: currentUserUid === uid,
          });
        }
      }
      return userInfos;
    };

    // summary 모드일 경우 카운트와 팔로우 여부만 반환
    if (summary) {
      return NextResponse.json({
        followersCount: targetUserData.followersCount || 0,
        followingCount: targetUserData.followingCount || 0,
        isFollowing: currentUserUid
          ? followers.some((follower) => follower.uid === currentUserUid)
          : false,
      });
    }

    // 페이지네이션 적용
    let paginatedFollowers = [];
    let paginatedFollowing = [];
    let totalPages = {
      followers: Math.ceil(followers.length / limit),
      following: Math.ceil(following.length / limit),
    };

    // type 파라미터가 있는 경우 해당 타입의 목록만 반환
    if (type === "followers") {
      const startIndex = (page - 1) * limit;
      paginatedFollowers = followers.slice(startIndex, startIndex + limit);
      const followersInfo = await getUserInfo(paginatedFollowers);

      return NextResponse.json({
        followers: followersInfo,
        followersCount: followers.length,
        currentPage: page,
        nextPage: page + 1,
        totalPages: totalPages.followers,
        hasMore: page < totalPages.followers,
        isFollowing: currentUserUid
          ? followers.some((follower) => follower.uid === currentUserUid)
          : false,
      });
    } else if (type === "following") {
      const startIndex = (page - 1) * limit;
      paginatedFollowing = following.slice(startIndex, startIndex + limit);
      const followingInfo = await getUserInfo(paginatedFollowing);

      return NextResponse.json({
        following: followingInfo,
        followingCount: following.length,
        currentPage: page,
        nextPage: page + 1,
        totalPages: totalPages.following,
        hasMore: page < totalPages.following,
        isFollowing: currentUserUid
          ? followers.some((follower) => follower.uid === currentUserUid)
          : false,
      });
    }

    // type 파라미터가 없는 경우 모든 정보 반환 (페이지네이션 적용)
    const followersStartIndex = (page - 1) * limit;
    const followingStartIndex = (page - 1) * limit;

    paginatedFollowers = followers.slice(
      followersStartIndex,
      followersStartIndex + limit
    );
    paginatedFollowing = following.slice(
      followingStartIndex,
      followingStartIndex + limit
    );

    const followersInfo = await getUserInfo(paginatedFollowers);
    const followingInfo = await getUserInfo(paginatedFollowing);

    return NextResponse.json({
      followers: followersInfo,
      following: followingInfo,
      followersCount: followers.length,
      followingCount: following.length,
      currentPage: page,
      nextPage: page + 1,
      totalPages: Math.max(totalPages.followers, totalPages.following),
      hasMore: {
        followers: page < totalPages.followers,
        following: page < totalPages.following,
      },
      isFollowing: currentUserUid
        ? followers.some((follower) => follower.uid === currentUserUid)
        : false,
    });
  } catch (error) {
    console.error("Error fetching follow data:", error);
    return NextResponse.json(
      { error: "팔로워/팔로잉 정보를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
