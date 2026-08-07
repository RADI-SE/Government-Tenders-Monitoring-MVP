"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { useState } from "react";

import { TenderHeader } from "@/components/tender/tender-header";
import { TenderOverview } from "@/components/tender/tender-overview";

import { TenderTabs } from "@/components/tender/tender-tabs";
import { TenderDescription } from "@/components/tender/tender-description";
import { TenderAwarding } from "@/components/tender/tender-awarding";
import { TenderTimeline } from "@/components/tender/tender-timeline";
import { TenderAI } from "@/components/tender/tender-ai";

export default function TenderDetail() {
  const { tenderId } = useParams<{ tenderId: string }>();

  const tender = useQuery(
    api.tenders.getTenderById,
    tenderId ? { id: Number(tenderId) } : "skip",
  );

  const archivedTender = useQuery(
    api.ArchivedTenders.getArchivedTenderById,
    tenderId ? { id: Number(tenderId) } : "skip",
  );

  console.log("Tender:", tender);
  console.log("Archived Tender:", archivedTender);
  const [activeTab, setActiveTab] = useState("overview");

const currentTender = tender ?? archivedTender;

if (tender === undefined && archivedTender === undefined) {
  return <div>Loading...</div>;
}

if (!currentTender) {
  return <div>Tender not found.</div>;
}

  return (
    <div className="space-y-6 p-6">
      <TenderHeader tender={tender} />

      <TenderTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "basic" && <TenderOverview tender={currentTender} />}

      {activeTab === "classification" && <TenderDescription tender={currentTender} />}

      {activeTab === "awarding" && <TenderAwarding tender={currentTender} />}

      {activeTab === "dates" && <TenderTimeline tender={currentTender} />}

      {activeTab === "ai" && <TenderAI tender={currentTender} />}
    </div>
  );
}
