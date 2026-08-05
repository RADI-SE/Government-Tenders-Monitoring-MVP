"use client";

import {
  Building2,
  Calendar,
  Clock3,
  FileText,
  MapPin,
  Map,
} from "lucide-react";

import { TenderInfoCard } from "./tender-info-card";
import type { Doc } from "@/convex/_generated/dataModel";

interface TenderOverviewProps {
  tender: Doc<"tenders">;
}

export function TenderOverview({
  tender,
}: TenderOverviewProps) {
  const raw = tender?.raw_data;

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      <TenderInfoCard
        title="الجهة"
        value={raw?.agency?.name}
        icon={Building2}
      />

      <TenderInfoCard
        title="المنطقة"
        value={raw?.execution_locations?.[0]?.region?.name}
        icon={Map}
      />

      <TenderInfoCard
        title="المدينة"
        value={raw?.execution_locations?.[0]?.city?.name}
        icon={MapPin}
      />

      <TenderInfoCard
        title="نوع المنافسة"
        value={raw?.tender_type}
        icon={FileText}
      />

      <TenderInfoCard
        title="مدة العقد"
        value={raw?.contract_duration}
        icon={Clock3}
      />

      <TenderInfoCard
        title="آخر موعد للتقديم"
        value={formatDate(raw?.last_submission_date)}
        icon={Calendar}
      />

    </div>
  );
}
