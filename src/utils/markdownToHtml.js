import { marked } from "marked";

export default function convertToHtml(text) {
  if (!text) return "";

  const preprocessed = text.replace(/\\n/g, "\n");

  // 커스텀 renderer 생성
  const renderer = new marked.Renderer();

  // link 렌더링 함수 오버라이드
  renderer.link = () => "";

  // marked 옵션 설정
  marked.setOptions({
    renderer: renderer, // 커스텀 renderer 적용
    breaks: true,
    gfm: true,
    headerIds: false,
  });

  return marked(preprocessed);
}
