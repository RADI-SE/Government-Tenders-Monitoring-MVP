"use client";
import type { Table } from "@tanstack/react-table";
import { useLanguage } from "@/app/components/language-provider";

export function DataTablePagination<TData>({ table }: { table: Table<TData> }) {
  const { tr } = useLanguage();
  const page = table.getState().pagination.pageIndex + 1;
  const pages = Math.max(table.getPageCount(), 1);
  return <div className="flex flex-wrap items-center justify-between gap-3 pb-4 text-xs text-slate-500"><p>{tr(`الصفحة ${page} من ${pages}`, `Page ${page} of ${pages}`)}</p><div className="flex gap-2"><button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 disabled:opacity-40">{tr("السابق", "Previous")}</button><button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 disabled:opacity-40">{tr("التالي", "Next")}</button></div></div>;
}
