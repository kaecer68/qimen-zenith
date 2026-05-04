import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "奇門遁甲 · 日家奇門排盤系統",
  description: "專業級日家奇門遁甲排盤與分析系統，融合傳統易學智慧與現代科技",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&family=Noto+Serif+TC:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
