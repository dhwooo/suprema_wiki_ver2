import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Suprema G-SDK 문서",
  description: "Suprema G-SDK의 Gateway, 장치, 사용자, 출입통제 API를 한국어로 탐색하는 문서 허브입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
