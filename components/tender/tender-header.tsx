"use client";

import { ExternalLink } from "lucide-react";

interface TenderHeaderProps {
  tender: any;
}

export function TenderHeader({ tender }: TenderHeaderProps) {
  const raw = tender?.raw_data;

  const title = tender?.tender_name || "بدون عنوان";
  const reference = tender?.reference_number || "غير محدد";
  const status = tender?.status || tender?.original_status || "غير معروف";
  const agency = raw?.agency?.name || "غير محدد";

  return (
    <div className="td-header-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <span className="td-status-badge inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          {status}
        </span>
      </div>

      <div className="mt-2 opacity-75 text-sm text-slate-600">
        <small>
          الرقم المرجعي: {reference} | الجهة: {agency}
        </small>
      </div>

      <div className="mt-3 d-flex gap-2 flex-wrap">
        <button
          type="button"
          className="etm-btn etm-btn--ghost inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
          id="customProposalBtn"
          data-bs-toggle="modal"
          data-bs-target="#customProposalModal"
        >
          <ExternalLink className="h-4 w-4 ms-1" />
          طلب إنشاء عرض مخصص
        </button>
      </div>
    </div>
  );
}
