import "./reset.css";
import "./globals.css";
import "../../public/fonts/NanumBarunPenR/NanumBarunPenR.css";
import "../../public/fonts/NanumBarunPenB/NanumBarunPenB.css";
import Providers from "@/components/Providers";
import { metadataMaker } from "@/utils/metadata";
import { themeScript } from "@/utils/themeScript";
import ThemeHandler from "@/components/theme/ThemeHandler";

export const metadata = metadataMaker();

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: "no",
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={themeScript()} />
      </head>
      <body>
        <ThemeHandler>
          <Providers>{children}</Providers>
        </ThemeHandler>
      </body>
    </html>
  );
}
