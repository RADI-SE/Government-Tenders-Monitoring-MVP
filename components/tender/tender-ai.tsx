"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TenderAIProps {
  tender: any;
}

export function TenderAI({
  tender,
}: TenderAIProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          تحليل الذكاء الاصطناعي
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/40 p-4">
          <h3 className="mb-2 font-semibold">
            ملخص المنافسة
          </h3>

          <p className="text-muted-foreground">
            سيتم إنشاء ملخص باستخدام الذكاء
            الاصطناعي.
          </p>
        </div>

        <div className="rounded-lg border bg-muted/40 p-4">
          <h3 className="mb-2 font-semibold">
            التوصيات
          </h3>

          <p className="text-muted-foreground">
            سيتم عرض التوصيات هنا.
          </p>
        </div>

        <div className="rounded-lg border bg-muted/40 p-4">
          <h3 className="mb-2 font-semibold">
            المخاطر
          </h3>

          <p className="text-muted-foreground">
            سيتم تحليل المخاطر لاحقًا.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
