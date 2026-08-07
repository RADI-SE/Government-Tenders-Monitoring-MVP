"use client";

import { useQuery } from "convex/react";
import { Archive } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { DataTable } from "@/components/data-table/data-table";
import { ResourcePage } from "@/components/dashboard/resource-page";
import { columns } from "../competitions/columns";
import type { Competition } from "../competitions/types";
import { useEffect, useState } from "react";

export default function ArchivePage() {

  const [filters, setFilters] = useState({
    search: "",
    searchUntil: "",
  });

  const archived = useQuery(api.ArchivedTenders.getArchivedTenders, {
    searchUntil: filters.searchUntil || undefined,
    search: filters.search || undefined,
  });
  const [displayedTenders, setDisplayedTenders] = useState<Competition[]>([]);

  useEffect(() => {
    if (archived !== undefined) {
      setDisplayedTenders(archived as unknown as Competition[]);
    }
  }, [archived]);

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
        data={displayedTenders}
        isArchived
        onSearch={setFilters}
      />
    </ResourcePage>
  );
}



