"use client";

import { useQuery } from "convex/react";
import { useState } from "react";
import { Compass } from "lucide-react"; // or some active icon
import { api } from "@/convex/_generated/api";
import { DataTable } from "@/components/data-table/data-table";
import { ResourcePage } from "@/components/dashboard/resource-page";
import { columns } from "./columns";

export default function CompetitionsPage() {
  const [filters, setFilters] = useState({
    search: "",
    searchUntil: "",
    regionId: "",
    agencyId: "",
    activityId: "",
    status: "",
  });

  const tenders = useQuery(api.tenders.searchActiveTenders, {
    search: filters.search || undefined,
    regionId: filters.regionId || undefined,
    agencyId: filters.agencyId || undefined,
    activityId: filters.activityId || undefined,
    status: filters.status || undefined,
  });

  return (
    <ResourcePage
      eyebrow="LIVE OPPORTUNITIES"
      title="المنافسات الحكومية"
      titleEn="Government competitions"
      subtitle="Browse, search, and filter monitored opportunities."
      subtitleAr="استعرض المنافسات وابحث فيها وصفِّها حسب احتياجك."
      icon={Compass}
    >
      <DataTable
        columns={columns}
        data={tenders || []}
        onSearch={setFilters}
      />
    </ResourcePage>
  );
}