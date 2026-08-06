"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowLeft, Archive, FileText, Radar, Sparkles } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useLanguage } from "@/app/components/language-provider";
import { MetricCard } from "@/components/dashboard/metric-card";
import { CompetitionStatus } from "@/components/competitions/competition-status";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";

export default function DashboardPage() {
  const { tr } = useLanguage();
  const tenders = useQuery(api.tenders.getActiveTenders) ?? [];
  const archivedTenders = useQuery(api.tenders.getArchivedTenders) ?? [];
  const active = tenders.filter(
    (tender) => tender.workflow_status !== "archived",
  );
  const interested = tenders.filter(
    (tender) => tender.workflow_status === "interested",
  ).length;
  const reviewing = tenders.filter(
    (tender) => tender.workflow_status === "reviewing",
  ).length;

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-5 md:p-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-indigo-950 via-indigo-700 to-cyan-500 p-7 text-white shadow-xl shadow-indigo-100 md:p-10">
        <div className="absolute -left-10 -top-20 h-64 w-64 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/30 bg-white/10 px-3 py-1.5 text-xs text-emerald-100">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
            {tr("رصد مباشر", "Live monitoring")}
          </div>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            {tr(
              "واجهتك الذكية نحو المنافسات الحكومية",
              "Your intelligent gateway to government tenders",
            )}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-indigo-100">
            {tr(
              "اكتشف الفرص المناسبة، رتّب أولويات فريقك، وتابع كل منافسة من الرصد حتى التقديم.",
              "Discover suitable opportunities, prioritize team work, and follow every tender from monitoring to submission.",
            )}
          </p>
          <Link
            href="/dashboard/competitions"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-indigo-800 shadow-lg"
          >
            <Radar className="h-4 w-4" />
            {tr("استعرض المنافسات", "Browse competitions")}
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <Sparkles className="absolute bottom-10 left-10 h-20 w-20 text-emerald-200/20" />
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title={tr("المنافسات النشطة", "Active competitions")}
          subtitle={tr("فرص قيد المتابعة", "Tracked opportunities")}
          value={active.length}
          icon={FileText}
          tone="indigo"
        />
        <MetricCard
          title={tr("قيد المراجعة", "Under review")}
          subtitle={tr("تحتاج قرار الفريق", "Awaiting team decision")}
          value={reviewing}
          icon={Radar}
          tone="amber"
        />
        <MetricCard
          title={tr("فرص مهتم بها", "Interested opportunities")}
          subtitle={tr("فرص ذات أولوية", "Prioritized opportunities")}
          value={interested}
          icon={Sparkles}
          tone="emerald"
        />
        <MetricCard
          title={tr("الأرشيف", "Archive")}
          subtitle={tr("سجلات محفوظة", "Saved records")}
          value={archivedTenders.length}
          icon={Archive}
          tone="cyan"
        />
      </div>
      <UpcomingDeadlines />
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="font-bold text-slate-950">
              {tr("أحدث المنافسات", "Latest competitions")}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {tr("آخر الفرص المضافة", "Most recently added opportunities")}
            </p>
          </div>
          <Link
            href="/dashboard/competitions"
            className="text-xs font-bold text-indigo-600"
          >
            {tr("عرض الكل", "View all")}
          </Link>
        </header>
        <div className="divide-y divide-slate-100">
          {tenders.slice(0, 5).map((tender) => (
            <div
              key={tender._id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50"
            >
              <div className="min-w-0">
                <strong className="block truncate text-sm text-slate-900">
                  {tender.tender_name}
                </strong>
                <span className="mt-1 block font-mono text-[10px] text-slate-400">
                  {tender.reference_number}
                </span>
              </div>
              <CompetitionStatus status={tender.workflow_status} />
            </div>
          ))}
          {!tenders.length && (
            <div className="p-10 text-center text-sm text-slate-500">
              {tr("لا توجد منافسات بعد.", "No tenders have been added yet.")}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
