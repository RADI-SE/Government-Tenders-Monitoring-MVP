"use client";

import Link from "next/link";

interface TenderAwardingProps {
  tender: any;
}

export function TenderAwarding({ tender }: TenderAwardingProps) {
  const raw = tender?.raw_data;

  return (
    <div className="grid gap-4 md:grid-cols-1">
      <div className="td-section-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h6 className="td-section-title mb-3 text-sm font-semibold text-slate-700">
          بيانات الترسية
        </h6>
        <div className="td-data-row flex gap-2 py-1.5">
          <span className="td-data-label whitespace-nowrap text-xs text-slate-500">
            حالة الترسية:
          </span>
          <span className="td-data-value break-words text-sm font-medium text-slate-800">
            {raw?.awarding_status || "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
