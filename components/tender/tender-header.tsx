"use client";

import Link from "next/link";
import {
    ArrowLeft,
    Building2,
    Calendar,
    MapPin,
    Share2,
    Star,
    ExternalLink
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CompetitionStatus } from "@/components/competitions/competition-status";
import type { Doc } from "@/convex/_generated/dataModel";

interface TenderHeaderProps {
    tender: Doc<"tenders">;
}

export function TenderHeader({
    tender,
}: TenderHeaderProps) {
    const raw = tender?.raw_data;

    const etimadId = raw?.etimad_id;

    const etimadLink = etimadId
        ? `https://tenders.etimad.sa/Tender/DetailsForVisitor?STenderId=${encodeURIComponent(
            etimadId
        )}`
        : null;
    return (
        <div className="space-y-6 rounded-xl border bg-background p-6">

            {/* Top Row */}

            <div className="flex items-center justify-between">

                <Link href="/dashboard/competitions">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        العودة
                    </Button>
                </Link>



                <div className="flex items-center gap-2">
                    {etimadLink && (
                        <Button render={<a
                                href={etimadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            />}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                عرض في اعتماد
                        </Button>
                    )}

                    <Button variant="outline">
                        <Star className="mr-2 h-4 w-4" />
                        حفظ
                    </Button>

                    <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        مشاركة
                    </Button>
                </div>

            </div>

            {/* Title */}

            <div className="space-y-2">

                <h1 className="text-3xl font-bold">
                    {tender?.tender_name}
                </h1>

                <p className="text-muted-foreground">
                    الرقم المرجعي: {tender?.reference_number}
                </p>

            </div>

            {/* Info */}

            <div className="flex flex-wrap gap-6">

                <CompetitionStatus
                    status={tender?.original_status}
                />

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {raw?.agency?.name}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {raw?.execution_locations?.[0]?.region?.name}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    آخر موعد:
                    {tender.last_submission_date
                        ? new Date(tender.last_submission_date).toLocaleDateString("ar-SA")
                        : "-"}
                </div>

            </div>

        </div>
    );
}
