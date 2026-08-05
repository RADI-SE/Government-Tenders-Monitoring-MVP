"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { useState } from "react";

import { TenderHeader } from "@/components/tender/tender-header";
import { TenderOverview } from "@/components/tender/tender-overview";

import { TenderTabs } from "@/components/tender/tender-tabs";
import { TenderDescription } from "@/components/tender/tender-description";
import { TenderAttachments } from "@/components/tender/tender-attachments";
import { TenderTimeline } from "@/components/tender/tender-timeline";
import { TenderAI } from "@/components/tender/tender-ai";

export default function TenderDetail() {
    const { tenderId } = useParams<{ tenderId: string }>();

    const tender = useQuery(
        api.tenders.getTenderById,
        tenderId ? { id: Number(tenderId) } : "skip"
    );

    const [activeTab, setActiveTab] = useState("overview");

    if (tender === undefined) {
        // loading
    }

    if (!tender) {
        // not found
    }

    return (
        <div className="space-y-6 p-6">
            <TenderHeader tender={tender} />

            <TenderTabs
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === "overview" && (
                <TenderOverview tender={tender} />
            )}

            {activeTab === "description" && (
                <TenderDescription tender={tender} />
            )}

            {activeTab === "attachments" && (
                <TenderAttachments tender={tender} />
            )}

            {activeTab === "timeline" && (
                <TenderTimeline tender={tender} />
            )}

            {activeTab === "ai" && (
                <TenderAI tender={tender} />
            )}
        </div>
    );
}
