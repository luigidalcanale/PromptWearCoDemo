import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ScrollToTop } from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Business Command Center — PromptWear Co.",
  description: "A portfolio demo showing how AI can support daily operations for a small online apparel company.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full bg-gray-50">
        <div className="flex h-full">
          <Sidebar />
          <main className="flex-1 overflow-y-auto" id="main-scroll">
            <ScrollToTop />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
