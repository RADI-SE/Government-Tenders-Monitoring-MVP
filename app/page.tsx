"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { LanguageToggle, useLanguage } from "./components/language-provider";

export default function HomePage() {
  const { tr } = useLanguage();
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8ff] text-slate-950">
      <nav className="relative z-10 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 via-cyan-400 to-indigo-600 text-xl text-white shadow-lg">✦</span><span><strong className="block text-indigo-950">Spiders AI</strong><small className="text-[10px] text-slate-400">{tr("طريقتك الجديدة للعمل", "Your new way of working")}</small></span></Link>
        <div className="flex items-center gap-2"><LanguageToggle /><Link href="/sign-in" className="rounded-xl px-4 py-2.5 text-sm font-bold text-indigo-800 hover:bg-white">{tr("تسجيل الدخول", "Login")}</Link><Link href="/sign-up" className="rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-800">{tr("إنشاء حساب", "Sign up")}</Link></div>
      </nav>

      <section className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-5 py-16 md:px-8 lg:grid-cols-[1.05fr_.95fr]">
        <div className="absolute right-[-18rem] top-[-12rem] h-[38rem] w-[38rem] rounded-full bg-emerald-200/45 blur-3xl" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-2 text-xs font-bold text-emerald-700"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />{tr("رصد مباشر للمنافسات الحكومية", "Live government tender monitoring")}</span>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.35] text-indigo-950 md:text-6xl">{tr("واجهتك الذكية نحو المنافسات الحكومية", "Your intelligent gateway to government tenders")}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">{tr("اكتشف الفرص المناسبة، راجع تفاصيلها، ونظّم مهام فريقك من مساحة عمل واحدة واضحة وسريعة.", "Discover, evaluate, and follow up on government opportunities in one focused workspace.")}</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/sign-up" className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-200 hover:-translate-y-0.5">{tr("ابدأ الآن", "Get started")} <ArrowLeft className="h-4 w-4" /></Link><Link href="/dashboard" className="rounded-xl border border-indigo-100 bg-white px-5 py-3.5 text-sm font-bold text-indigo-800 shadow-sm hover:bg-indigo-50">{tr("استعراض المنصة", "Explore platform")}</Link></div>
        </div>

        <div className="relative hidden min-h-[570px] lg:block"><div className="absolute inset-0 rotate-3 rounded-[3rem] bg-gradient-to-br from-emerald-300 via-cyan-400 to-indigo-700 opacity-30 blur-2xl" /><div className="absolute inset-8 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-950 via-indigo-700 to-blue-500 p-8 text-white shadow-2xl"><div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" /><Sparkles className="relative h-9 w-9 text-emerald-300" /><p className="relative mt-28 text-sm text-indigo-200">SPIDERS AI</p><h2 className="relative mt-3 text-4xl font-bold leading-snug">{tr("طريقتك الجديدة للعمل", "Your new way of working.")}</h2><div className="relative mt-10 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"><strong className="text-2xl">24/7</strong><span className="mt-1 block text-xs text-indigo-200">{tr("رصد مستمر", "Continuous monitoring")}</span></div><div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"><strong className="text-2xl">AI</strong><span className="mt-1 block text-xs text-indigo-200">{tr("تقييم ذكي للفرص", "Smart opportunity scoring")}</span></div></div></div></div>
      </section>
    </main>
  );
}
