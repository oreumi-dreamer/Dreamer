import PostComponent from "@/components/post/Post";
import { metadataMaker } from "@/utils/metadata";
import styles from "./page.module.css";

// 메타데이터 생성
export async function generateMetadata({ params }) {
  let title = "로드 중...";
  let description = "로드 중...";
  const { postId } = params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${baseUrl}/api/post/search/${postId}`);
  const data = await res.json();

  if (!data.post) {
    return metadataMaker("DREAMER", "게시글을 찾을 수 없습니다.");
  }

  const contentPreview = data.post.content
    .replaceAll("\r\n", " ")
    .replaceAll("  ", " ");
  const slicedContent =
    contentPreview.length > 100
      ? contentPreview.slice(0, 100) + "..."
      : contentPreview;

  title = `${data.post.title} - DREAMER`;
  description = slicedContent;

  return metadataMaker(title, description);
}

export default function Post({ params }) {
  const { postId } = params;

  return (
    <main className={styles["main"]}>
      <PostComponent postId={postId} />
    </main>
  );
}
