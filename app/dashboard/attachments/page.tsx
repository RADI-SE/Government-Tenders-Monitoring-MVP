"use client";
import { useQuery } from "convex/react";
import { ExternalLink, File, Paperclip } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { ResourceEmpty, ResourceGrid, ResourcePage } from "@/components/dashboard/resource-page";

export default function AttachmentsPage() {
  const files = useQuery(api.attachments.getAll, {});
  return <ResourcePage eyebrow="DOCUMENT CENTER" title="المرفقات والوثائق" titleEn="Documents and attachments" subtitle="Tender documents provided by the attachments backend." subtitleAr="وثائق المنافسات والمرفقات المرتبطة بها." icon={Paperclip}><ResourceGrid>{files?.map((file) => <a key={file._id} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><File className="h-5 w-5" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-slate-950">{file.title}</strong><small className="mt-1 block uppercase text-slate-400">{file.type}</small></span><ExternalLink className="h-4 w-4 text-slate-400" /></a>)}{!files?.length && <ResourceEmpty loading={files === undefined} label="No attachments uploaded yet." labelAr="لا توجد مرفقات بعد." />}</ResourceGrid></ResourcePage>;
}
