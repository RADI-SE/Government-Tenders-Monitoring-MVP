"use client";

import Link from "next/link";

interface TenderAwardingProps {
  tender: {
    id: number;
    raw_data: {
      awarding_status?: string;
      awarded_suppliers?: Array<{
        name: string;
        financial_offer: string;
        award_value: string;
      }>;
      suppliers?: Array<{
        name: string;
        technical_result: string;
        financial_offer: string;
      }>;
      id?: number;
    };
  };
}

export function TenderAwarding({ tender }: TenderAwardingProps) {
  const raw = tender?.raw_data;

  // Extract data with fallbacks
  const awardingStatus = raw?.awarding_status || "غير محدد";
  const winningSuppliers = raw?.awarded_suppliers || [];
  const bidders = raw?.suppliers || [];
  const tenderId = raw?.id || tender?.id;
  const analysisLink = `/analysis/tender/${tenderId}/`;

  return (
    <div className="grid gap-4 md:grid-cols-1">
      {/* بيانات الترسية */}
      <div className="td-section-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h6 className="td-section-title mb-3 text-sm font-semibold text-slate-700">
          بيانات الترسية
        </h6>
        <div className="td-data-row flex gap-2 py-1.5">
          <span className="td-data-label whitespace-nowrap text-xs text-slate-500">
            حالة الترسية:
          </span>
          <span className="td-data-value break-words text-sm font-medium text-slate-800">
            {awardingStatus}
          </span>
        </div>
      </div>

      {/* الموردون الفائزون */}
      <div className="td-section-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h6 className="td-section-title mb-3 text-sm font-semibold text-slate-700">
          الموردون الفائزون
        </h6>
        {winningSuppliers.length > 0 ? (
          <div className="table-responsive overflow-x-auto">
            <table className="etm-table w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-right text-xs font-medium text-slate-500">
                  <th className="px-3 py-2">اسم المورد</th>
                  <th className="px-3 py-2">قيمة العرض المالي</th>
                  <th className="px-3 py-2">قيمة الترسية</th>
                </tr>
              </thead>
              <tbody>
                {winningSuppliers.map((supplier, idx) => (
                  <tr key={idx} className="border-b border-slate-100 text-right text-sm">
                    <td className="px-3 py-2 font-medium text-slate-800">{supplier.name}</td>
                    <td className="px-3 py-2 text-slate-600">{supplier.financial_offer} ريال</td>
                    <td className="px-3 py-2 text-slate-600">{supplier.award_value} ريال</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500">لا يوجد موردون فائزون</p>
        )}
      </div>

      {/* الموردون المتقدمون */}
      <div className="td-section-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h6 className="td-section-title mb-3 text-sm font-semibold text-slate-700">
          الموردون المتقدمون
        </h6>
        {bidders.length > 0 ? (
          <div className="table-responsive overflow-x-auto">
            <table className="etm-table w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-right text-xs font-medium text-slate-500">
                  <th className="px-3 py-2">اسم المورد</th>
                  <th className="px-3 py-2">نتائج فحص العروض الفنية</th>
                  <th className="px-3 py-2">قيمة العرض المالي</th>
                </tr>
              </thead>
              <tbody>
                {bidders.map((bidder, idx) => (
                  <tr key={idx} className="border-b border-slate-100 text-right text-sm">
                    <td className="px-3 py-2 font-medium text-slate-800">{bidder.name}</td>
                    <td className="px-3 py-2 text-slate-600">{bidder.technical_result}</td>
                    <td className="px-3 py-2 text-slate-600">{bidder.financial_offer} ريال</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500">لا يوجد موردون متقدمون</p>
        )}
      </div>
    </div>
  );
}