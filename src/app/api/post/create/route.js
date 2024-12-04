// 글쓰기 API
// /api/post/create/route.js

import { headers } from "next/headers";
import sharp from "sharp";
import { Buffer } from "buffer";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { verifyUser } from "@/lib/api/auth";
import { v4 as uuidv4 } from "uuid";

import { DREAM_GENRES, DREAM_MOODS } from "@/utils/constants";

// 이미지 압축 함수
async function compressImage(imageBuffer) {
  return await sharp(imageBuffer)
    .resize(1280, 1280, {
      // 최대 크기 지정
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({
      // JPEG 포맷으로 변환
      quality: 80, // 품질 설정 (0-100)
      progressive: true,
    })
    .toBuffer();
}

export async function POST(request) {
  try {
    const headersList = headers();
    const authorization = headersList.get("Authorization");
    const idToken = authorization.split("Bearer ")[1];

    const formData = await request.formData();
    const content = formData.get("content");
    const title = formData.get("title");
    const genres = JSON.parse(formData.get("genres"));
    const moods = JSON.parse(formData.get("moods"));
    const rating = formData.get("rating");
    const isPrivate = formData.get("isPrivate");
    const imageFiles = formData.getAll("images");

    const userData = await verifyUser(idToken);
    if (!userData.exists) {
      return new Response(
        JSON.stringify({ error: "인증되지 않은 사용자입니다." }),
        { status: 401 }
      );
    }

    // 장르와 느낌 유효성 검사
    const genreIds = DREAM_GENRES.map((g) => g.id);
    const moodIds = DREAM_MOODS.map((m) => m.id);

    if (
      genres.some((genre) => !genreIds.includes(genre)) ||
      moods.some((mood) => !moodIds.includes(mood))
    ) {
      return new Response(
        JSON.stringify({ error: "유효하지 않은 장르 또는 느낌입니다." }),
        { status: 400 }
      );
    }

    // 별점 유효성 검사
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: "유효하지 않은 별점입니다." }),
        { status: 400 }
      );
    }

    // 내용 유효성 검사
    if (!content || content.trim().length === 0) {
      return new Response(JSON.stringify({ error: "내용을 입력해주세요." }), {
        status: 400,
      });
    }

    let imageUrls = [];
    const postId = uuidv4();

    // 이미지 처리
    if (imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];

        // 파일을 버퍼로 변환
        const buffer = Buffer.from(await file.arrayBuffer());

        // 이미지 압축
        const compressedImageBuffer = await compressImage(buffer);

        // Firebase Storage에 업로드
        const storageRef = ref(
          storage,
          `post-images/${postId}-${i}-compressed.jpg`
        );

        await uploadBytes(storageRef, compressedImageBuffer, {
          contentType: "image/jpeg",
        });

        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }
    }

    // isPrivate 문자열을 불리언으로 변환
    const isPrivateBool = isPrivate === "true";

    // 게시글 데이터 생성 및 저장
    const postData = {
      postId,
      title,
      content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      authorUid: userData.uid,
      authorId: userData.userId,
      authorName: userData.userName,
      imageUrls,
      isPrivate: isPrivateBool,
      spark: [],
      sparkCount: 0,
      comments: [],
      commentsCount: 0,
      dreamGenres: genres,
      dreamMoods: moods,
      dreamRating: rating,
      isDeleted: false,
    };

    const docRef = await addDoc(collection(db, "posts"), postData);

    return new Response(
      JSON.stringify({
        success: true,
        postId: docRef.id,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return new Response(
      JSON.stringify({
        error: "게시글 생성 중 오류가 발생했습니다.",
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
