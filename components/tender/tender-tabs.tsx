"use client";

import { cn } from "@/lib/utils";

interface TenderTabsProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

const tabs = [
  { id: "basic", label: "المعلومات الأساسية" },
  { id: "dates", label: "العناوين والمواعيد" },
  { id: "classification", label: "التصنيف والتقديم" },
  { id: "awarding", label: "نتائج الترسية" },
  { id: "ai", label: "التحليلات والتوقعات" },
];

export function TenderTabs({ activeTab, onChange }: TenderTabsProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-background p-2">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
