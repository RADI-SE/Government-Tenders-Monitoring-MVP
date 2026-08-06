"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { ArrowRight, Search } from "lucide-react";
import { useLanguage } from "./components/language-provider";
import { WebPattern } from "@/components/brand/spiders-brand";
import { LandingHeader } from "@/components/home/landing-header";
import { HeroArtwork } from "@/components/home/hero-artwork";

export default function HomePage() {
  const { tr, language } = useLanguage();
  const { isSignedIn } = useAuth();

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f4fffb_0%,#f4faff_48%,#eef1ff_100%)] text-slate-950">
      <LandingHeader />
      <section className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-5 py-12 md:px-8 lg:grid-cols-[1.02fr_.98fr] lg:py-16">
        <WebPattern className="pointer-events-none absolute -left-56 -top-48 h-[34rem] w-[34rem] text-cyan-500/[0.08]" />
        <div className="pointer-events-none absolute right-[-15rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/75 px-3 py-2 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            {tr(
              "رصد ذكي للمنافسات الحكومية",
              "Intelligent government tender monitoring",
            )}
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.22] tracking-tight text-indigo-950 md:text-6xl">
            {tr(
              "حوّل الفرص الحكومية إلى قرارات أوضح.",
              "Turn government opportunities into clearer decisions.",
            )}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            {tr(
              "ابحث في المنافسات الحالية والمؤرشفة، راجع التحليل الذكي، وحوّل الفرصة المناسبة إلى متابعة واضحة لفريقك.",
              "Search live and archived tenders, review AI-assisted analysis, and turn the right opportunity into a clear team follow-up.",
            )}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-up"}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-800"
            >
              {isSignedIn
                ? tr("فتح لوحة التحكم", "Open dashboard")
                : tr("ابدأ الآن", "Get started")}
              <ArrowRight
                className={`h-4 w-4 ${language === "ar" ? "rotate-180" : ""}`}
              />
            </Link>
            <Link
              href="/dashboard/competitions"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-white/85 px-5 py-3.5 text-sm font-bold text-indigo-800 shadow-sm backdrop-blur transition hover:bg-white"
            >
              <Search className="h-4 w-4" />
              {tr("استعراض المنافسات", "Explore tenders")}
            </Link>
          </div>
        </div>
        <HeroArtwork />
      </section>
    </main>
  );
}
