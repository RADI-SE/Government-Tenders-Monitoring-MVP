"use client";

import { ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TenderAttachmentsProps {
  tender: any;
}

export function TenderAttachments({ tender }: TenderAttachmentsProps) {
  const attachments = tender.raw_data?.attachments ?? [];

  return (
    <div className="grid gap-4">
      {attachments.length === 0 && (
        <p className="text-muted-foreground">لا توجد مرفقات.</p>
      )}

      {attachments.map((attachment: any) => (
        <div
          key={attachment.id}
          className="flex items-center justify-between rounded-xl border p-4"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5" />

            <div>
              <p className="font-medium">{attachment.title}</p>
            </div>
          </div>

          <Button asChild variant="outline">
            <a href={attachment.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              فتح
            </a>
          </Button>
        </div>
      ))}
    </div>
  );
}
