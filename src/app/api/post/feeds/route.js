import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  doc,
  getDoc,
  or,
  and,
} from "firebase/firestore";
import { verifyUser } from "@/lib/api/auth";

export async function GET(request) {
  const headersList = headers();
  const authorization = headersList.get("Authorization");
  const idToken = authorization.split("Bearer ")[1];

  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const pageSize = parseInt(searchParams.get("limit")) || 20;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const userData = await verifyUser(baseUrl, idToken);
  if (!userData.exists) {
    return NextResponse.json(
      { error: "인증되지 않은 사용자입니다." },
      { status: 401 }
    );
  }

  try {
    // 사용자 데이터 가져오기
    const userDoc = await getDoc(doc(db, "users", userData.uid));
    const userDataDoc = userDoc.data();
    const following = userDataDoc.following || [];
    const followingUids = following.map((f) => f.uid);
    const genreStats = userDataDoc.genreStats || {};
    const moodStats = userDataDoc.moodStats || {};

    // cursor가 있는 경우 쿼리 수정
    if (cursor) {
      // cursor 문서 가져오기
      const cursorDoc = await getDoc(doc(db, "posts", cursor));

      if (cursorDoc.exists()) {
        // 공개 게시물 쿼리 수정
        const publicPostsQuery = query(
          collection(db, "posts"),
          where("isDeleted", "==", false),
          where("isPrivate", "==", false),
          orderBy("createdAt", "desc"),
          startAfter(cursorDoc), // cursor 이후부터 조회
          limit(pageSize)
        );

        // 비공개 게시물 쿼리 수정
        const privatePostsQuery = query(
          collection(db, "posts"),
          where("isDeleted", "==", false),
          where("isPrivate", "==", true),
          where("authorUid", "==", userData.uid),
          orderBy("createdAt", "desc"),
          startAfter(cursorDoc), // cursor 이후부터 조회
          limit(pageSize)
        );

        // 두 쿼리 실행
        const [publicSnapshot, privateSnapshot] = await Promise.all([
          getDocs(publicPostsQuery),
          getDocs(privatePostsQuery),
        ]);

        // 이하 동일...
        // 결과 합치기
        let allDocs = [...publicSnapshot.docs, ...privateSnapshot.docs];
        // createdAt으로 정렬
        allDocs.sort(
          (a, b) => b.data().createdAt.seconds - a.data().createdAt.seconds
        );
        // pageSize만큼만 자르기
        allDocs = allDocs.slice(0, pageSize);

        // 작성자 정보 일괄 조회
        const uniqueAuthorUids = [
          ...new Set(allDocs.map((doc) => doc.data().authorUid)),
        ];

        // uniqueAuthorUids가 비어있지 않을 때만 사용자 정보 조회
        const userMap = {};
        if (uniqueAuthorUids.length > 0) {
          const usersRef = collection(db, "users");
          const userQuery = query(
            usersRef,
            where("__name__", "in", uniqueAuthorUids)
          );
          const userSnapshot = await getDocs(userQuery);

          userSnapshot.forEach((doc) => {
            userMap[doc.id] = {
              userId: doc.data().userId,
              userName: doc.data().userName,
              profileImageUrl: doc.data().profileImageUrl,
            };
          });
        }

        // 시간 기반 점수 계산 함수
        const calculateTimeDecay = (
          createdAt,
          sparkCount = 0,
          commentsCount = 0
        ) => {
          const now = new Date();
          const postDate = createdAt.toDate();
          const hoursElapsed = (now - postDate) / (1000 * 60 * 60);
          const threeDaysInHours = 72;

          let baseDecay;
          if (hoursElapsed <= 24) {
            baseDecay = Math.max(
              0,
              15 * (1 - Math.log(hoursElapsed + 1) / Math.log(48))
            );
          } else if (hoursElapsed <= threeDaysInHours) {
            baseDecay = Math.max(
              0,
              10 * (1 - Math.log(hoursElapsed + 1) / Math.log(96))
            );
          } else {
            const daysElapsed = hoursElapsed / 24;
            baseDecay = -Math.min(5, (daysElapsed - 3) * 0.5);
          }

          const interactionBonus = Math.min(
            8,
            (sparkCount + commentsCount) / 8
          );
          return Math.min(15, baseDecay + interactionBonus);
        };

        // 점수 계산 및 게시물 데이터 가공
        const posts = allDocs
          .map((doc) => {
            const postData = doc.data();

            const commentsLength = postData.comments
              ? postData.comments.filter((comment) => !comment.isDeleted).length
              : 0;

            // 점수 계산
            const followScore = followingUids.includes(postData.authorUid)
              ? 30
              : 0;
            const interactionScore = Math.min(
              30,
              ((postData.sparkCount || 0) + (commentsLength || 0)) / 2
            );
            const genreMatchScore = Math.min(
              25,
              postData.dreamGenres?.reduce(
                (acc, genre) => acc + (genreStats[genre]?.count || 0),
                0
              ) || 0
            );
            const timeFreshnessScore = calculateTimeDecay(
              postData.createdAt,
              postData.sparkCount,
              commentsLength
            );

            const totalScore =
              followScore +
              interactionScore +
              genreMatchScore +
              timeFreshnessScore;

            return {
              id: doc.id,
              title: postData.title,
              content: postData.content,
              authorUid: postData.authorUid,
              createdAt: postData.createdAt.toDate().toISOString(),
              sparkCount: postData.sparkCount || 0,
              commentsCount: commentsLength || 0,
              dreamGenres: postData.dreamGenres || [],
              dreamMoods: postData.dreamMoods || [],
              imageUrls: postData.imageUrls || [],
              spark: postData.spark || [],
              score: totalScore,
              authorId: userMap[postData.authorUid]?.userId || "알 수 없음",
              authorName: userMap[postData.authorUid]?.userName || "알 수 없음",
              profileImageUrl:
                userMap[postData.authorUid]?.profileImageUrl ||
                "/images/rabbit.svg",
              hasUserSparked: postData.spark?.includes(userData.uid) || false,
              isTomong: postData.tomong
                ? !!postData.tomong[postData.tomongSelected]
                : false,
              tomongSelected:
                postData.tomongSelected > -1 ? postData.tomongSelected : -1,
              isMyself: postData.authorUid === userData.uid,
              isPrivate: postData.isPrivate || false,
            };
          })
          .sort((a, b) => b.score - a.score);

        const lastVisible = allDocs[allDocs.length - 1];

        return NextResponse.json({
          posts,
          pagination: {
            nextCursor: lastVisible?.id,
            hasMore: allDocs.length === pageSize,
          },
        });
      } else {
        return NextResponse.json(
          { error: "유효하지 않은 cursor입니다." },
          { status: 400 }
        );
      }
    } else {
      // 두 개의 쿼리를 실행: 공개 게시물과 자신의 비공개 게시물
      const publicPostsQuery = query(
        collection(db, "posts"),
        where("isDeleted", "==", false),
        where("isPrivate", "==", false),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );

      const privatePostsQuery = query(
        collection(db, "posts"),
        where("isDeleted", "==", false),
        where("isPrivate", "==", true),
        where("authorUid", "==", userData.uid),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );

      // 두 쿼리 모두 실행
      const [publicSnapshot, privateSnapshot] = await Promise.all([
        getDocs(publicPostsQuery),
        getDocs(privatePostsQuery),
      ]);

      // 결과 합치기
      let allDocs = [...publicSnapshot.docs, ...privateSnapshot.docs];
      // createdAt으로 정렬
      allDocs.sort(
        (a, b) => b.data().createdAt.seconds - a.data().createdAt.seconds
      );
      // pageSize만큼만 자르기
      allDocs = allDocs.slice(0, pageSize);

      // 작성자 정보 일괄 조회
      const uniqueAuthorUids = [
        ...new Set(allDocs.map((doc) => doc.data().authorUid)),
      ];

      // uniqueAuthorUids가 비어있지 않을 때만 사용자 정보 조회
      const userMap = {};
      if (uniqueAuthorUids.length > 0) {
        const usersRef = collection(db, "users");
        const userQuery = query(
          usersRef,
          where("__name__", "in", uniqueAuthorUids)
        );
        const userSnapshot = await getDocs(userQuery);

        userSnapshot.forEach((doc) => {
          userMap[doc.id] = {
            userId: doc.data().userId,
            userName: doc.data().userName,
            profileImageUrl: doc.data().profileImageUrl,
          };
        });
      }

      // 시간 기반 점수 계산 함수
      const calculateTimeDecay = (
        createdAt,
        sparkCount = 0,
        commentsCount = 0
      ) => {
        const now = new Date();
        const postDate = createdAt.toDate();
        const hoursElapsed = (now - postDate) / (1000 * 60 * 60);
        const threeDaysInHours = 72;

        let baseDecay;
        if (hoursElapsed <= 24) {
          baseDecay = Math.max(
            0,
            15 * (1 - Math.log(hoursElapsed + 1) / Math.log(48))
          );
        } else if (hoursElapsed <= threeDaysInHours) {
          baseDecay = Math.max(
            0,
            10 * (1 - Math.log(hoursElapsed + 1) / Math.log(96))
          );
        } else {
          const daysElapsed = hoursElapsed / 24;
          baseDecay = -Math.min(5, (daysElapsed - 3) * 0.5);
        }

        const interactionBonus = Math.min(8, (sparkCount + commentsCount) / 8);
        return Math.min(15, baseDecay + interactionBonus);
      };

      // 점수 계산 및 게시물 데이터 가공
      const posts = allDocs
        .map((doc) => {
          const postData = doc.data();

          const commentsLength = postData.comments
            ? postData.comments.filter((comment) => !comment.isDeleted).length
            : 0;

          // 점수 계산
          const followScore = followingUids.includes(postData.authorUid)
            ? 30
            : 0;
          const interactionScore = Math.min(
            30,
            ((postData.sparkCount || 0) + (commentsLength || 0)) / 2
          );
          const genreMatchScore = Math.min(
            25,
            postData.dreamGenres?.reduce(
              (acc, genre) => acc + (genreStats[genre]?.count || 0),
              0
            ) || 0
          );
          const timeFreshnessScore = calculateTimeDecay(
            postData.createdAt,
            postData.sparkCount,
            commentsLength
          );

          const totalScore =
            followScore +
            interactionScore +
            genreMatchScore +
            timeFreshnessScore;

          return {
            id: doc.id,
            objectID: doc.id,
            title: postData.title,
            content: postData.content,
            authorUid: postData.authorUid,
            createdAt: postData.createdAt.toDate().toISOString(),
            sparkCount: postData.sparkCount || 0,
            commentsCount: commentsLength || 0,
            dreamGenres: postData.dreamGenres || [],
            dreamMoods: postData.dreamMoods || [],
            imageUrls: postData.imageUrls || [],
            spark: postData.spark || [],
            score: totalScore,
            authorId: userMap[postData.authorUid]?.userId || "알 수 없음",
            authorName: userMap[postData.authorUid]?.userName || "알 수 없음",
            profileImageUrl:
              userMap[postData.authorUid]?.profileImageUrl ||
              "/images/rabbit.svg",
            hasUserSparked: postData.spark?.includes(userData.uid) || false,
            isTomong: postData.tomong
              ? !!postData.tomong[postData.tomongSelected]
              : false,
            tomongSelected:
              postData.tomongSelected > -1 ? postData.tomongSelected : -1,
            isMyself: postData.authorUid === userData.uid,
            isPrivate: postData.isPrivate || false,
          };
        })
        .sort((a, b) => b.score - a.score);

      const lastVisible = allDocs[allDocs.length - 1];

      return NextResponse.json({
        posts,
        pagination: {
          nextCursor: lastVisible?.id,
          hasMore: allDocs.length === pageSize,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "게시글을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
