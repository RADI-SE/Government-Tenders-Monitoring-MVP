"use client";

import { Search, X } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { useLanguage } from "@/app/components/language-provider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function DataTableToolbar<TData>({
  table,
  totalRows,
}: {
  table: Table<TData>;
  totalRows: number;
}) {
  const { tr } = useLanguage();

  // Fetch filter options from Convex
  const regions = useQuery(api.queries.getAllRegions);
  const agencies = useQuery(api.queries.getAllAgencies);
  const activities = useQuery(api.queries.getAllActivities);
  const statuses = useQuery(api.queries.getAllStatuses);

  const toOptions = (items: any[] = []) =>
    items.map((item) => [item.name, item.name] as [string, string]);

  const hasFilters =
    Boolean(table.getState().globalFilter) ||
    table.getState().columnFilters.length > 0;

  const control =
    "h-11 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50";

  const setValue = (column: string, value: string) =>
    table.getColumn(column)?.setFilterValue(value || undefined);

  const isLoading =
    regions === undefined ||
    agencies === undefined ||
    activities === undefined ||
    statuses === undefined;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-indigo-950">
            {tr("المنافسات", "Competitions")}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {tr(
              `${table.getFilteredRowModel().rows.length} من ${totalRows}`,
              `${table.getFilteredRowModel().rows.length} of ${totalRows}`,
            )}
          </p>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              table.resetGlobalFilter();
              table.resetColumnFilters();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            <X className="h-3.5 w-3.5" />
            {tr("مسح الفلاتر", "Clear filters")}
          </button>
        )}
      </div>

      {/* Search bar – centered */}
      <div className="mb-4 flex justify-center">
        <label className="relative w-full max-w-2xl">
          <span className="sr-only">{tr("الكلمة المفتاحية", "Keyword")}</span>
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder={tr(
              "ابحث بالعنوان، الرقم، الجهة، الوصف أو كلمة مفتاحية...",
              "Search title, reference, agency, description, or keyword...",
            )}
            className={`${control} w-full bg-slate-50 pe-3 ps-10 focus:bg-white`}
          />
        </label>
      </div>
 
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <FilterSelect
          label={tr("المنطقة", "Region")}
          value={(table.getColumn("region")?.getFilterValue() as string) ?? ""}
          onChange={(value) => setValue("region", value)}
          options={toOptions(regions)}
          all={tr("جميع المناطق", "All regions")}
          className={control}
          loading={isLoading}
        />

        <FilterSelect
          label={tr("الجهة", "Agency")}
          value={(table.getColumn("agency")?.getFilterValue() as string) ?? ""}
          onChange={(value) => setValue("agency", value)}
          options={toOptions(agencies)}
          all={tr("جميع الجهات", "All agencies")}
          className={control}
          loading={isLoading}
        />

        <FilterSelect
          label={tr("النشاط / القطاع", "Activity / sector")}
          value={
            (table.getColumn("activity")?.getFilterValue() as string) ?? ""
          }
          onChange={(value) => setValue("activity", value)}
          options={toOptions(activities)}
          all={tr("جميع الأنشطة", "All activities")}
          className={control}
          loading={isLoading}
        />

        <FilterSelect
          label={tr("الحالة", "Status")}
          value={
            (table.getColumn("workflow_status")?.getFilterValue() as string) ??
            ""
          }
          onChange={(value) => setValue("workflow_status", value)}
          options={toOptions(statuses)}
          all={tr("كل الحالات", "All statuses")}
          className={control}
          loading={isLoading}
        />
      </div>
    </section>
  );
}

// Enhanced FilterSelect with loading state
function FilterSelect({
  label,
  value,
  onChange,
  options,
  all,
  className,
  loading = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
  all: string;
  className: string;
  loading?: boolean;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-medium text-slate-600">
      {label}
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={className}
        disabled={loading}
      >
        <option value="">{loading ? "جاري التحميل..." : all}</option>
        {!loading &&
          options.map(([optionValue, text]) => (
            <option key={optionValue} value={optionValue}>
              {text}
            </option>
          ))}
      </select>
    </label>
  );
}
