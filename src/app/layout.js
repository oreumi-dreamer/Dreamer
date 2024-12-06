import "./reset.css";
import "./globals.css";
import "../../public/fonts/NanumBarunPenR/NanumBarunPenR.css";
import "../../public/fonts/NanumBarunPenB/NanumBarunPenB.css";
import Providers from "@/components/Providers";
import { metadataMaker } from "@/utils/metadata";

export const metadata = metadataMaker();

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
