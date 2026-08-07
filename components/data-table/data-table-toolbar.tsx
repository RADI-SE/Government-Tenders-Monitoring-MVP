"use client";

import { Search, X } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { useLanguage } from "@/app/components/language-provider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef, useState } from "react";
import type { DataTableFilters } from "./data-table";
import { ARCHIVED_STATUSES } from "@/lib/tender-statuses";
type LookupOption = {
  id: number | string;
  name: string;
};

export function DataTableToolbar({
  table,
  totalRows,
  isArchived = false,
  onSearch,
}: {
  table: Table<any>;
  totalRows: number;
  isArchived?: boolean;
  onSearch?: (filters: DataTableFilters) => void;
}) {
  const { tr } = useLanguage();

  const regions = useQuery(api.queries.getAllRegions);
  const agencies = useQuery(api.queries.getAllAgencies);
  const activities = useQuery(api.queries.getAllActivities);
  const statuses = useQuery(api.queries.getAllStatuses);
  const filteredStatuses = (statuses ?? []).filter((status) =>
    isArchived
      ? ARCHIVED_STATUSES.includes(status.name as any)
      : !ARCHIVED_STATUSES.includes(status.name as any)
  );
  const [searchUntil, setsearchUntil] = useState("");
  const [regionId, setRegionId] = useState("");
  const [agencyId, setAgencyId] = useState("");
  const [activityId, setActivityId] = useState("");
  const [status, setStatus] = useState("");
  const dateSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchValue, setSearchValue] = useState(
    (table.getState().globalFilter as string) ?? ""
  );

  useEffect(() => {
    return () => {
      if (dateSearchTimer.current) clearTimeout(dateSearchTimer.current);
    };
  }, []);


  const toOptions = (items: LookupOption[] = []) =>
    items.map((item) => [String(item.id), item.name] as [string, string]);

  const hasFilters =
    Boolean(searchValue) ||
    Boolean(searchUntil) ||
    Boolean(regionId) ||
    Boolean(agencyId) ||
    Boolean(activityId) ||
    Boolean(status) ||
    table.getState().columnFilters.length > 0;
  const control =
    "h-11 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50";

  const setValue = (column: string, value: string) =>
    table.getColumn(column)?.setFilterValue(value || undefined);
  const applySearch = (overrides: Partial<DataTableFilters> = {}) => {
    const filters = {
      search: searchValue,
      searchUntil,
      regionId,
      agencyId,
      activityId,
      status,
      ...overrides,
    };
    onSearch?.(filters);
  };
  const clearAll = () => {
    if (dateSearchTimer.current) clearTimeout(dateSearchTimer.current);
    setSearchValue("");
    setsearchUntil("");
    setRegionId("");
    setAgencyId("");
    setActivityId("");
    setStatus("");

    table.resetColumnFilters();

    onSearch?.({
      search: "",
      searchUntil: "",
      regionId: "",
      agencyId: "",
      activityId: "",
      status: "",
    });
  };


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
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            <X className="h-3.5 w-3.5" />
            {tr("مسح الفلاتر", "Clear filters")}
          </button>
        )}
      </div>

      {/* Search bar – centered */}
      <div className="mb-6 flex justify-center">
        <div className="flex w-full max-w-3xl gap-2">
          <label className="relative flex-1">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applySearch();
                }
              }}
              placeholder={tr(
                isArchived
                  ? "ابحث بالعنوان أو الرقم المرجعي أو الوصف..."
                  : "ابحث باسم المنافسة...",
                isArchived
                  ? "Search title, reference, or description..."
                  : "Search by competition name..."
              )}
              className={`${control} w-full bg-slate-50 pe-3 ps-10 focus:bg-white`}
            />
          </label>

          {/* Search */}
          <button
            type="button"
            onClick={() => applySearch()}
            className="flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200"
          >
            <Search className="h-4 w-4" />
            {tr("بحث", "Search")}
          </button>
        </div>
      </div>

      {isArchived && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            {tr("الفترة الزمنية", "Date range")}
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-500">
                {tr("حتى (يشمل الأشهر الثلاثة السابقة)", "Until (includes previous 3 months)")}
              </label>
              <input
                type="date"
                value={searchUntil}
                onChange={(e) => {
                  const value = e.target.value;
                  setsearchUntil(value);

                  if (dateSearchTimer.current) {
                    clearTimeout(dateSearchTimer.current);
                  }

                  dateSearchTimer.current = setTimeout(() => {
                    onSearch?.({
                      search: searchValue,
                      searchUntil: value,
                      regionId,
                      agencyId,
                      activityId,
                      status,
                    });
                  }, 700);
                }}
                className={`${control} w-full`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">
          {tr("الفلاتر", "Filters")}
        </h3>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterSelect
            label={tr("المنطقة", "Region")}
            value={regionId}
            onChange={(value) => {
              setRegionId(value);
              setValue("region", value);
              if (!isArchived) applySearch({ regionId: value });
            }}
            options={toOptions(regions)}
            all={tr("جميع المناطق", "All regions")}
            className={control}
            loading={isLoading}
          />

          <FilterSelect
            label={tr("الجهة", "Agency")}
            value={agencyId}
            onChange={(value) => {
              setAgencyId(value);
              setValue("agency", value);
              if (!isArchived) applySearch({ agencyId: value });
            }}
            options={toOptions(agencies)}
            all={tr("جميع الجهات", "All agencies")}
            className={control}
            loading={isLoading}
          />

          <FilterSelect
            label={tr("النشاط / القطاع", "Activity / Sector")}
            value={activityId}
            onChange={(value) => {
              setActivityId(value);
              setValue("activity", value);
              if (!isArchived) applySearch({ activityId: value });
            }}
            options={toOptions(activities)}
            all={tr("جميع الأنشطة", "All activities")}
            className={control}
            loading={isLoading}
          />

          <FilterSelect
            label={tr("الحالة", "Status")}
            value={status}
            onChange={(value) => {
              setStatus(value);
              setValue("original_status", value);
              if (!isArchived) applySearch({ status: value });
            }}
            options={filteredStatuses.map((item) => [item.name, item.name])}
             all={tr("كل الحالات", "All statuses")}
            className={control}
            loading={isLoading}
          />
        </div>
      </div>
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
  all: string;
  className: string;
  loading?: boolean;
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
        onChange={(e) => onChange(e.target.value)}
        className={`${className} w-full`}
        disabled={loading}
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
