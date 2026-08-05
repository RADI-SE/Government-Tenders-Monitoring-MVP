"use client";
import { useQuery } from "convex/react";
import { CalendarClock, ListTodo } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useLanguage } from "@/app/components/language-provider";
import { ResourceEmpty, ResourceGrid, ResourcePage } from "@/components/dashboard/resource-page";

const statusLabels: Record<string, [string, string]> = { todo: ["للعمل", "To do"], in_progress: ["قيد التنفيذ", "In progress"], completed: ["مكتملة", "Completed"], cancelled: ["ملغاة", "Cancelled"] };
const priorityLabels: Record<string, [string, string]> = { low: ["منخفضة", "Low"], medium: ["متوسطة", "Medium"], high: ["عالية", "High"], urgent: ["عاجلة", "Urgent"] };

export default function TasksPage() {
  const { tr, language } = useLanguage();
  const tasks = useQuery(api.tasks.getAll, {});
  return <ResourcePage eyebrow="WORKFLOW" title="المهام والمتابعات" titleEn="Workflow" subtitle="Tasks and follow-ups connected to tender records." subtitleAr="مهام الفريق والمتابعات المرتبطة بالمنافسات." icon={ListTodo}><ResourceGrid>{tasks?.map((task) => { const status = statusLabels[task.status]; const priority = priorityLabels[task.priority]; return <article key={task._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">{status ? tr(status[0], status[1]) : task.status}</span><span className="text-[10px] font-bold uppercase text-amber-600">{priority ? tr(priority[0], priority[1]) : task.priority}</span></div><h2 className="mt-4 font-bold text-slate-950">{task.title}</h2><p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-500">{task.description || tr("لا يوجد وصف.", "No description added.")}</p>{task.dueDate && <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500"><CalendarClock className="h-4 w-4 text-indigo-500" />{new Date(task.dueDate).toLocaleDateString(language === "ar" ? "ar-SA" : "en-GB")}</div>}</article>; })}{!tasks?.length && <ResourceEmpty loading={tasks === undefined} label="No tasks yet." labelAr="لا توجد مهام بعد." />}</ResourceGrid></ResourcePage>;
}
