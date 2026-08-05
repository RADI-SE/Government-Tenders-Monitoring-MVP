"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TenderTable, SectionHeader } from "@/app/components/ui";

export default function DashboardPage() {
  const tenders = useQuery(api.tenders.getAllTenders);

  return (
    <div>
      <SectionHeader
        title="المنافسات"
        subtitle="جميع المنافسات المتاحة"
        action={
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">
            + إضافة
          </button>
        }
      />

      <TenderTable tenders={tenders ?? []} />
    </div>
  );
}