"use client";

import { Search, X } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { useLanguage } from "@/app/components/language-provider";

const statuses = [
  ["new", "جديدة", "New"],
  ["reviewing", "قيد المراجعة", "Reviewing"],
  ["interested", "مهتم", "Interested"],
  ["submitted", "تم التقديم", "Submitted"],
  ["not_suitable", "غير مناسبة", "Not suitable"],
  ["archived", "مؤرشفة", "Archived"],
] as const;

function uniqueValues<TData>(table: Table<TData>, column: string) {
  return Array.from(
    new Set(
      table
        .getPreFilteredRowModel()
        .rows.map((row) => String(row.getValue(column) || ""))
        .filter(Boolean),
    ),
  ).sort();
}

export function DataTableToolbar<TData>({ table, totalRows }: { table: Table<TData>; totalRows: number }) {
  const { tr } = useLanguage();
  const hasFilters = Boolean(table.getState().globalFilter) || table.getState().columnFilters.length > 0;
  const setValue = (column: string, value: string) => table.getColumn(column)?.setFilterValue(value || undefined);
  const control = "h-14 min-w-0 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50";

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-indigo-950">{tr("المنافسات", "Competitions")}</h2>
          <p className="mt-1 text-xs text-slate-400">{tr(`${table.getFilteredRowModel().rows.length} من ${totalRows}`, `${table.getFilteredRowModel().rows.length} of ${totalRows}`)}</p>
        </div>
        {hasFilters ? <button type="button" onClick={() => { table.resetGlobalFilter(); table.resetColumnFilters(); }} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100"><X className="h-3.5 w-3.5" />{tr("مسح", "Clear")}</button> : null}
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.35fr_1fr_1.35fr_1fr_0.9fr]">
        <label className="grid gap-2 text-sm font-bold text-slate-900">
          {tr("بحث", "Search")}
          <span className="relative block"><Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={(table.getState().globalFilter as string) ?? ""} onChange={(event) => table.setGlobalFilter(event.target.value)} placeholder={tr("اسم المنافسة أو الرقم المرجعي", "Competition name or reference number")} className={`${control} w-full ps-11 font-normal`} /></span>
        </label>
        <FilterSelect label={tr("المنطقة", "Region")} value={(table.getColumn("region")?.getFilterValue() as string) ?? ""} onChange={(value) => setValue("region", value)} options={uniqueValues(table, "region")} all={tr("جميع المناطق", "All regions")} className={control} />
        <FilterSelect label={tr("الجهة", "Agency")} value={(table.getColumn("agency")?.getFilterValue() as string) ?? ""} onChange={(value) => setValue("agency", value)} options={uniqueValues(table, "agency")} all={tr("جميع الجهات", "All agencies")} className={control} />
        <FilterSelect label={tr("النشاط", "Activity")} value={(table.getColumn("activity")?.getFilterValue() as string) ?? ""} onChange={(value) => setValue("activity", value)} options={uniqueValues(table, "activity")} all={tr("جميع الأنشطة", "All activities")} className={control} />
        <FilterSelect label={tr("الحالة", "Status")} value={(table.getColumn("workflow_status")?.getFilterValue() as string) ?? ""} onChange={(value) => setValue("workflow_status", value)} options={statuses.map(([value, ar, en]) => [value, tr(ar, en)] as [string, string])} all={tr("جميع الحالات", "All statuses")} className={control} />
      </div>
    </section>
  );
}

function FilterSelect({ label, value, onChange, options, all, className }: { label: string; value: string; onChange: (value: string) => void; options: (string | [string, string])[]; all: string; className: string }) {
  return <label className="grid gap-2 text-sm font-bold text-slate-900">{label}<select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className={className}><option value="">{all}</option>{options.map((option) => { const [optionValue, text] = Array.isArray(option) ? option : [option, option]; return <option key={optionValue} value={optionValue}>{text}</option>; })}</select></label>;
}
