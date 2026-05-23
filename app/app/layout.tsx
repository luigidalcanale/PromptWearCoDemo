import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DemoBanner } from "@/components/DemoBanner";
import { OnboardingDialog } from "@/components/OnboardingDialog";
import { CommandPalette } from "@/components/CommandPalette";
import { RecruiterMode } from "@/components/RecruiterMode";
import { Toaster } from "@/components/Toaster";
import { TopBar } from "@/components/TopBar";
import { AIChatWidget } from "@/components/AIChatWidget";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
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
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full bg-background text-foreground">
        <ThemeProvider>
          <Toaster>
            <DemoBanner />
            <div className="flex h-[calc(100%-2rem)]">
              <Sidebar />
              <main className="flex-1 overflow-y-auto" id="main-scroll">
                <ScrollToTop />
                <Suspense fallback={null}>
                  <RecruiterMode />
                </Suspense>
                <TopBar />
                {children}
              </main>
            </div>
            <OnboardingDialog />
            <CommandPalette />
            <AIChatWidget />
          </Toaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
