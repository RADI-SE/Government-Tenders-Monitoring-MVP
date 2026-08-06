"use client";

import { DescriptionView, DescriptionSection } from "./description-view";

interface TenderDescriptionProps {
  tender: any;
}

export function TenderDescription({ tender }: TenderDescriptionProps) {
  const raw = tender?.raw_data;

  const valueOrDash = (val: any) => val ?? "-";

  const location = raw?.execution_locations?.[0];
  const regionName = location?.region?.name || "-";
  const cityName = location?.city?.name || "-";

  const activities = raw?.tender_activities || [];
  const mechanisms = raw?.local_content_mechanisms || [];
  const attachments = raw?.attachments || [];

  const sections: DescriptionSection[] = [
    {
      title: "مجال التصنيف",
      items: [
        {
          type: "keyValue",
          label: "مجال التصنيف",
          value: raw?.classification_field,
        },
        {
          type: "keyValue",
          label: "يشمل توريدات",
          value: raw?.includes_supply_items,
        },
      ],
    },
    {
      title: "نشاط المنافسة",
      items: [
        {
          type: "tags",
          items: activities,
          getLabel: (item) => item.activity?.name || "-",
          emptyMessage: "لا يوجد نشاط",
        },
      ],
    },
    {
      title: "موقع التنفيذ",
      items: [
        {
          type: "table",
          columns: [
            { key: "region", label: "المنطقة" },
            { key: "city", label: "المدينة" },
          ],
          rows: [{ region: regionName, city: cityName }],
          getCellValue: (row, key) => row[key],
          emptyMessage: "لا يوجد موقع",
        },
      ],
    },
    {
      title: "طريقة التقديم والضمانات",
      items: [
        {
          type: "keyValue",
          label: "طريقة التقديم",
          value: raw?.submission_method,
        },
        {
          type: "keyValue",
          label: "الضمان الابتدائي",
          value: raw?.initial_guarantee_required,
        },
        {
          type: "keyValue",
          label: "الضمان النهائي",
          value: raw?.final_guarantee,
        },
      ],
    },
    {
      title: "آليات المحتوى المحلي",
      items: [
        {
          type: "tags",
          items: mechanisms,
          getLabel: (item) => item.name || "-",
          emptyMessage: "لا توجد آليات",
        },
      ],
    },
    {
      title: "المرفقات",
      items: [
        {
          type: "attachments",
          items: attachments,
          emptyMessage: "لا توجد مرفقات",
        },
      ],
    },
  ];

  return <DescriptionView sections={sections} columns={2} />;
}
