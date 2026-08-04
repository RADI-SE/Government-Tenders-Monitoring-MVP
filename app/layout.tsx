import type { Metadata } from "next";
import { LanguageProvider } from "./components/language-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "مرصد المنافسات | Spiders AI",
  description: "منصة تجريبية لرصد وتحليل وأرشفة المنافسات الحكومية",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl" suppressHydrationWarning><body><LanguageProvider>{children}</LanguageProvider></body></html>;
}
