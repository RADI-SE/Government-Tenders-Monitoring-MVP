"use client";

import { useQuery } from "convex/react";
import { Archive } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { DataTable } from "@/components/data-table/data-table";
import { ResourcePage } from "@/components/dashboard/resource-page";
import { columns } from "../competitions/columns";

import { useState } from "react";

export default function ArchivePage() {

  const [filters, setFilters] = useState({
    search: "",
    searchUntil: "",
    regionId: "",
    agencyId: "",
    activityId: "",
    status: "",
  });

  const archived = useQuery(api.ArchivedTenders.getArchivedTenders, {
    search: filters.search || undefined,
    searchUntil: filters.searchUntil || undefined,
    regionId: filters.regionId || undefined,
    agencyId: filters.agencyId || undefined,
    activityId: filters.activityId || undefined,
    status: filters.status || undefined,
  });

  console.log("Archived Tenders:", archived);


  return (
    <ResourcePage
      eyebrow="HISTORICAL RECORDS"
      title="أرشيف المنافسات"
      titleEn="Competition archive"
      subtitle="Archived opportunities kept for reference and search."
      subtitleAr="المنافسات المحفوظة للبحث والرجوع إليها لاحقاً."
      icon={Archive}
    >
      <DataTable
        columns={columns}
        data={archived || []}
        isArchived
        onSearch={setFilters}
      />
    </ResourcePage>
  );
}



