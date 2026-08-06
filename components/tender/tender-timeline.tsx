"use client";

import { TimelineView, TimelineSection } from "./timeline-view";

interface TenderTimelineProps {
  tender: any;
}

export function TenderTimeline({ tender }: TenderTimelineProps) {
  const raw = tender?.raw_data;

  // Helper: format date and time in Arabic
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  };

  const valueOrDash = (val: any) => val ?? "-";

  const sections: TimelineSection[] = [
    {
      title: "المواعيد الهامة",
      fields: [
        {
          label: "تاريخ بدء الاستفسارات",
          value: raw?.enquiry_start_date,
          render: formatDateTime,
        },
        {
          label: "آخر موعد للاستفسارات",
          value: raw?.last_enquiry_date,
          render: formatDateTime,
        },
        {
          label: "آخر موعد لتقديم العروض",
          value: raw?.last_submission_date,
          render: formatDateTime,
        },
        {
          label: "تاريخ فتح المظاريف",
          value: raw?.opening_date,
          render: formatDateTime,
        },
        {
          label: "تاريخ الترسية المتوقع",
          value: raw?.expected_award_date,
          render: formatDateTime,
        },
        {
          label: "تاريخ بدء العمل",
          value: raw?.work_start_date,
          render: formatDateTime,
        },
      ],
    },
    {
      title: "الدد الزمنية",
      fields: [
        {
          label: "مدة العقد",
          value: raw?.contract_duration,
          render: valueOrDash,
        },
        {
          label: "فترة التوقف",
          value: raw?.stopping_period,
          render: valueOrDash,
        },
        {
          label: "أقصى وقت للرد على الاستفسارات",
          value: raw?.max_enquiry_response_time,
          render: valueOrDash,
        },
      ],
    },
    {
      title: "العناوين",
      fields: [
        {
          label: "موقع فتح المظاريف",
          value: raw?.opening_location,
          render: valueOrDash,
        },
        {
          label: "عنوان تسليم الضمان الابتدائي",
          value: raw?.initial_guarantee_address,
          render: valueOrDash,
        },
      ],
    },
  ];

  return <TimelineView sections={sections} />;
}
