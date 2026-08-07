"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import {
  BellRing,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  File,
  ListTodo,
  Paperclip,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useLanguage } from "@/app/components/language-provider";
import { CompetitionStatus } from "./competition-status";

type CreateTask = (args: {
  tenderId: Doc<"tenders">["_id"];
  title: string;
  description?: string;
  status: "todo";
  priority: "medium" | "high";
  dueDate?: number;
}) => Promise<unknown>;

export function TenderDetails({
  tender,
  createTask,
}: {
  tender: Doc<"tenders">;
  createTask: CreateTask;
}) {
  const { tr, language } = useLanguage();
  const analysis = useQuery(api.aiAnalysis.getByTender, {
    tenderId: tender._id,
  });
  const attachments = useQuery(api.attachments.getByTender, {
    tenderId: tender._id,
  });
  const tasks = useQuery(api.tasks.getByTender, { tenderId: tender._id });
  const [status, setStatus] = useState(tender.original_status);
  const [reminder, setReminder] = useState("");
  const [savedReminder, setSavedReminder] = useState("");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const score = analysis?.opportunityScore ?? tender.opportunity_score ?? 0;
  const classification =
    analysis?.classification ??
    tender.classification ??
    tr("غير مصنف", "Unclassified");
  const summary =
    analysis?.summary ??
    tender.ai_summary ??
    tender.description ??
    tr("لا يتوفر ملخص بعد.", "No summary is available yet.");
  const isMock = !analysis;
  const dateLocale = language === "ar" ? "ar-SA" : "en-GB";

  async function convertToTask() {
    setCreating(true);
    setMessage("");
    try {
      await createTask({
        tenderId: tender._id,
        title: `${tr("متابعة", "Follow up")}: ${tender.tender_name}`,
        description: summary,
        status: "todo",
        priority: score >= 80 ? "high" : "medium",
        dueDate: tender.last_submission_date
          ? new Date(tender.last_submission_date).getTime()
          : undefined,
      });
      setMessage(
        tr(
          "تم إنشاء المهمة في قاعدة البيانات.",
          "Task created in the database.",
        ),
      );
    } catch {
      setMessage(tr("تعذر إنشاء المهمة.", "Could not create the task."));
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      <header className="overflow-hidden rounded-3xl bg-gradient-to-l from-indigo-950 via-indigo-700 to-cyan-500 p-7 text-white shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-4xl">
            <p className="font-mono text-xs text-emerald-200">
              {tender.reference_number}
            </p>
            <h1 className="mt-3 text-2xl font-bold leading-10 md:text-3xl">
              {tender.tender_name}
            </h1>
            <p className="mt-3 text-sm leading-7 text-indigo-100">
              {tender.description}
            </p>
          </div>
          <CompetitionStatus status={status} />
        </div>
      </header>
      <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
        <main className="space-y-5">
          <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-indigo-600 text-white">
                  <BrainCircuit className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-bold">
                    {tr("تحليل الفرصة", "Opportunity analysis")}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isMock
                      ? tr(
                          "ملخص تجريبي مبني على البيانات المخزنة",
                          "Demo summary based on stored data",
                        )
                      : tr(
                          "تحليل محفوظ في قاعدة البيانات",
                          "Analysis stored in the database",
                        )}
                  </p>
                </div>
              </div>
              <strong className="text-3xl text-indigo-700">{score}%</strong>
            </div>
            <p className="mt-5 text-sm leading-8 text-slate-600">{summary}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-indigo-50 p-4">
                <span className="text-xs text-slate-500">
                  {tr("التصنيف", "Classification")}
                </span>
                <strong className="mt-1 block text-indigo-800">
                  {classification}
                </strong>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4">
                <span className="text-xs text-slate-500">
                  {tr("التوصية", "Recommendation")}
                </span>
                <strong className="mt-1 block text-emerald-800">
                  {analysis?.recommendation ?? tr("مراجعة", "Review")}
                </strong>
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs leading-6 text-amber-900">
              <Sparkles className="mb-2 h-4 w-4" />
              <strong>
                {tr("كيف تُحسب الدرجة؟", "How is the score calculated?")}
              </strong>
              <p>
                {tr(
                  "تعتمد درجة العرض التجريبي على ملاءمة التصنيف، وضوح المتطلبات، المخاطر، والوقت المتبقي. إذا توفر تحليل خلفي، تُعرض درجته المخزنة كما هي.",
                  "The demo score considers category fit, requirement clarity, risks, and remaining time. When backend analysis exists, its stored score is shown directly.",
                )}
              </p>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Paperclip className="h-5 w-5 text-indigo-600" />
              <h2 className="font-bold">
                {tr("الوثائق والمرفقات", "Documents and attachments")}
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {attachments?.map((file) => (
                <a
                  key={file._id}
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 hover:border-indigo-300"
                >
                  <File className="h-5 w-5 text-indigo-500" />
                  <span className="min-w-0">
                    <strong className="block truncate text-sm">
                      {file.title}
                    </strong>
                    <small className="uppercase text-slate-400">
                      {file.type}
                    </small>
                  </span>
                </a>
              ))}
              {attachments && attachments.length === 0 && (
                <p className="text-sm text-slate-500">
                  {tr("لا توجد مرفقات مرتبطة.", "No linked attachments.")}
                </p>
              )}
            </div>
          </section>
        </main>
        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-bold">
              {tr("إجراءات المنافسة", "Tender actions")}
            </h2>
            <label className="grid gap-2 text-xs font-semibold text-slate-600">
              {tr("حالة العرض التجريبي", "Demo status")}
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as typeof status)
                }
                className="h-11 rounded-xl border border-slate-200 px-3"
              >
                <option value="new">{tr("جديدة", "New")}</option>
                <option value="reviewing">
                  {tr("قيد المراجعة", "Reviewing")}
                </option>
                <option value="interested">{tr("مهتم", "Interested")}</option>
                <option value="not_suitable">
                  {tr("غير مناسبة", "Not suitable")}
                </option>
                <option value="submitted">
                  {tr("تم التقديم", "Submitted")}
                </option>
                <option value="archived">{tr("مؤرشفة", "Archived")}</option>
              </select>
              <small className="font-normal text-amber-600">
                {tr(
                  "محلي فقط حتى تتوفر طفرة تحديث المنافسة.",
                  "Local only until a tender update mutation is available.",
                )}
              </small>
            </label>
            <button
              onClick={convertToTask}
              disabled={creating}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              <ListTodo className="h-4 w-4" />
              {creating
                ? tr("جارٍ الإنشاء...", "Creating...")
                : tr("تحويل إلى مهمة", "Convert to task")}
            </button>
            {tasks && tasks.length > 0 && (
              <p className="mt-3 flex items-center gap-2 text-xs text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                {tr(
                  `${tasks.length} مهمة مرتبطة`,
                  `${tasks.length} linked task(s)`,
                )}
              </p>
            )}
            {message && (
              <p className="mt-3 text-xs text-indigo-700">{message}</p>
            )}
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <BellRing className="h-5 w-5 text-amber-500" />
              <h2 className="font-bold">
                {tr("محاكاة التذكير", "Reminder simulation")}
              </h2>
            </div>
            {tender.last_submission_date && (
              <p className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                <CalendarClock className="h-4 w-4" />
                {tr("آخر موعد", "Deadline")}:{" "}
                {new Date(tender.last_submission_date).toLocaleDateString(
                  dateLocale,
                )}
              </p>
            )}
            <input
              type="datetime-local"
              value={reminder}
              onChange={(event) => setReminder(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
            />
            <button
              onClick={() => setSavedReminder(reminder)}
              disabled={!reminder}
              className="mt-3 w-full rounded-xl border border-indigo-200 px-4 py-2.5 text-sm font-bold text-indigo-700 disabled:opacity-40"
            >
              {tr("حفظ التذكير التجريبي", "Save demo reminder")}
            </button>
            {savedReminder && (
              <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">
                {tr("تذكير نشط", "Active reminder")}:{" "}
                {new Date(savedReminder).toLocaleString(dateLocale)}
              </p>
            )}
            <p className="mt-3 flex gap-2 text-[10px] leading-5 text-amber-700">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              {tr(
                "هذا تذكير محلي تجريبي حتى تتوفر واجهة reminders في الخلفية.",
                "This is a local demo reminder until reminder backend APIs are available.",
              )}
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}
