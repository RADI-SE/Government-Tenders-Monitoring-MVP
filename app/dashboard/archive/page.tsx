"use client";

import { useQuery } from "convex/react";
import { Archive } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { DataTable } from "@/components/data-table/data-table";
import { ResourcePage } from "@/components/dashboard/resource-page";
import { columns } from "../competitions/columns";
import type { Competition } from "../competitions/types";
import { useState } from "react";

export default function ArchivePage() {

  const [filters, setFilters] = useState({
    search: "",
    searchUntil: "",
  });

  const archived = useQuery(api.ArchivedTenders.getArchivedTenders, {
    searchUntil: filters.searchUntil || undefined,
    search: filters.search || undefined,
  });
  console.log("archived", archived);
  return (
    <ResourcePage
      eyebrow="HISTORICAL RECORDS"
      title="أرشيف المنافسات"
      titleEn="Competition archive"
      subtitle="Archived opportunities kept for reference and search."
      subtitleAr="المنافسات المحفوظة للبحث والرجوع إليها لاحقاً."
      icon={Archive}
    >
      {archived === undefined ? (
        <div className="rounded-2xl bg-white p-12 text-center text-slate-500">
          Loading...
        </div>
      ) : (

        <DataTable
          columns={columns}
          data={archived as unknown as Competition[]}
          isArchived
          onSearch={setFilters}
        />)}
    </ResourcePage>
  );
}



