"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Doc } from "@/convex/_generated/dataModel";

interface TenderDescriptionProps {
  tender: Doc<"tenders">;
}

export function TenderDescription({
  tender,
}: TenderDescriptionProps) {
  const raw = tender.raw_data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>وصف المنافسة</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-2 font-semibold">
            الوصف
          </h3>

          <p className="leading-8 text-muted-foreground">
            {tender.description || "-"}
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">
            الغرض من المنافسة
          </h3>

          <p className="leading-8 text-muted-foreground">
            {raw.purpose || "-"}
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">
            طريقة التقديم
          </h3>

          <p className="text-muted-foreground">
            {raw.submission_method || "-"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
