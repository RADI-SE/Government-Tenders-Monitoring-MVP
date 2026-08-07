"use client";

import { useQuery } from "convex/react";
import { useState } from "react";
import Link from "next/link";
import { BrainCircuit, FileSearch, Paperclip } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { DataTable } from "@/components/data-table/data-table";
import type { DataTableFilters } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { useLanguage } from "@/app/components/language-provider";
 
export default function CompetitionsPage() {
  const [filters, setFilters] = useState<DataTableFilters>({
    search: "",
    searchUntil: "",
    regionId: "",
    agencyId: "",
    activityId: "",
    status: "",
  });
  const activeTenders = useQuery(api.tenders.getActiveTenders);
  const searchResults = useQuery(
    api.queries.searchTenders,
    filters.search ? { query: filters.search } : "skip",
  );
  const agencyResults = useQuery(
    api.queries.getTendersByAgency,
    filters.agencyId && !filters.status
      ? { agencyId: Number(filters.agencyId) }
      : "skip",
  );
  const agencyStatusResults = useQuery(
    api.queries.getTendersByAgencyAndStatus,
    filters.agencyId && filters.status
      ? { agencyId: Number(filters.agencyId), status: filters.status }
      : "skip",
  );
  const regionResults = useQuery(
    api.queries.getTendersByRegion,
    filters.regionId ? { regionId: Number(filters.regionId) } : "skip",
  );
  const activityResults = useQuery(
    api.queries.getTendersByActivity,
    filters.activityId ? { activityId: Number(filters.activityId) } : "skip",
  );

  const requestedResults = [
    filters.search ? searchResults : undefined,
    filters.agencyId
      ? filters.status
        ? agencyStatusResults
        : agencyResults
      : undefined,
    filters.regionId ? regionResults : undefined,
    filters.activityId ? activityResults : undefined,
  ];
  const hasBackendFilters = Boolean(
    filters.search || filters.agencyId || filters.regionId || filters.activityId,
  );
  const isBackendLoading = hasBackendFilters && requestedResults.some(
    (result, index) => {
      const isRequested = [
        Boolean(filters.search),
        Boolean(filters.agencyId),
        Boolean(filters.regionId),
        Boolean(filters.activityId),
      ][index];
      return isRequested && result === undefined;
    },
  );
  const completedResults = requestedResults.filter(
    (result): result is NonNullable<typeof result> => result !== undefined,
  );
  const tenders = isBackendLoading
    ? undefined
    : hasBackendFilters
      ? completedResults.reduce(
          (matches, result) => {
            const ids = new Set(result.map((tender) => tender.id));
            return matches.filter((tender) => ids.has(tender.id));
          },
          completedResults[0] ?? [],
        )
      : activeTenders;
  const { tr } = useLanguage();

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-5 md:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold tracking-wide text-indigo-600">
            SPIDERS AI
          </p>
          <h1 className="text-2xl font-bold text-slate-950 md:text-3xl">
            {tr("المنافسات الحكومية", "Government competitions")}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {tr(
              "استعرض المنافسات وابحث فيها وصفِّها حسب احتياجك.",
              "Browse, search, and filter monitored opportunities.",
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          {tr("الرصد متصل", "Live monitoring")}
        </div>
      </header>

      <nav
        className="flex flex-wrap gap-2"
        aria-label={tr("أدوات المنافسات", "Competition resources")}
      >
        <Link
          href="/dashboard/analysis"
          className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-white px-3 py-2 text-xs font-bold text-indigo-700 shadow-sm hover:bg-indigo-50"
        >
          <BrainCircuit className="h-4 w-4" />
          {tr("تحليلات الذكاء الاصطناعي", "AI analysis")}
        </Link>
        <Link
          href="/dashboard/attachments"
          className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-white px-3 py-2 text-xs font-bold text-indigo-700 shadow-sm hover:bg-indigo-50"
        >
          <Paperclip className="h-4 w-4" />
          {tr("الوثائق والمرفقات", "Documents")}
        </Link>
       
      </nav>

      {tenders === undefined ? (
        <div className="grid min-h-72 place-items-center rounded-2xl border border-slate-200 bg-white">
          <div className="text-center text-slate-500">
            <FileSearch className="mx-auto mb-3 h-8 w-8 animate-pulse text-indigo-500" />
            {tr("جارٍ تحميل المنافسات...", "Loading competitions...")}
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={tenders}
          onSearch={(nextFilters) =>
            setFilters({ ...nextFilters, search: nextFilters.search.trim() })
          }
        />
      )}
    </div>
  );
}
