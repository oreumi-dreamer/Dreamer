import { marked } from "marked";

export default function convertToHtml(text) {
  if (!text) return "";

  // \n을 실제 줄바꿈으로 변환
  const preprocessed = text.replace(/\\n/g, "\n");

  // marked 옵션 설정
  marked.setOptions({
    breaks: true, // \n을 <br>로 변환
    gfm: true, // GitHub Flavored Markdown 활성화
    headerIds: false, // 헤더에 자동 ID 비활성화
  });

  return marked(preprocessed);
}
