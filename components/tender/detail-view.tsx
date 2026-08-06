"use client";

import { ReactNode } from "react";

export interface Field {
  label: string;
  value: any;
  render?: (value: any) => ReactNode;
}

export interface Section {
  title: string;
  fields: Field[];
}

interface DetailViewProps {
  sections: Section[];
  columns?: 1 | 2 | 3; // defaults to 2
  className?: string;
}

export function DetailView({
  sections,
  columns = 2,
  className = "",
}: DetailViewProps) {
  // Split sections into two columns if columns === 2
  const renderSections = (sectionList: Section[]) => (
    <div
      className={`grid gap-4 ${columns === 1 ? "grid-cols-1" : columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}
    >
      {sectionList.map((section, idx) => (
        <div
          key={idx}
          className="td-section-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"
        >
          <h6 className="td-section-title text-sm font-semibold text-slate-700">
            {section.title}
          </h6>
          <div className="space-y-2">
            {section.fields.map((field, fIdx) => (
              <div
                key={fIdx}
                className="td-data-row flex gap-2 border-b border-slate-100 py-1.5 last:border-0"
              >
                <span className="td-data-label whitespace-nowrap text-xs text-slate-500">
                  {field.label}:
                </span>
                <span className="td-data-value break-words text-sm font-medium text-slate-800">
                  {field.render
                    ? field.render(field.value)
                    : (field.value ?? "-")}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // If columns === 2, we want to distribute sections evenly.
  // For simplicity, we can just render all sections in the grid.
  // The grid will place them left-to-right, top-to-bottom.
  // To have a balanced two-column layout, we could split the array, but it's fine.
  return <div className={className}>{renderSections(sections)}</div>;
}
