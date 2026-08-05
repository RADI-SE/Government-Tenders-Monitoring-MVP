"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { useLanguage } from "@/app/components/language-provider";

const statuses = [["new", "جديدة", "New"], ["reviewing", "قيد المراجعة", "Reviewing"], ["interested", "مهتم", "Interested"], ["submitted", "تم التقديم", "Submitted"], ["not_suitable", "غير مناسبة", "Not suitable"], ["archived", "مؤرشفة", "Archived"]] as const;

export function DataTableToolbar<TData>({ table, totalRows }: { table: Table<TData>; totalRows: number }) {
  const { tr } = useLanguage();
  const rows = table.getPreFilteredRowModel().rows;
  const agencies = Array.from(new Set(rows.map((row) => String(row.getValue("agency") || "")).filter(Boolean))).sort();
  const categories = Array.from(new Set(rows.map((row) => String(row.getValue("classification") || "")).filter(Boolean))).sort();
  const dates = (table.getColumn("created_at")?.getFilterValue() as { from?: string; to?: string } | undefined) ?? {};
  const hasFilters = Boolean(table.getState().globalFilter) || table.getState().columnFilters.length > 0;
  const selectClass = "h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50";

  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><div className="mb-1 flex items-center gap-2 text-sm font-semibold text-indigo-700"><SlidersHorizontal className="h-4 w-4" />{tr("البحث والتصفية", "Search and filters")}</div><p className="text-xs text-slate-500">{tr(`${table.getFilteredRowModel().rows.length} من ${totalRows} منافسة`, `${table.getFilteredRowModel().rows.length} of ${totalRows} competitions`)}</p></div>{hasFilters && <button type="button" onClick={() => { table.resetGlobalFilter(); table.resetColumnFilters(); }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"><X className="h-3.5 w-3.5" />{tr("مسح الفلاتر", "Clear filters")}</button>}</div>
    <div className="grid gap-3 xl:grid-cols-[minmax(240px,1.5fr)_repeat(3,minmax(150px,1fr))]">
      <label className="relative block"><span className="sr-only">{tr("البحث", "Search")}</span><Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={(table.getState().globalFilter as string) ?? ""} onChange={(event) => table.setGlobalFilter(event.target.value)} placeholder={tr("ابحث بالاسم أو الرقم أو الجهة...", "Search by name, reference, or agency...")} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pe-3 ps-10 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50" /></label>
      <select aria-label={tr("الحالة", "Status")} value={(table.getColumn("workflow_status")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("workflow_status")?.setFilterValue(event.target.value || undefined)} className={selectClass}><option value="">{tr("كل الحالات", "All statuses")}</option>{statuses.map(([value, ar, en]) => <option key={value} value={value}>{tr(ar, en)}</option>)}</select>
      <select aria-label={tr("الجهة", "Agency")} value={(table.getColumn("agency")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("agency")?.setFilterValue(event.target.value || undefined)} className={selectClass}><option value="">{tr("كل الجهات", "All agencies")}</option>{agencies.map((agency) => <option key={agency}>{agency}</option>)}</select>
      <select aria-label={tr("التصنيف", "Category")} value={(table.getColumn("classification")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("classification")?.setFilterValue(event.target.value || undefined)} className={selectClass}><option value="">{tr("كل التصنيفات", "All categories")}</option>{categories.map((category) => <option key={category}>{category}</option>)}</select>
    </div>
    <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:max-w-2xl"><label className="grid gap-1.5 text-xs font-medium text-slate-600">{tr("من تاريخ النشر", "Published from")}<input type="date" value={dates.from ?? ""} onChange={(event) => table.getColumn("created_at")?.setFilterValue({ ...dates, from: event.target.value || undefined })} className="h-10 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-indigo-400" /></label><label className="grid gap-1.5 text-xs font-medium text-slate-600">{tr("إلى تاريخ النشر", "Published to")}<input type="date" value={dates.to ?? ""} onChange={(event) => table.getColumn("created_at")?.setFilterValue({ ...dates, to: event.target.value || undefined })} className="h-10 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-indigo-400" /></label></div>
  </section>;
}
