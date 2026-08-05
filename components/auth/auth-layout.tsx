"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { LanguageToggle, useLanguage } from "@/app/components/language-provider";
import { BrandLockup, SpiderWebMark, WebPattern } from "@/components/brand/spiders-brand";

export function AuthLayout({ children }: { children: ReactNode }) {
  const { tr } = useLanguage();

  return (
    <main className="grid min-h-screen bg-[linear-gradient(135deg,#f4fffb,#f5f7ff)] lg:grid-cols-[1fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-[linear-gradient(145deg,#86efac_0%,#39c4d4_32%,#3155ef_72%,#1e1d8f_100%)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <WebPattern className="absolute -left-40 -top-40 h-[34rem] w-[34rem] text-white/15" />
        <WebPattern className="absolute -bottom-48 -right-40 h-[32rem] w-[32rem] text-indigo-950/10" />
        <Link href="/" className="relative"><BrandLockup tagline={tr("طريقتك الجديدة للعمل", "Your new way of working")} inverse /></Link>
        <div className="relative max-w-xl">
          <span className="inline-grid h-14 w-14 place-items-center rounded-2xl border border-white/25 bg-white/15 backdrop-blur"><SpiderWebMark className="h-10 w-10" /></span>
          <p className="mt-8 flex items-center gap-2 text-xs font-extrabold tracking-[0.2em] text-indigo-950/70"><Sparkles className="h-4 w-4" /> SPIDERS AI</p>
          <h1 className="mt-4 text-4xl font-black leading-snug">{tr("راقب الفرص، حلّلها، ونظّم عمل فريقك.", "Monitor opportunities, analyze them, and organize your team.")}</h1>
          <p className="mt-4 max-w-lg leading-8 text-white/80">{tr("مساحة عمل واحدة للمنافسات والتحليلات والمهام والوثائق والمواعيد.", "One focused workspace for competitions, analysis, tasks, documents, and deadlines.")}</p>
        </div>
        <p className="relative text-xs text-white/60">© 2026 Spiders AI</p>
      </section>
      <section className="relative flex items-center justify-center px-5 py-12">
        <div className="absolute end-5 top-5 flex items-center gap-3"><LanguageToggle /><Link href="/" className="text-sm font-bold text-indigo-700 lg:hidden">Spiders AI</Link></div>
        <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-7 shadow-2xl shadow-indigo-100/80 backdrop-blur md:p-9">{children}</div>
      </section>
    </main>
  );
}
