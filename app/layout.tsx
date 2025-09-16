import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Powered Image Name Generator",
  description: "Generate descriptive image names with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
