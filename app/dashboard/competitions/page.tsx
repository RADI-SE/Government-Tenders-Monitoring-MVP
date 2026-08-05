"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";

export default function CompetitionsPage() {
  const tenders = useQuery(api.tenders.getAllTenders);

  if (tenders === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={tenders}
    />
  );
}