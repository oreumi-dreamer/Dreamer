// 게시글 수정하는 API
// /api/post/update/[postId]/route.js

import { headers } from "next/headers";
import sharp from "sharp";
import { Buffer } from "buffer";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { verifyUser } from "@/lib/api/auth";
import { DREAM_GENRES, DREAM_MOODS } from "@/utils/constants";

async function compressImage(imageBuffer) {
  return await sharp(imageBuffer)
    .resize(1280, 1280, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .jpeg({
      quality: 80,
      progressive: true,
    })
    .toBuffer();
}

export async function POST(request, { params }) {
  try {
    const { postId } = params;
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
    const remainingImages = JSON.parse(formData.get("remainingImages") || "[]");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // 사용자 인증
    const userData = await verifyUser(baseUrl, idToken);
    if (!userData.exists) {
      return new Response(
        JSON.stringify({ error: "인증되지 않은 사용자입니다." }),
        { status: 401 }
      );
    }

    // 게시글 존재 확인
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return new Response(
        JSON.stringify({ error: "존재하지 않는 게시글입니다." }),
        { status: 404 }
      );
    }

    // 작성자 본인 확인
    const postData = postSnap.data();
    if (postData.authorUid !== userData.uid) {
      return new Response(JSON.stringify({ error: "수정 권한이 없습니다." }), {
        status: 403,
      });
    }

    // 유효성 검사
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

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: "유효하지 않은 별점입니다." }),
        { status: 400 }
      );
    }

    if (!content || content.trim().length === 0) {
      return new Response(JSON.stringify({ error: "내용을 입력해주세요." }), {
        status: 400,
      });
    }

    // 삭제된 이미지 처리
    const deletedImages = postData.imageUrls.filter(
      (url) => !remainingImages.includes(url)
    );

    for (const url of deletedImages) {
      const imageRef = ref(storage, url);
      await deleteObject(imageRef);
    }

    // 새 이미지 처리
    let imageUrls = [...remainingImages];

    if (imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const buffer = Buffer.from(await file.arrayBuffer());
        const compressedImageBuffer = await compressImage(buffer);

        const storageRef = ref(
          storage,
          `post-images/${postId}-${Date.now()}-${i}-compressed.jpg`
        );

        await uploadBytes(storageRef, compressedImageBuffer, {
          contentType: "image/jpeg",
        });

        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }
    }

    // 게시글 업데이트
    const updateData = {
      title,
      content,
      updatedAt: serverTimestamp(),
      imageUrls,
      isPrivate: isPrivate === "true",
      dreamGenres: genres,
      dreamMoods: moods,
      dreamRating: rating,
    };

    await updateDoc(postRef, updateData);

    return new Response(
      JSON.stringify({
        success: true,
        postId,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    return new Response(
      JSON.stringify({
        error: "게시글 수정 중 오류가 발생했습니다.",
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
