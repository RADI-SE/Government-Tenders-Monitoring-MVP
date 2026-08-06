"use client";

import { ReactNode } from "react";

export interface TimelineField {
  label: string;
  value: any;
  render?: (value: any) => ReactNode;
}

export interface TimelineSection {
  title: string;
  fields: TimelineField[];
}

interface TimelineViewProps {
  sections: TimelineSection[];
}

export function TimelineView({ sections }: TimelineViewProps) {
  if (!sections.length) return null;

  // First section goes left, the rest go right (stacked)
  const [leftSection, ...rightSections] = sections;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Left column */}
      <div className="td-section-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h6 className="td-section-title mb-3 text-sm font-semibold text-slate-700">
          {leftSection.title}
        </h6>
        <div className="space-y-2">
          {leftSection.fields.map((field, idx) => (
            <div
              key={idx}
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

      {/* Right column */}
      <div className="space-y-4">
        {rightSections.map((section, idx) => (
          <div
            key={idx}
            className="td-section-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h6 className="td-section-title mb-3 text-sm font-semibold text-slate-700">
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
    </div>
  );
}
