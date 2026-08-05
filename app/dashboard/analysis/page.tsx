"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { BrainCircuit, Plus, ShieldAlert } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { ResourceEmpty, ResourceGrid, ResourcePage } from "@/components/dashboard/resource-page";
import { CrudDialog, fieldClass, FormActions, labelClass, ResourceActions } from "@/components/dashboard/crud-dialog";
import { useLanguage } from "@/app/components/language-provider";

const classifications = ["Construction", "IT", "Consulting", "Medical", "Maintenance", "Other"] as const;
const recommendations = ["Apply", "Review", "Ignore"] as const;
const list = (value: FormDataEntryValue | null) => String(value ?? "").split(/[,\n]/).map((item) => item.trim()).filter(Boolean);

export default function AnalysisPage() {
  const { tr } = useLanguage();
  const analyses = useQuery(api.aiAnalysis.getAll, {});
  const tenders = useQuery(api.tenders.getActiveTenders) ?? [];
  const createAnalysis = useMutation(api.aiAnalysis.create);
  const updateAnalysis = useMutation(api.aiAnalysis.update);
  const removeAnalysis = useMutation(api.aiAnalysis.remove);
  const [editing, setEditing] = useState<Doc<"aiAnalysis"> | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); const data = new FormData(event.currentTarget);
    const values = {
      summary: String(data.get("summary")),
      classification: String(data.get("classification")) as typeof classifications[number],
      opportunityScore: Number(data.get("score")),
      recommendation: String(data.get("recommendation")) as typeof recommendations[number],
      strengths: list(data.get("strengths")), risks: list(data.get("risks")), requiredDocuments: list(data.get("documents")), generatedBy: "Spiders AI MVP",
    };
    try {
      if (editing) await updateAnalysis({ id: editing._id, ...values });
      else await createAnalysis({ tenderId: String(data.get("tenderId")) as Doc<"tenders">["_id"], ...values });
      setEditing(undefined);
    } finally { setBusy(false); }
  }
  async function remove(item: Doc<"aiAnalysis">) { if (window.confirm(tr("حذف هذا التحليل؟", "Delete this analysis?"))) await removeAnalysis({ id: item._id }); }

  return <ResourcePage eyebrow="SPIDERS INTELLIGENCE" title="تحليلات الذكاء الاصطناعي" titleEn="AI analysis" subtitle="Opportunity scores, recommendations, strengths, and risks." subtitleAr="تقييم الفرص والتوصيات ونقاط القوة والمخاطر." icon={BrainCircuit}>
    <div className="flex justify-end"><button onClick={() => setEditing(null)} disabled={!tenders.length} className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"><Plus className="h-4 w-4" />{tr("إضافة تحليل", "Add analysis")}</button></div>
    <ResourceGrid>{analyses?.map((item) => <article key={item._id} className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm"><div className="bg-gradient-to-l from-indigo-50 to-emerald-50 p-5"><div className="flex items-center justify-between"><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-indigo-700">{item.classification}</span><strong className="text-2xl text-indigo-800">{item.opportunityScore}%</strong></div><h2 className="mt-4 text-sm font-bold text-slate-950">{tr("التوصية", "Recommendation")}: {item.recommendation}</h2></div><div className="p-5"><p className="text-xs leading-6 text-slate-600">{item.summary}</p>{item.risks.length ? <div className="mt-4 flex items-start gap-2 text-xs text-rose-600"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />{item.risks[0]}</div> : null}<div className="mt-4 border-t border-slate-100 pt-4"><ResourceActions onEdit={() => setEditing(item)} onDelete={() => remove(item)} /></div></div></article>)}{!analyses?.length && <ResourceEmpty loading={analyses === undefined} label="No AI analyses have been generated yet." labelAr="لم يتم إنشاء تحليلات بعد." />}</ResourceGrid>
    {editing !== undefined ? <CrudDialog title={editing ? tr("تعديل التحليل", "Edit analysis") : tr("إضافة تحليل", "Add analysis")} onClose={() => setEditing(undefined)}><form onSubmit={save} className="grid gap-4 sm:grid-cols-2">{!editing ? <label className={`${labelClass} sm:col-span-2`}>{tr("المنافسة", "Tender")}<select className={fieldClass} name="tenderId" required><option value="">{tr("اختر المنافسة", "Select tender")}</option>{tenders.map((tender) => <option key={tender._id} value={tender._id}>{tender.tender_name}</option>)}</select></label> : null}<label className={labelClass}>{tr("التصنيف", "Classification")}<select className={fieldClass} name="classification" defaultValue={editing?.classification ?? "Other"}>{classifications.map((value) => <option key={value}>{value}</option>)}</select></label><label className={labelClass}>{tr("النتيجة", "Opportunity score")}<input className={fieldClass} name="score" type="number" min="0" max="100" defaultValue={editing?.opportunityScore ?? 70} required /></label><label className={labelClass}>{tr("التوصية", "Recommendation")}<select className={fieldClass} name="recommendation" defaultValue={editing?.recommendation ?? "Review"}>{recommendations.map((value) => <option key={value}>{value}</option>)}</select></label><label className={`${labelClass} sm:col-span-2`}>{tr("الملخص", "Summary")}<textarea className={`${fieldClass} h-24 py-3`} name="summary" defaultValue={editing?.summary ?? ""} required /></label><ListField name="strengths" label={tr("نقاط القوة", "Strengths")} value={editing?.strengths} /><ListField name="risks" label={tr("المخاطر", "Risks")} value={editing?.risks} /><ListField name="documents" label={tr("المستندات المطلوبة", "Required documents")} value={editing?.requiredDocuments} /><div className="sm:col-span-2"><FormActions onCancel={() => setEditing(undefined)} busy={busy} submitLabel={tr("حفظ", "Save")} /></div></form></CrudDialog> : null}
  </ResourcePage>;
}

function ListField({ name, label, value }: { name: string; label: string; value?: string[] }) { return <label className={labelClass}>{label}<textarea className={`${fieldClass} h-20 py-3`} name={name} defaultValue={value?.join(", ") ?? ""} placeholder="Item one, item two" /></label>; }
