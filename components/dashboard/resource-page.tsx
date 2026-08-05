"use client";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useLanguage } from "@/app/components/language-provider";

export function ResourcePage({ eyebrow, title, titleEn, subtitle, subtitleAr, icon: Icon, children }: { eyebrow: string; title: string; titleEn?: string; subtitle: string; subtitleAr?: string; icon: LucideIcon; children: ReactNode }) {
  const { tr } = useLanguage();
  return <div className="mx-auto max-w-[1600px] space-y-6 p-5 md:p-8"><header className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-indigo-950 via-indigo-700 to-cyan-500 p-7 text-white shadow-xl shadow-indigo-100"><div className="absolute -left-12 -top-16 h-52 w-52 rounded-full bg-emerald-300/25 blur-3xl" /><div className="relative flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/10"><Icon className="h-6 w-6 text-emerald-200" /></span><div><p className="text-[10px] font-bold tracking-[.16em] text-emerald-200">{eyebrow}</p><h1 className="mt-1 text-2xl font-bold md:text-3xl">{tr(title, titleEn ?? title)}</h1><p className="mt-2 text-sm text-indigo-100">{tr(subtitleAr ?? subtitle, subtitle)}</p></div></div></header>{children}</div>;
}
export function ResourceGrid({ children }: { children: ReactNode }) { return <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</section>; }
export function ResourceEmpty({ loading, label, labelAr }: { loading: boolean; label: string; labelAr?: string }) { const { tr } = useLanguage(); return <div className="col-span-full grid min-h-56 place-items-center rounded-2xl border border-dashed border-indigo-200 bg-white text-sm text-slate-500">{loading ? tr("جارٍ تحميل البيانات...", "Loading data...") : tr(labelAr ?? label, label)}</div>; }
