import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import AppHeader from "@/components/AppHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StoryForge",
  description:
    "AI-powered TTRPG adventure generator with configurable storytelling parameters and structured narrative outputs.",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffffff",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#111827",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background min-h-screen antialiased`}
    >
      <body className="flex min-h-screen flex-col text-text">
        <AppHeader />

        <main className="flex-1 text-text">{children}</main>

        <span className="fixed right-2 bottom-2 text-xs text-muted opacity-70">
          v{process.env.NEXT_PUBLIC_APP_VERSION}
        </span>
      </body>
    </html>
  );
}
