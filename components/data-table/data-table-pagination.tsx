"use client";

import { Table } from "@tanstack/react-table";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between py-4">
      <p className="text-sm text-muted-foreground">
        الصفحة {table.getState().pagination.pageIndex + 1} من{" "}
        {table.getPageCount()}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded-md border px-3 py-2 disabled:opacity-50"
        >
          السابق
        </button>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded-md border px-3 py-2 disabled:opacity-50"
        >
          التالي
        </button>
      </div>
    </div>
  );
}