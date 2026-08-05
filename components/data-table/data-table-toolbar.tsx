"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { useLanguage } from "@/app/components/language-provider";

const statuses = [["new", "جديدة", "New"], ["reviewing", "قيد المراجعة", "Reviewing"], ["interested", "مهتم", "Interested"], ["submitted", "تم التقديم", "Submitted"], ["not_suitable", "غير مناسبة", "Not suitable"], ["archived", "مؤرشفة", "Archived"]] as const;
type DateRange = { from?: string; to?: string };
type NumberRange = { min?: number; max?: number };

function uniqueValues<TData>(table: Table<TData>, column: string) {
  return Array.from(new Set(table.getPreFilteredRowModel().rows.map((row) => String(row.getValue(column) || "")).filter(Boolean))).sort();
}

export function DataTableToolbar<TData>({ table, totalRows }: { table: Table<TData>; totalRows: number }) {
  const { tr } = useLanguage();
  const published = (table.getColumn("created_at")?.getFilterValue() as DateRange | undefined) ?? {};
  const deadline = (table.getColumn("last_submission_date")?.getFilterValue() as DateRange | undefined) ?? {};
  const budget = (table.getColumn("budget")?.getFilterValue() as NumberRange | undefined) ?? {};
  const hasFilters = Boolean(table.getState().globalFilter) || table.getState().columnFilters.length > 0;
  const control = "h-11 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50";
  const setValue = (column: string, value: string) => table.getColumn(column)?.setFilterValue(value || undefined);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div><div className="mb-1 flex items-center gap-2 text-sm font-semibold text-indigo-700"><SlidersHorizontal className="h-4 w-4" />{tr("البحث والتصفية", "Search and filters")}</div><p className="text-xs text-slate-500">{tr(`${table.getFilteredRowModel().rows.length} من ${totalRows} منافسة`, `${table.getFilteredRowModel().rows.length} of ${totalRows} competitions`)}</p></div>
        {hasFilters ? <button type="button" onClick={() => { table.resetGlobalFilter(); table.resetColumnFilters(); }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"><X className="h-3.5 w-3.5" />{tr("مسح الفلاتر", "Clear filters")}</button> : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="relative block md:col-span-2"><span className="sr-only">{tr("الكلمة المفتاحية", "Keyword")}</span><Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={(table.getState().globalFilter as string) ?? ""} onChange={(event) => table.setGlobalFilter(event.target.value)} placeholder={tr("ابحث بالعنوان، الرقم، الجهة، الوصف أو كلمة مفتاحية...", "Search title, reference, agency, description, or keyword...")} className={`${control} w-full bg-slate-50 pe-3 ps-10 focus:bg-white`} /></label>
        <FilterSelect label={tr("الحالة", "Status")} value={(table.getColumn("workflow_status")?.getFilterValue() as string) ?? ""} onChange={(value) => setValue("workflow_status", value)} options={statuses.map(([value, ar, en]) => [value, tr(ar, en)])} all={tr("كل الحالات", "All statuses")} className={control} />
        <FilterSelect label={tr("الجهة", "Agency")} value={(table.getColumn("agency")?.getFilterValue() as string) ?? ""} onChange={(value) => setValue("agency", value)} options={uniqueValues(table, "agency").map((value) => [value, value])} all={tr("كل الجهات", "All agencies")} className={control} />
        <FilterSelect label={tr("التصنيف", "Category")} value={(table.getColumn("classification")?.getFilterValue() as string) ?? ""} onChange={(value) => setValue("classification", value)} options={uniqueValues(table, "classification").map((value) => [value, value])} all={tr("كل التصنيفات", "All categories")} className={control} />
        <FilterSelect label={tr("المنطقة", "Region")} value={(table.getColumn("region")?.getFilterValue() as string) ?? ""} onChange={(value) => setValue("region", value)} options={uniqueValues(table, "region").map((value) => [value, value])} all={tr("كل المناطق", "All regions")} className={control} />
        <FilterSelect label={tr("النشاط / القطاع", "Activity / sector")} value={(table.getColumn("activity")?.getFilterValue() as string) ?? ""} onChange={(value) => setValue("activity", value)} options={uniqueValues(table, "activity").map((value) => [value, value])} all={tr("كل الأنشطة", "All activities")} className={control} />
        <FilterSelect label={tr("نوع المنافسة", "Tender type")} value={(table.getColumn("tender_type")?.getFilterValue() as string) ?? ""} onChange={(value) => setValue("tender_type", value)} options={uniqueValues(table, "tender_type").map((value) => [value, value])} all={tr("كل الأنواع", "All tender types")} className={control} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DateField label={tr("النشر من", "Published from")} value={published.from} onChange={(from) => table.getColumn("created_at")?.setFilterValue({ ...published, from })} />
        <DateField label={tr("النشر إلى", "Published to")} value={published.to} onChange={(to) => table.getColumn("created_at")?.setFilterValue({ ...published, to })} />
        <DateField label={tr("الموعد النهائي من", "Deadline from")} value={deadline.from} onChange={(from) => table.getColumn("last_submission_date")?.setFilterValue({ ...deadline, from })} />
        <DateField label={tr("الموعد النهائي إلى", "Deadline to")} value={deadline.to} onChange={(to) => table.getColumn("last_submission_date")?.setFilterValue({ ...deadline, to })} />
        <NumberField label={tr("الميزانية من", "Minimum budget")} value={budget.min} onChange={(min) => table.getColumn("budget")?.setFilterValue({ ...budget, min })} />
        <NumberField label={tr("الميزانية إلى", "Maximum budget")} value={budget.max} onChange={(max) => table.getColumn("budget")?.setFilterValue({ ...budget, max })} />
      </div>
    </section>
  );
}

function FilterSelect({ label, value, onChange, options, all, className }: { label: string; value: string; onChange: (value: string) => void; options: string[][]; all: string; className: string }) {
  return <label className="grid gap-1.5 text-xs font-medium text-slate-600">{label}<select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className={className}><option value="">{all}</option>{options.map(([optionValue, text]) => <option key={optionValue} value={optionValue}>{text}</option>)}</select></label>;
}
function DateField({ label, value, onChange }: { label: string; value?: string; onChange: (value: string | undefined) => void }) {
  return <label className="grid gap-1.5 text-xs font-medium text-slate-600">{label}<input type="date" value={value ?? ""} onChange={(event) => onChange(event.target.value || undefined)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-indigo-400" /></label>;
}
function NumberField({ label, value, onChange }: { label: string; value?: number; onChange: (value: number | undefined) => void }) {
  return <label className="grid gap-1.5 text-xs font-medium text-slate-600">{label}<input type="number" min="0" value={value ?? ""} onChange={(event) => onChange(event.target.value ? Number(event.target.value) : undefined)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-indigo-400" /></label>;
}
