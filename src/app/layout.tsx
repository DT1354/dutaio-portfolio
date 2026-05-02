import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dandelion in Space",
  description: "Each planet is a world I created. Scroll to explore with me.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}