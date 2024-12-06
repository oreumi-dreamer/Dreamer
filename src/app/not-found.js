import Error404 from "@/components/error404/Error404";
import { metadataMaker } from "@/utils/metadata";

export function generateMetadata() {
  return metadataMaker("DREAMER", "페이지를 찾을 수 없습니다.");
}

export default function NotFound() {
  return <Error404 />;
}
