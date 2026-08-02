import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { SkipToContent } from "@/components/navigation/SkipToContent";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: "KisanGPT | AI Farming Assistant",
  description:
    "AI-powered farming assistant for Indian farmers — crop advisory, weather intelligence, market prices, and government schemes.",
  openGraph: {
    title: "KisanGPT | AI Farming Assistant",
    description:
      "AI-powered farming assistant for Indian farmers — crop advisory, weather intelligence, market prices, and government schemes.",
    type: "website",
    locale: "en_IN",
    siteName: "KisanGPT",
  },
  twitter: {
    card: "summary_large_image",
    title: "KisanGPT | AI Farming Assistant",
    description:
      "AI-powered farming assistant for Indian farmers — crop advisory, weather intelligence, market prices, and government schemes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeScript = `try{var t=localStorage.getItem('kisangpt-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <SkipToContent />
          <AppShell>
            <Suspense>{children}</Suspense>
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}
