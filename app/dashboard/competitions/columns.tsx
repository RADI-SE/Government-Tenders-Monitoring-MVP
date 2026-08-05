"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Competition } from "./types";

import { CompetitionStatus } from "@/components/competitions/competition-status";
import { CompetitionActions } from "@/components/competitions/competition-actions";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));

export const columns: ColumnDef<Competition>[] = [
  {
    accessorKey: "reference_number",
    header: "الرقم المرجعي",
  },
  {
    accessorKey: "tender_name",
    header: "اسم المنافسة",
  },
  {
    id: "agency",
    header: "الجهة",
    accessorFn: (row) => row.raw_data.agency.name,
  },
  {
    accessorKey: "created_at",
    header: "تاريخ الإضافة",
    cell: ({ row }) => formatDate(row.original.created_at),
  },
  {
    accessorKey: "last_submission_date",
    header: "آخر موعد للتقديم",
    cell: ({ row }) => formatDate(row.original.last_submission_date),
  },
  {
    accessorKey: "original_status",
    header: "الحالة",
    cell: ({ row }) => (
      <CompetitionStatus
        status={row.original.original_status}
      />
    ),
  },
  {
    id: "actions",
    header: "الإجراء",
    cell: ({ row }) => (
      <CompetitionActions
        competition={row.original}
      />
    ),
  },
];