"use client";

import { useQuery } from "convex/react";
import { CheckCircle2, Clock3, DatabaseZap, XCircle } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useLanguage } from "@/app/components/language-provider";

export function LatestImportSummary() {
  const { tr, language } = useLanguage();
  const job = useQuery(api.importJobs.getLatestJob, {});
  if (!job) return null;
  const Icon = job.status === "completed" ? CheckCircle2 : job.status === "failed" ? XCircle : Clock3;
  return <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><DatabaseZap className="h-5 w-5" /></span><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-slate-500">{tr("آخر عملية استيراد", "Latest import")}</p><strong className="mt-1 block text-sm capitalize text-slate-950">{job.source} · {new Date(job.startedAt).toLocaleString(language === "ar" ? "ar-SA" : "en-GB")}</strong></div><span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"><Icon className="h-4 w-4" />{job.status}</span><div className="flex gap-5 text-center text-xs"><span><b className="block text-base text-slate-950">{job.totalFetched}</b>{tr("تم جلبها", "Fetched")}</span><span><b className="block text-base text-emerald-600">{job.totalImported}</b>{tr("مستوردة", "Imported")}</span></div></section>;
}
