"use client";
import { useQuery } from "convex/react";
import { FolderOpen } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { ResourceEmpty, ResourceGrid, ResourcePage } from "@/components/dashboard/resource-page";

export default function CategoriesPage() {
  const categories = useQuery(api.categories.getAll, {});
  return <ResourcePage eyebrow="MASTER DATA" title="تصنيفات المنافسات" titleEn="Competition categories" subtitle="Categories available for organizing and filtering opportunities." subtitleAr="التصنيفات المستخدمة لتنظيم الفرص وتصفيتها." icon={FolderOpen}><ResourceGrid>{categories?.map((category) => <article key={category._id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><FolderOpen className="h-5 w-5" /></span><div><strong className="text-sm text-slate-950">{category.name}</strong><small className="mt-1 block font-mono text-slate-400">ID {category.externalCategoryId}</small></div></article>)}{!categories?.length && <ResourceEmpty loading={categories === undefined} label="No categories available yet." labelAr="لا توجد تصنيفات بعد." />}</ResourceGrid></ResourcePage>;
}
