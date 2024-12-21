// 앨런 AI API에게 꿈 해몽 요청하고 스트리밍받기
// /api/tomong/route.js

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/api/tokenManager";
import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  getDoc,
} from "firebase/firestore";

export async function GET(request) {
  const url = new URL(request.url);
  const streamToken = url.searchParams.get("streamToken");
  const postId = url.searchParams.get("postId");

  const tokenData = verifyToken(streamToken);
  if (!tokenData) {
    return NextResponse.json(
      { error: "Invalid or expired streaming token" },
      { status: 401 }
    );
  }

  const { title, content, genre, mood, rating } = Object.fromEntries(
    url.searchParams
  );

  if (!content) {
    return NextResponse.json(
      { error: "필수 정보가 누락되었습니다." },
      { status: 400 }
    );
  }

  const API_URL = process.env.ALAN_API_BASE_URL;
  const API_CLIENT_ID = process.env.ALAN_API_CLIENT_ID;
  const PROMPT = process.env.ALAN_PROMPT;

  const defaultPrompt = PROMPT;

  let prompt = "";
  prompt += defaultPrompt + "\n";
  prompt += `제목: ${title}\n`;
  prompt += `내용: ${content}\n`;
  prompt += `장르: ${genre}\n`;
  prompt += `분위기: ${mood}\n`;
  prompt += `평점: ${rating}\n`;

  try {
    const queryParams = new URLSearchParams({
      content: prompt,
      client_id: API_CLIENT_ID,
    }).toString();

    const res = await fetch(
      `${API_URL}/api/v1/question/sse-streaming?${queryParams}`,
      {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
        },
      }
    );

    if (!res.ok) {
      console.error("API 응답 에러:", await res.text());
      return NextResponse.json(
        { error: "API 요청 실패" },
        { status: res.status }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = res.body.getReader();
        let buffer = ""; // 불완전한 데이터를 저장할 버퍼

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              if (buffer.length > 0) {
                // 남은 버퍼 처리
                controller.enqueue(encoder.encode(`data: ${buffer}\n\n`));
              }
              break;
            }

            // 새로운 청크를 버퍼에 추가
            buffer += decoder.decode(value, { stream: true });

            // 완전한 메시지들 처리
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // 마지막 불완전한 라인은 버퍼에 보관

            // 버퍼의 라인을 처리하는 부분
            for (const line of lines) {
              // data: 로 시작하는 라인만 처리
              if (line.trim().startsWith("data:")) {
                controller.enqueue(encoder.encode(`${line}\n\n`));

                try {
                  // data: 접두사를 제거하고 JSON 처리
                  const jsonStr = line.replace(/^data:\s*/, "").trim();

                  if (jsonStr) {
                    // 1. content 내의 큰따옴표를 이스케이프
                    const escapedContent = jsonStr.replace(
                      /{"type":\s*"([^"]+)",\s*"data":\s*{"content":\s*"(.*?)"}}/g,
                      (match, type, content) => {
                        // content 내의 큰따옴표를 이스케이프
                        const escapedInnerContent = content.replace(
                          /"/g,
                          '\\"'
                        );
                        return `{"type":"${type}","data":{"content":"${escapedInnerContent}"}}`;
                      }
                    );

                    // 2. 개행 문자 이스케이프 처리
                    const cleanedJson = escapedContent.replace(/\n/g, "\\n");

                    try {
                      const parsedData = JSON.parse(cleanedJson);

                      // 3. complete 타입일 때만 Firestore에 저장
                      if (parsedData.type === "complete" && postId) {
                        const postRef = doc(db, "posts", postId);
                        const postDoc = await getDoc(postRef);

                        if (postDoc.exists()) {
                          const tomongData = {
                            content: parsedData.data.content,
                            createdAt: Timestamp.now(),
                          };

                          const tomongLength = postDoc.data().tomong
                            ? postDoc.data().tomong.length
                            : 1;

                          await updateDoc(postRef, {
                            tomong: arrayUnion(tomongData),
                            tomongLength: tomongLength,
                          });
                        }
                      }
                    } catch (parseError) {
                      console.error(
                        "JSON 파싱 오류:",
                        parseError,
                        "원본 데이터:",
                        cleanedJson
                      );
                    }
                  }
                } catch (e) {
                  console.error(
                    "스트림 데이터 처리 오류:",
                    e,
                    "원본 라인:",
                    line
                  );
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream processing error:", error);
          controller.error(error);
        } finally {
          controller.close();
          const reset = await fetch(`${API_URL}/api/v1/reset-state`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ client_id: API_CLIENT_ID }),
          });

          if (!reset.ok) {
            console.error("API 리셋 요청 실패:", await reset.json());
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "X-Accel-Buffering": "no", // Nginx 버퍼링 비활성화
      },
    });
  } catch (error) {
    console.error("Stream error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
