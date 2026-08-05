"use client";

interface DataTableToolbarProps {
  totalRows: number;
}

export function DataTableToolbar({
  totalRows,
}: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-background px-4 py-3">
      <div>
        <h2 className="text-lg font-semibold">
          المنافسات
        </h2>

        <p className="text-sm text-muted-foreground">
          إجمالي المنافسات: {totalRows}
        </p>
      </div>
    </div>
  );
}