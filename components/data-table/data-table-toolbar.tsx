"use client";

import { Search, X } from "lucide-react";
import { useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/app/components/language-provider";
import { api } from "@/convex/_generated/api";
import type { DataTableFilters } from "./data-table";

type LookupOption = {
  id: number | string;
  name: string;
};

type ToolbarProps = {
  totalRows: number;
  isArchived?: boolean;
  onSearch?: (filters: DataTableFilters) => void;
};

const EMPTY_FILTERS: DataTableFilters = {
  search: "",
  searchUntil: "",
  regionId: "",
  agencyId: "",
  activityId: "",
  status: "",
};

export function DataTableToolbar({
  totalRows,
  isArchived = false,
  onSearch,
}: ToolbarProps) {
  const { tr } = useLanguage();
  const regions = useQuery(api.queries.getAllRegions, isArchived ? "skip" : {});
  const agencies = useQuery(api.queries.getAllAgencies, isArchived ? "skip" : {});
  const activities = useQuery(api.queries.getAllActivities, isArchived ? "skip" : {});
  const statuses = useQuery(api.queries.getAllStatuses, isArchived ? "skip" : {});

  const [filters, setFilters] = useState<DataTableFilters>(EMPTY_FILTERS);
  const dateSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (dateSearchTimer.current) clearTimeout(dateSearchTimer.current);
    };
  }, []);

  const updateFilters = (
    updates: Partial<DataTableFilters>,
    submit = true,
  ) => {
    const nextFilters = { ...filters, ...updates };
    setFilters(nextFilters);
    if (submit) onSearch?.(nextFilters);
  };

  const clearAll = () => {
    if (dateSearchTimer.current) clearTimeout(dateSearchTimer.current);
    setFilters(EMPTY_FILTERS);
    onSearch?.(EMPTY_FILTERS);
  };

  const toOptions = (items: LookupOption[] = []) =>
    items.map((item) => [String(item.id), item.name] as [string, string]);

  const hasFilters = Object.values(filters).some(Boolean);
  const optionsLoading =
    !isArchived &&
    (regions === undefined ||
      agencies === undefined ||
      activities === undefined ||
      statuses === undefined);
  const control =
    "h-11 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-indigo-950">
            {tr(isArchived ? "الأرشيف" : "المنافسات", isArchived ? "Archive" : "Competitions")}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {tr(`${totalRows} نتيجة`, `${totalRows} results`)}
          </p>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            <X className="h-3.5 w-3.5" />
            {tr("مسح البحث", "Clear search")}
          </button>
        )}
      </div>

      <div className="mb-6 flex justify-center">
        <div className="flex w-full max-w-3xl gap-2">
          <label className="relative flex-1">
            <span className="sr-only">{tr("البحث", "Search")}</span>
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={filters.search}
              onChange={(event) => updateFilters({ search: event.target.value }, false)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onSearch?.(filters);
              }}
              placeholder={tr(
                isArchived
                  ? "ابحث بالعنوان أو الرقم المرجعي أو الوصف..."
                  : "ابحث باسم المنافسة...",
                isArchived
                  ? "Search title, reference, or description..."
                  : "Search by competition name...",
              )}
              className={`${control} w-full bg-slate-50 pe-3 ps-10 focus:bg-white`}
            />
          </label>
          <button
            type="button"
            onClick={() => onSearch?.(filters)}
            className="flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200"
          >
            <Search className="h-4 w-4" />
            {tr("بحث", "Search")}
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
            {tr("مسح", "Clear")}
          </button>
        </div>
      </div>

      {isArchived && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label className="mb-2 block text-xs font-medium text-slate-500">
            {tr(
              "حتى (يشمل الأشهر الثلاثة السابقة)",
              "Until (includes previous 3 months)",
            )}
          </label>
          <input
            type="date"
            value={filters.searchUntil}
            onChange={(event) => {
              const searchUntil = event.target.value;
              updateFilters({ searchUntil }, false);
              if (dateSearchTimer.current) clearTimeout(dateSearchTimer.current);
              dateSearchTimer.current = setTimeout(() => {
                onSearch?.({ ...filters, searchUntil });
              }, 700);
            }}
            className={`${control} w-full md:max-w-sm`}
          />
        </div>
      )}

      {!isArchived && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            {tr("خيارات البحث", "Search options")}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FilterSelect
              label={tr("المنطقة", "Region")}
              value={filters.regionId}
              onChange={(regionId) => updateFilters({ regionId })}
              options={toOptions(regions)}
              all={tr("جميع المناطق", "All regions")}
              className={control}
              loading={optionsLoading}
            />
            <FilterSelect
              label={tr("الجهة", "Agency")}
              value={filters.agencyId}
              onChange={(agencyId) =>
                updateFilters({
                  agencyId,
                  status: agencyId ? filters.status : "",
                })
              }
              options={toOptions(agencies)}
              all={tr("جميع الجهات", "All agencies")}
              className={control}
              loading={optionsLoading}
            />
            <FilterSelect
              label={tr("النشاط / القطاع", "Activity / Sector")}
              value={filters.activityId}
              onChange={(activityId) => updateFilters({ activityId })}
              options={toOptions(activities)}
              all={tr("جميع الأنشطة", "All activities")}
              className={control}
              loading={optionsLoading}
            />
            <FilterSelect
              label={tr("الحالة", "Status")}
              value={filters.status}
              onChange={(status) => updateFilters({ status })}
              options={(statuses ?? []).map((item) => [item.name, item.name])}
              all={tr("كل الحالات", "All statuses")}
              className={control}
              loading={optionsLoading}
              disabled={!filters.agencyId}
            />
          </div>
          {!filters.agencyId && (
            <p className="mt-3 text-xs text-slate-400">
              {tr(
                "اختر جهة أولاً لاستخدام الحالة.",
                "Choose an agency first to use status.",
              )}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  all,
  className,
  loading = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
  all: string;
  className: string;
  loading?: boolean;
  disabled?: boolean;
}) {
  const { tr } = useLanguage();

  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-slate-500">
        {label}
      </label>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${className} w-full`}
        disabled={loading || disabled}
      >
        <option value="">
          {loading ? tr("جارٍ التحميل...", "Loading...") : all}
        </option>
        {!loading &&
          options.map(([optionValue, text]) => (
            <option key={optionValue} value={optionValue}>
              {text}
            </option>
          ))}
      </select>
    </div>
  );
}
