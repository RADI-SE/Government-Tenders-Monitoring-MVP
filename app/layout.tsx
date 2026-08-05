import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "../contexts/ConvexClientProvider";
import { LanguageProvider } from "./components/language-provider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spiders AI | Government Tender Monitoring",
  description: "Government tender intelligence and follow-up workspace.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl" suppressHydrationWarning><body className={`${geistSans.variable} ${geistMono.variable} antialiased`}><ClerkProvider afterSignOutUrl="/sign-in"><ConvexClientProvider><LanguageProvider>{children}</LanguageProvider></ConvexClientProvider></ClerkProvider></body></html>;
}
