"use client";

import { useLanguage } from "@/app/components/language-provider";
import { cn } from "@/lib/utils";

const labels: Record<string, [string, string]> = {
  // Internal workflow
  new: ["جديدة", "New"],
  reviewing: ["قيد المراجعة", "Reviewing"],
  interested: ["مهتم", "Interested"],
  submitted: ["تم التقديم", "Submitted"],
  not_suitable: ["غير مناسبة", "Not suitable"],
  archived: ["مؤرشفة", "Archived"],

  // Original Etimad statuses
  معتمدة: ["معتمدة", "Approved"],
  "تم اعتماد الترسية": ["تم اعتماد الترسية", "Awarded"],
  "تم اعتماد الترسية المبدئي": [
    "تم اعتماد الترسية المبدئي",
    "Preliminary Award",
  ],
  "مرحلة الترسية": ["مرحلة الترسية", "Award Stage"],
  "تم الإلغاء": ["تم الإلغاء", "Cancelled"],
  "تم فتح العروض": ["تم فتح العروض", "Offers Opened"],
  "مرحلة فتح العروض": ["مرحلة فتح العروض", "Opening Offers"],
  "مرحلة فحص العروض": ["مرحلة فحص العروض", "Evaluation Stage"],
};

const tones: Record<string, string> = {
  // Workflow
  new: "border-blue-100 bg-blue-50 text-blue-700",
  reviewing: "border-amber-100 bg-amber-50 text-amber-700",
  interested: "border-emerald-100 bg-emerald-50 text-emerald-700",
  submitted: "border-violet-100 bg-violet-50 text-violet-700",
  not_suitable: "border-rose-100 bg-rose-50 text-rose-700",
  archived: "border-slate-200 bg-slate-100 text-slate-600",

  // Etimad
  معتمدة: "border-green-100 bg-green-50 text-green-700",
  "تم اعتماد الترسية": "border-emerald-100 bg-emerald-50 text-emerald-700",
  "تم اعتماد الترسية المبدئي": "border-lime-100 bg-lime-50 text-lime-700",
  "مرحلة الترسية": "border-indigo-100 bg-indigo-50 text-indigo-700",
  "تم الإلغاء": "border-red-100 bg-red-50 text-red-700",
  "تم فتح العروض": "border-cyan-100 bg-cyan-50 text-cyan-700",
  "مرحلة فتح العروض": "border-sky-100 bg-sky-50 text-sky-700",
  "مرحلة فحص العروض": "border-amber-100 bg-amber-50 text-amber-700",
};

export function CompetitionStatus({ status }: { status?: string }) {
  const { tr } = useLanguage();

  const value = status?.trim() || "";
  const label = labels[value];

  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
        tones[value] ?? "border-slate-200 bg-slate-50 text-slate-600",
      )}
    >
      {label ? tr(label[0], label[1]) : value || tr("غير محدد", "Unknown")}
    </span>
  );
}
