"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { CalendarClock, ListTodo, Plus } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useLanguage } from "@/app/components/language-provider";
import {
  ResourceEmpty,
  ResourceGrid,
  ResourcePage,
} from "@/components/dashboard/resource-page";
import {
  CrudDialog,
  fieldClass,
  FormActions,
  labelClass,
  ResourceActions,
} from "@/components/dashboard/crud-dialog";

const statuses = ["todo", "in_progress", "completed", "cancelled"] as const;
const priorities = ["low", "medium", "high", "urgent"] as const;
const statusLabels: Record<string, [string, string]> = {
  todo: ["للعمل", "To do"],
  in_progress: ["قيد التنفيذ", "In progress"],
  completed: ["مكتملة", "Completed"],
  cancelled: ["ملغاة", "Cancelled"],
};
const priorityLabels: Record<string, [string, string]> = {
  low: ["منخفضة", "Low"],
  medium: ["متوسطة", "Medium"],
  high: ["عالية", "High"],
  urgent: ["عاجلة", "Urgent"],
};

export default function TasksPage() {
  const { tr, language } = useLanguage();
  const tasks = useQuery(api.tasks.getAll, {});
  const tenders = useQuery(api.tenders.getActiveTenders) ?? [];
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const updateStatus = useMutation(api.tasks.updateStatus);
  const removeTask = useMutation(api.tasks.remove);
  const [editing, setEditing] = useState<Doc<"tasks"> | null | undefined>(
    undefined,
  );
  const [busy, setBusy] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const data = new FormData(event.currentTarget);
    const dueDate = data.get("dueDate")
      ? new Date(String(data.get("dueDate"))).getTime()
      : undefined;
    const values = {
      title: String(data.get("title")),
      description: String(data.get("description")) || undefined,
      priority: String(data.get("priority")) as (typeof priorities)[number],
      dueDate,
    };
    try {
      if (editing) await updateTask({ id: editing._id, ...values });
      else
        await createTask({
          tenderId: String(data.get("tenderId")) as Doc<"tenders">["_id"],
          status: "todo",
          ...values,
        });
      setEditing(undefined);
    } finally {
      setBusy(false);
    }
  }
  async function remove(task: Doc<"tasks">) {
    if (window.confirm(tr("حذف هذه المهمة؟", "Delete this task?")))
      await removeTask({ id: task._id });
  }

  return (
    <ResourcePage
      eyebrow="WORKFLOW"
      title="المهام والمتابعات"
      titleEn="Workflow"
      subtitle="Tasks and follow-ups connected to tender records."
      subtitleAr="مهام الفريق والمتابعات المرتبطة بالمنافسات."
      icon={ListTodo}
    >
      <div className="flex justify-end">
        <button
          onClick={() => setEditing(null)}
          disabled={!tenders.length}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {tr("إضافة مهمة", "Add task")}
        </button>
      </div>
      <ResourceGrid>
        {tasks?.map((task) => {
          const priority = priorityLabels[task.priority];
          return (
            <article
              key={task._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <select
                  aria-label={tr("حالة المهمة", "Task status")}
                  value={task.status}
                  onChange={(event) =>
                    updateStatus({
                      id: task._id,
                      status: event.target.value as (typeof statuses)[number],
                    })
                  }
                  className="rounded-full border-0 bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700 outline-none"
                >
                  {statuses.map((value) => (
                    <option key={value} value={value}>
                      {tr(statusLabels[value][0], statusLabels[value][1])}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] font-bold uppercase text-amber-600">
                  {priority ? tr(priority[0], priority[1]) : task.priority}
                </span>
              </div>
              <h2 className="mt-4 font-bold text-slate-950">{task.title}</h2>
              <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-500">
                {task.description ||
                  tr("لا يوجد وصف.", "No description added.")}
              </p>
              {task.dueDate ? (
                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <CalendarClock className="h-4 w-4 text-indigo-500" />
                  {new Date(task.dueDate).toLocaleDateString(
                    language === "ar" ? "ar-SA" : "en-GB",
                  )}
                </div>
              ) : null}
              <div className="mt-4">
                <ResourceActions
                  onEdit={() => setEditing(task)}
                  onDelete={() => remove(task)}
                />
              </div>
            </article>
          );
        })}
        {!tasks?.length && (
          <ResourceEmpty
            loading={tasks === undefined}
            label="No tasks yet."
            labelAr="لا توجد مهام بعد."
          />
        )}
      </ResourceGrid>
      {editing !== undefined ? (
        <CrudDialog
          title={
            editing
              ? tr("تعديل المهمة", "Edit task")
              : tr("إضافة مهمة", "Add task")
          }
          onClose={() => setEditing(undefined)}
        >
          <form onSubmit={save} className="grid gap-4">
            {!editing ? (
              <label className={labelClass}>
                {tr("المنافسة", "Tender")}
                <select className={fieldClass} name="tenderId" required>
                  <option value="">
                    {tr("اختر المنافسة", "Select tender")}
                  </option>
                  {tenders.map((tender) => (
                    <option key={tender._id} value={tender._id}>
                      {tender.tender_name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <label className={labelClass}>
              {tr("عنوان المهمة", "Task title")}
              <input
                className={fieldClass}
                name="title"
                defaultValue={editing?.title ?? ""}
                required
              />
            </label>
            <label className={labelClass}>
              {tr("الوصف", "Description")}
              <textarea
                className={`${fieldClass} h-24 py-3`}
                name="description"
                defaultValue={editing?.description ?? ""}
              />
            </label>
            <label className={labelClass}>
              {tr("الأولوية", "Priority")}
              <select
                className={fieldClass}
                name="priority"
                defaultValue={editing?.priority ?? "medium"}
              >
                {priorities.map((value) => (
                  <option key={value} value={value}>
                    {tr(priorityLabels[value][0], priorityLabels[value][1])}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              {tr("تاريخ الاستحقاق", "Due date")}
              <input
                className={fieldClass}
                name="dueDate"
                type="date"
                defaultValue={
                  editing?.dueDate
                    ? new Date(editing.dueDate).toISOString().slice(0, 10)
                    : ""
                }
              />
            </label>
            <FormActions
              onCancel={() => setEditing(undefined)}
              busy={busy}
              submitLabel={tr("حفظ", "Save")}
            />
          </form>
        </CrudDialog>
      ) : null}
    </ResourcePage>
  );
}
