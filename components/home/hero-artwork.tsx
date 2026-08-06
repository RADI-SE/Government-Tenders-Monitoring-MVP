"use client";

import { Radar, Search, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useLanguage } from "@/app/components/language-provider";
import { SpiderWebMark, WebPattern } from "@/components/brand/spiders-brand";

function FloatingInsight({
  className,
  icon,
  title,
  detail,
}: {
  className: string;
  icon: ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div
      className={`brand-float absolute z-10 flex items-center gap-3 rounded-2xl p-3.5 shadow-xl backdrop-blur ${className}`}
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
        {icon}
      </span>
      <span>
        <strong className="block text-xs">{title}</strong>
        <small className="text-[10px] opacity-70">{detail}</small>
      </span>
    </div>
  );
}

export function HeroArtwork() {
  const { tr } = useLanguage();
  return (
    <div className="relative hidden min-h-[570px] lg:block">
      <div className="absolute inset-4 rotate-3 rounded-[3rem] bg-gradient-to-br from-emerald-300 via-cyan-400 to-indigo-600 opacity-35 blur-2xl" />
      <div className="absolute inset-8 overflow-hidden rounded-[2.5rem] bg-[linear-gradient(140deg,#86efac_0%,#42cbd5_38%,#3155ef_75%,#2224a8_100%)] p-8 text-white shadow-2xl shadow-indigo-300/40">
        <WebPattern className="absolute -right-28 -top-28 h-[28rem] w-[28rem] text-white/15" />
        <WebPattern className="absolute -bottom-44 -left-40 h-[28rem] w-[28rem] text-indigo-950/10" />
        <Sparkles className="absolute right-20 top-16 h-7 w-7 text-white/90" />
        <span className="relative inline-grid h-16 w-16 place-items-center rounded-2xl border border-white/25 bg-white/15 backdrop-blur">
          <SpiderWebMark className="h-12 w-12 text-white" />
        </span>
        <div className="relative mt-24 max-w-md">
          <p className="text-xs font-extrabold tracking-[0.22em] text-indigo-950/70">
            SPIDERS AI
          </p>
          <h2 className="mt-3 text-4xl font-black leading-tight">
            {tr("طريقتك الجديدة للعمل", "Your new way of working")}
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
            {tr(
              "مساحة واحدة للرصد والتحليل والمتابعة.",
              "One workspace for monitoring, analysis, and follow-up.",
            )}
          </p>
        </div>
        <div className="relative mt-10 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/25 bg-white/15 p-4 backdrop-blur-md">
            <Radar className="mb-4 h-5 w-5" />
            <strong className="text-2xl">24/7</strong>
            <span className="mt-1 block text-xs text-white/75">
              {tr("رصد مستمر", "Continuous monitoring")}
            </span>
          </div>
          <div className="rounded-2xl border border-white/25 bg-white/15 p-4 backdrop-blur-md">
            <Sparkles className="mb-4 h-5 w-5" />
            <strong className="text-2xl">AI</strong>
            <span className="mt-1 block text-xs text-white/75">
              {tr("تقييم ذكي للفرص", "Smart opportunity scoring")}
            </span>
          </div>
        </div>
      </div>
      <FloatingInsight
        className="-left-5 top-28 border border-white/70 bg-white/90 text-indigo-950 shadow-indigo-300/25"
        icon={<Search className="h-4 w-4 text-emerald-700" />}
        title={tr("بحث الأرشيف", "Archive search")}
        detail={tr("نتائج فورية", "Instant results")}
      />
      <FloatingInsight
        className="brand-float-delay -right-4 bottom-24 border border-white/25 bg-indigo-950/90 text-white"
        icon={<Sparkles className="h-4 w-4 text-cyan-200" />}
        title={tr("ملخص ذكي جاهز", "AI summary ready")}
        detail={tr("الفرصة ٨٧٪", "Opportunity 87%")}
      />
    </div>
  );
}
