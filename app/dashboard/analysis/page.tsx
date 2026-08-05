"use client";
import { useQuery } from "convex/react";
import { BrainCircuit, ShieldAlert } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { ResourceEmpty, ResourceGrid, ResourcePage } from "@/components/dashboard/resource-page";
import { useLanguage } from "@/app/components/language-provider";

export default function AnalysisPage() {
  const analyses = useQuery(api.aiAnalysis.getAll, {});
  const { tr } = useLanguage();
  return <ResourcePage eyebrow="SPIDERS INTELLIGENCE" title="تحليلات الذكاء الاصطناعي" titleEn="AI analysis" subtitle="Opportunity scores, recommendations, strengths, and risks." subtitleAr="تقييم الفرص والتوصيات ونقاط القوة والمخاطر." icon={BrainCircuit}><ResourceGrid>{analyses?.map((item) => <article key={item._id} className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm"><div className="bg-gradient-to-l from-indigo-50 to-emerald-50 p-5"><div className="flex items-center justify-between"><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-indigo-700">{item.classification}</span><strong className="text-2xl text-indigo-800">{item.opportunityScore}%</strong></div><h2 className="mt-4 text-sm font-bold text-slate-950">{tr("التوصية", "Recommendation")}: {item.recommendation}</h2></div><div className="p-5"><p className="text-xs leading-6 text-slate-600">{item.summary}</p>{item.risks.length > 0 && <div className="mt-4 flex items-start gap-2 text-xs text-rose-600"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />{item.risks[0]}</div>}</div></article>)}{!analyses?.length && <ResourceEmpty loading={analyses === undefined} label="No AI analyses have been generated yet." labelAr="لم يتم إنشاء تحليلات بعد." />}</ResourceGrid></ResourcePage>;
}
