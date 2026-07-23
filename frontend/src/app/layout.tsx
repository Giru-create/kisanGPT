import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KisanGPT",
  description: "AI-powered farming assistant for Indian farmers",
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
