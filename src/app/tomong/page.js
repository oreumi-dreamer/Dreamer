import { metadataMaker } from "@/utils/metadata";
import TomongComponent from "@/components/tomong/Tomong";

export async function generateMetadata() {
  return metadataMaker("토몽: DREAMER", "DREAMER의 꿈 해몽 서비스입니다.");
}

export default function Tomong() {
  return <TomongComponent />;
}
