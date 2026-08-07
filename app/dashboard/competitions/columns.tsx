"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Competition } from "./types";
import { CompetitionStatus } from "@/components/competitions/competition-status";
import { CompetitionActions } from "@/components/competitions/competition-actions";
import { LocalizedText } from "@/app/components/language-provider";

type DateRange = { from?: string; to?: string };
type NumberRange = { min?: number; max?: number };

const formatDate = (date?: string) =>
  date
    ? new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date))
    : "—";

const dateRangeFilter = (value: unknown, range?: DateRange) => {
  const date = String(value ?? "").slice(0, 10);
  return (
    (!range?.from || date >= range.from) && (!range?.to || date <= range.to)
  );
};

export const columns: ColumnDef<Competition>[] = [
  {
    accessorKey: "reference_number",
    header: () => <LocalizedText ar="الرقم المرجعي" en="Reference" />,
    cell: ({ row }) => (
      <span className="font-mono text-xs text-indigo-700">
        {row.original.reference_number}
      </span>
    ),
  },
  {
    accessorKey: "tender_name",
    header: () => <LocalizedText ar="اسم المنافسة" en="Competition" />,
    cell: ({ row }) => (
      <div className="max-w-sm font-semibold leading-6 text-slate-900">
        {row.original.tender_name}
      </div>
    ),
  },
  {
    id: "agency",
    header: () => <LocalizedText ar="الجهة" en="Agency" />,
    accessorFn: (row) =>
      row.raw_data?.agency?.name ??
      (row.agency_id ? String(row.agency_id) : "—"),
    filterFn: (row, _id, value: string) =>
      !value || String(row.original.agency_id ?? "") === value,
  },
  {
    accessorKey: "created_at",
    header: () => <LocalizedText ar="تاريخ النشر" en="Published" />,
    filterFn: (row, id, value: DateRange) =>
      dateRangeFilter(row.getValue(id), value),
    cell: ({ row }) => formatDate(row.original.created_at),
  },
  {
    accessorKey: "last_submission_date",
    header: () => <LocalizedText ar="آخر موعد" en="Deadline" />,
    filterFn: (row, id, value: DateRange) =>
      dateRangeFilter(row.getValue(id), value),
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium">
        {formatDate(row.original.last_submission_date)}
      </span>
    ),
  },
  {
    accessorKey: "original_status",
    header: () => <LocalizedText ar="الحالة" en="Status" />,
    cell: ({ row }) => (
      <span>{row.original.original_status}</span>
    ),
  },

  // Filter-only fields are hidden by DataTable but remain searchable and faceted.
  {
    id: "region",
    accessorFn: (row) =>
      row.raw_data?.execution_locations?.[0]?.region?.name ??
      (row.region_id ? String(row.region_id) : ""),
    filterFn: (row, _id, value: string) =>
      !value || String(row.original.region_id ?? "") === value,
  },
  {
    id: "activity",
    accessorFn: (row) =>
      row.raw_data?.tender_activities
        ?.map((item: { activity?: { name?: string } }) => item.activity?.name)
        .filter(Boolean)
        .join("، ") ||
      row.activity_ids?.join(", ") ||
      "",
    filterFn: (row, _id, value: string) =>
      !value || row.original.activity_ids?.some((id) => String(id) === value) === true,
  },
  {
    id: "tender_type",
    accessorFn: (row) => row.tender_type ?? row.raw_data?.tender_type ?? "",
  },
  {
    id: "budget",
    accessorFn: (row) =>
      row.budget ?? Number(row.raw_data?.estimated_value ?? 0),
    filterFn: (row, id, value: NumberRange) => {
      const amount = Number(row.getValue(id) ?? 0);
      return (
        (!value?.min || amount >= value.min) &&
        (!value?.max || amount <= value.max)
      );
    },
  },
  {
    id: "keyword",
    accessorFn: (row) =>
      [
        row.description,
        row.ai_summary,
        row.original_status,
        row.tender_number,
        row.raw_data?.purpose,
        row.raw_data?.classification_field,
        row.raw_data?.package_name,
      ]
        .filter(Boolean)
        .join(" "),
  },
  {
    id: "actions",
    header: () => <LocalizedText ar="الإجراء" en="Action" />,
    enableGlobalFilter: false,
    cell: ({ row }) => <CompetitionActions competition={row.original} />,
  },
];
