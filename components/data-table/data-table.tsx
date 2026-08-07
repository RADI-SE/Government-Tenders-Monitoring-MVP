"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import { LocalizedText } from "@/app/components/language-provider";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalRows?: number;
  isArchived?: boolean;
  onSearch?: (filters: {
    search: string;
    searchUntil: string;
   }) => void;
}


export function DataTable<TData, TValue>({
  columns,
  data,
  totalRows,
  isArchived = false,
  onSearch,
}: DataTableProps<TData, TValue>) {

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const table = useReactTable({
    data,
    columns,
    state: { pagination,columnFilters },
    onPaginationChange: setPagination,
 
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      columnVisibility: {
        region: false,
        activity: false,
        tender_type: false,
        budget: false,
        keyword: false,
      },
    },
  });

  return (
    <div className="space-y-5">

      <DataTableToolbar
        table={table}
        totalRows={table.getCoreRowModel().rows.length}
        isArchived={isArchived}
        onSearch={onSearch}
      />
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[940px]">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-semibold text-slate-500"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-slate-100 transition hover:bg-indigo-50/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-4 text-sm text-slate-700"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-16 text-center text-sm text-slate-500"
                >
                  <LocalizedText
                    ar="لا توجد نتائج مطابقة."
                    en="No matching results."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
