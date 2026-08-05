"use client";

import { LucideIcon } from "lucide-react";

interface TenderInfoCardProps {
  title: string;
  value?: string | number;
  icon: LucideIcon;
}

export function TenderInfoCard({
  title,
  value,
  icon: Icon,
}: TenderInfoCardProps) {
  return (
    <div className="rounded-xl border bg-background p-5 transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <span className="text-sm text-muted-foreground">
          {title}
        </span>
      </div>

      <p className="text-lg font-semibold break-words">
        {value || "-"}
      </p>
    </div>
  );
}
