"use client";
import { useLanguage } from "@/app/components/language-provider";
import { cn } from "@/lib/utils";

const labels: Record<string, [string, string]> = { new: ["جديدة", "New"], reviewing: ["قيد المراجعة", "Reviewing"], interested: ["مهتم", "Interested"], submitted: ["تم التقديم", "Submitted"], not_suitable: ["غير مناسبة", "Not suitable"], archived: ["مؤرشفة", "Archived"] };
const tones: Record<string, string> = { new: "border-blue-100 bg-blue-50 text-blue-700", reviewing: "border-amber-100 bg-amber-50 text-amber-700", interested: "border-emerald-100 bg-emerald-50 text-emerald-700", submitted: "border-violet-100 bg-violet-50 text-violet-700", not_suitable: "border-rose-100 bg-rose-50 text-rose-700", archived: "border-slate-200 bg-slate-100 text-slate-600" };

export function CompetitionStatus({ status }: { status?: string }) {
  const { tr } = useLanguage();
  const value = status || "unknown";
  const label = labels[value];
  return <span className={cn("inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold", tones[value] ?? "border-slate-200 bg-slate-50 text-slate-600")}>{label ? tr(label[0], label[1]) : tr("غير محدد", "Unknown")}</span>;
}
