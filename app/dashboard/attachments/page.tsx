"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { ExternalLink, File, Paperclip, Plus } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { ResourceEmpty, ResourceGrid, ResourcePage } from "@/components/dashboard/resource-page";
import { CrudDialog, fieldClass, FormActions, labelClass, ResourceActions } from "@/components/dashboard/crud-dialog";
import { useLanguage } from "@/app/components/language-provider";

const fileTypes = ["pdf", "doc", "excel", "image", "zip", "other"] as const;

export default function AttachmentsPage() {
  const { tr } = useLanguage();
  const files = useQuery(api.attachments.getAll, {});
  const tenders = useQuery(api.tenders.getActiveTenders) ?? [];
  const createFile = useMutation(api.attachments.create);
  const updateFile = useMutation(api.attachments.update);
  const removeFile = useMutation(api.attachments.remove);
  const [editing, setEditing] = useState<Doc<"attachments"> | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); const data = new FormData(event.currentTarget);
    try {
      const values = { title: String(data.get("title")), url: String(data.get("url")), type: String(data.get("type")) as typeof fileTypes[number] };
      if (editing) await updateFile({ id: editing._id, ...values });
      else await createFile({ tenderId: String(data.get("tenderId")) as Doc<"tenders">["_id"], ...values });
      setEditing(undefined);
    } finally { setBusy(false); }
  }
  async function remove(file: Doc<"attachments">) { if (window.confirm(tr("حذف هذا المرفق؟", "Delete this attachment?"))) await removeFile({ id: file._id }); }

  return <ResourcePage eyebrow="DOCUMENT CENTER" title="المرفقات والوثائق" titleEn="Documents and attachments" subtitle="Tender documents provided by the attachments backend." subtitleAr="وثائق المنافسات والمرفقات المرتبطة بها." icon={Paperclip}>
    <div className="flex justify-end"><button onClick={() => setEditing(null)} disabled={!tenders.length} className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"><Plus className="h-4 w-4" />{tr("إضافة مرفق", "Add attachment")}</button></div>
    <ResourceGrid>{files?.map((file) => <article key={file._id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><File className="h-5 w-5" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-slate-950">{file.title}</strong><small className="mt-1 block uppercase text-slate-400">{file.type}</small></span><a href={file.url} target="_blank" rel="noreferrer" aria-label={tr("فتح المرفق", "Open attachment")} className="text-slate-400 hover:text-indigo-600"><ExternalLink className="h-4 w-4" /></a><ResourceActions onEdit={() => setEditing(file)} onDelete={() => remove(file)} /></article>)}{!files?.length && <ResourceEmpty loading={files === undefined} label="No attachments uploaded yet." labelAr="لا توجد مرفقات بعد." />}</ResourceGrid>
    {editing !== undefined ? <CrudDialog title={editing ? tr("تعديل المرفق", "Edit attachment") : tr("إضافة مرفق", "Add attachment")} onClose={() => setEditing(undefined)}><form onSubmit={save} className="grid gap-4">{!editing ? <label className={labelClass}>{tr("المنافسة", "Tender")}<select className={fieldClass} name="tenderId" required><option value="">{tr("اختر المنافسة", "Select tender")}</option>{tenders.map((tender) => <option key={tender._id} value={tender._id}>{tender.tender_name}</option>)}</select></label> : null}<label className={labelClass}>{tr("اسم الملف", "File title")}<input className={fieldClass} name="title" defaultValue={editing?.title ?? ""} required /></label><label className={labelClass}>{tr("رابط الملف", "File URL")}<input className={fieldClass} name="url" type="url" defaultValue={editing?.url ?? ""} required /></label><label className={labelClass}>{tr("نوع الملف", "File type")}<select className={fieldClass} name="type" defaultValue={editing?.type ?? "pdf"}>{fileTypes.map((type) => <option key={type}>{type}</option>)}</select></label><FormActions onCancel={() => setEditing(undefined)} busy={busy} submitLabel={tr("حفظ", "Save")} /></form></CrudDialog> : null}
  </ResourcePage>;
}
