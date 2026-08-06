"use client";

import { ExternalLink } from "lucide-react";
import { DetailView, Section, Field } from "./detail-view"; // adjust path

interface TenderOverviewProps {
  tender: any;
}

export function TenderOverview({ tender }: TenderOverviewProps) {
  const raw = tender?.raw_data;

  // Helper: format dates in Arabic
  const formatDateArabic = (date?: string) => {
    if (!date) return "-";
    const d = new Date(date);
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  };

  // Helper: format currency
  const formatCurrency = (value?: string | number) => {
    if (value == null) return "-";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return String(value);
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Build etimad link
  const etimadLink =
    raw?.etimad_url ||
    `https://tenders.etimad.sa/Tender/DetailsForVisitor?STenderId=${raw?.etimad_id || ""}`;

  // Define sections
  const sections: Section[] = [
    {
      title: "بيانات المنافسة",
      fields: [
        { label: "اسم المنافسة", value: raw?.tender_name },
        { label: "الرقم المرجعي", value: raw?.reference_number },
        { label: "رقم المنافسة", value: raw?.tender_number },
        {
          label: "لينك اعتماد",
          value: etimadLink,
          render: (link) => (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              <ExternalLink className="h-3 w-3" />
              فتح في اعتماد
            </a>
          ),
        },
        { label: "نوع المنافسة", value: raw?.tender_type },
        { label: "حالة المنافسة", value: raw?.status },
        { label: "الوقت المتبقي", value: raw?.time_remaining },
        { label: "الجهة الحكومية", value: raw?.agency?.name },
      ],
    },
    {
      title: "تفاصيل العقد",
      fields: [
        {
          label: "قيمة وثائق المنافسة",
          value: raw?.document_cost,
          render: (val) => formatCurrency(val),
        },
        { label: "مدة العقد", value: raw?.contract_duration },
        { label: "التأمين مطلوب", value: raw?.insurance_required },
      ],
    },
    {
      title: "الغرض من المنافسة",
      fields: [
        {
          label: "",
          value: raw?.purpose,
          render: (val) => (
            <div className="text-sm text-slate-700">{val || "-"}</div>
          ),
        },
      ],
    },
    {
      title: "بيانات النظام",
      fields: [
        {
          label: "تاريخ الإنشاء",
          value: raw?.created_at,
          render: (val) => formatDateArabic(val),
        },
        {
          label: "آخر تحديث",
          value: raw?.updated_at,
          render: (val) => formatDateArabic(val),
        },
      ],
    },
  ];

  return <DetailView sections={sections} columns={2} className="space-y-4" />;
}
