"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { DatabaseZap, History, ScanSearch } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useLanguage } from "@/app/components/language-provider";
import {
  ResourceEmpty,
  ResourcePage,
} from "@/components/dashboard/resource-page";
import { LatestImportSummary } from "@/components/dashboard/latest-import-summary";

const mockResults = [
  "Cloud infrastructure operations",
  "Cybersecurity assessment",
  "Data analytics platform",
];

export default function ImportsPage() {
  const { tr, language } = useLanguage();
  const jobs = useQuery(api.importJobs.getHistory, {});
  const startJob = useMutation(api.importJobs.startJob);
  const completeJob = useMutation(api.importJobs.completeJob);
  const failJob = useMutation(api.importJobs.failJob);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  async function runMockScan() {
    setScanning(true);
    let jobId: Awaited<ReturnType<typeof startJob>> | undefined;
    try {
      jobId = await startJob({ source: "etimad" });
      await completeJob({
        jobId,
        totalFetched: mockResults.length,
        totalImported: mockResults.length,
        totalSkipped: 0,
        totalFailed: 0,
      });
      setResults(mockResults);
    } catch (error) {
      if (jobId)
        await failJob({
          jobId,
          errorMessage:
            error instanceof Error ? error.message : "Mock scan failed",
        });
    } finally {
      setScanning(false);
    }
  }

  return (
    <ResourcePage
      eyebrow="DATA OPERATIONS"
      title="سجل الاستيراد"
      titleEn="Data imports"
      subtitle="Etimad, CSV, and manual import activity."
      subtitleAr="سجل عمليات الاستيراد التجريبية وملفات CSV والإدخال اليدوي."
      icon={History}
    >
      <LatestImportSummary />
      <section className="rounded-2xl border border-indigo-100 bg-gradient-to-l from-indigo-50 to-emerald-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-indigo-950">
              {tr("تشغيل فحص تجريبي", "Run a mock scan")}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {tr(
                "يسجل عملية استيراد تجريبية في الخلفية ولا يدّعي اتصالاً حياً بمنصة اعتماد.",
                "Records a simulated import job in the backend; it does not claim live Etimad access.",
              )}
            </p>
          </div>
          <button
            onClick={runMockScan}
            disabled={scanning}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            <ScanSearch className="h-4 w-4" />
            {scanning
              ? tr("جارٍ الفحص...", "Scanning...")
              : tr("ابدأ الفحص", "Start scan")}
          </button>
        </div>
        {results.length > 0 && (
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            {results.map((title) => (
              <div
                key={title}
                className="rounded-xl border border-white bg-white/80 p-3 text-xs font-semibold text-slate-700"
              >
                {title}
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {jobs?.map((job) => (
          <div
            key={job._id}
            className="grid gap-3 border-b border-slate-100 p-5 last:border-0 md:grid-cols-[1fr_repeat(4,120px)] md:items-center"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <DatabaseZap className="h-4 w-4" />
              </span>
              <div>
                <strong className="block text-sm capitalize">
                  {job.source}
                </strong>
                <small className="text-slate-400">
                  {new Date(job.startedAt).toLocaleString(
                    language === "ar" ? "ar-SA" : "en-GB",
                  )}
                </small>
              </div>
            </div>
            <span className="text-xs">
              <b className="block text-slate-900">{job.totalFetched}</b>
              {tr("تم جلبها", "Fetched")}
            </span>
            <span className="text-xs">
              <b className="block text-emerald-600">{job.totalImported}</b>
              {tr("تم استيرادها", "Imported")}
            </span>
            <span className="text-xs">
              <b className="block text-amber-600">{job.totalSkipped}</b>
              {tr("تم تجاوزها", "Skipped")}
            </span>
            <span className="w-fit rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
              {job.status}
            </span>
          </div>
        ))}
        {!jobs?.length && (
          <ResourceEmpty
            loading={jobs === undefined}
            label="No import jobs recorded yet."
            labelAr="لا توجد عمليات استيراد بعد."
          />
        )}
      </section>
    </ResourcePage>
  );
}
