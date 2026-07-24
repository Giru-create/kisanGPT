import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SkipToContent } from "@/components/navigation/SkipToContent";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "KisanGPT | Frontend Foundation",
  description:
    "AI-powered farming assistant design system & foundation for Indian farmers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <SkipToContent />
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
