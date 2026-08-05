"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { ArrowRight } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useLanguage } from "@/app/components/language-provider";
import { TenderDetails } from "@/components/competitions/tender-details";

export default function TenderDetailsPage() {
  const { tr } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const tenders = useQuery(api.tenders.getAllTenders);
  const tender = tenders?.find((item) => item._id === id);
  const createTask = useMutation(api.tasks.create);

  if (tenders === undefined) return <div className="p-12 text-center text-slate-500">{tr("جارٍ تحميل التفاصيل...", "Loading tender details...")}</div>;
  if (!tender) return <div className="p-12 text-center"><p className="text-slate-500">{tr("لم يتم العثور على المنافسة.", "Tender not found.")}</p><Link href="/dashboard/competitions" className="mt-4 inline-block font-bold text-indigo-700">{tr("العودة للمنافسات", "Back to competitions")}</Link></div>;

  return <div className="mx-auto max-w-[1400px] space-y-5 p-5 md:p-8"><Link href="/dashboard/competitions" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700"><ArrowRight className="h-4 w-4" />{tr("العودة للمنافسات", "Back to competitions")}</Link><TenderDetails tender={tender} createTask={createTask} /></div>;
}
