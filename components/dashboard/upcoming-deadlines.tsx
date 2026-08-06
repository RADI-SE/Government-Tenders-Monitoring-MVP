"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { CalendarClock, ChevronRight } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useLanguage } from "@/app/components/language-provider";

export function UpcomingDeadlines() {
  const { tr, language } = useLanguage();
  const tasks = useQuery(api.tasks.getUpcoming, {});
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <header className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="flex items-center gap-2 font-bold text-slate-950"><CalendarClock className="h-4 w-4 text-indigo-600" />{tr("المواعيد القادمة", "Upcoming deadlines")}</h2><p className="mt-1 text-xs text-slate-500">{tr("مهام تحتاج إلى متابعة", "Tasks that need follow-up")}</p></div><Link href="/dashboard/tasks" className="text-xs font-bold text-indigo-600">{tr("عرض المهام", "View tasks")}</Link></header>
    <div className="divide-y divide-slate-100">{tasks?.slice(0, 4).map((task) => <Link href="/dashboard/tasks" key={task._id} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-indigo-50/40"><div className="min-w-0"><strong className="block truncate text-sm text-slate-900">{task.title}</strong><span className="mt-1 block text-xs text-slate-500">{task.dueDate ? new Date(task.dueDate).toLocaleDateString(language === "ar" ? "ar-SA" : "en-GB") : "—"}</span></div><ChevronRight className="h-4 w-4 text-slate-400 rtl:rotate-180" /></Link>)}{tasks !== undefined && !tasks.length ? <div className="p-8 text-center text-sm text-slate-500">{tr("لا توجد مواعيد قادمة.", "No upcoming deadlines.")}</div> : null}{tasks === undefined ? <div className="p-8 text-center text-sm text-slate-400">{tr("جاري التحميل...", "Loading...")}</div> : null}</div>
  </section>;
}
