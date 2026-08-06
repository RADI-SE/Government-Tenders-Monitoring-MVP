"use client";

import { ReactNode } from "react";

// Types for each item type
export type DescriptionItem =
  | {
      type: "keyValue";
      label: string;
      value: any;
      render?: (value: any) => ReactNode;
    }
  | {
      type: "tags";
      items: any[];
      getLabel?: (item: any) => string;
      emptyMessage?: string;
    }
  | {
      type: "table";
      columns: { key: string; label: string }[];
      rows: any[];
      getCellValue?: (row: any, key: string) => any;
      emptyMessage?: string;
    }
  | {
      type: "attachments";
      items: { title?: string; url: string }[];
      emptyMessage?: string;
    };

export interface DescriptionSection {
  title: string;
  items: DescriptionItem[];
}

interface DescriptionViewProps {
  sections: DescriptionSection[];
  columns?: 1 | 2; // default 2
  className?: string;
}

export function DescriptionView({
  sections,
  columns = 2,
  className = "",
}: DescriptionViewProps) {
  // Split sections into two columns if columns === 2
  const col1: DescriptionSection[] = [];
  const col2: DescriptionSection[] = [];
  if (columns === 1) {
    // all sections in one column
    col1.push(...sections);
  } else {
    // Distribute evenly: put half in col1, rest in col2
    const mid = Math.ceil(sections.length / 2);
    col1.push(...sections.slice(0, mid));
    col2.push(...sections.slice(mid));
  }

  const renderSection = (section: DescriptionSection) => (
    <div
      key={section.title}
      className="td-section-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h6 className="td-section-title mb-3 text-sm font-semibold text-slate-700">
        {section.title}
      </h6>
      <div className="space-y-2">
        {section.items.map((item, idx) => {
          if (item.type === "keyValue") {
            return (
              <div
                key={idx}
                className="td-data-row flex gap-2 border-b border-slate-100 py-1.5 last:border-0"
              >
                <span className="td-data-label whitespace-nowrap text-xs text-slate-500">
                  {item.label}:
                </span>
                <span className="td-data-value break-words text-sm font-medium text-slate-800">
                  {item.render ? item.render(item.value) : (item.value ?? "-")}
                </span>
              </div>
            );
          }

          if (item.type === "tags") {
            return (
              <div key={idx} className="flex flex-wrap gap-2">
                {item.items.length > 0 ? (
                  item.items.map((tag, i) => (
                    <span
                      key={i}
                      className="td-list-badge inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                    >
                      {item.getLabel ? item.getLabel(tag) : tag.name || tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">
                    {item.emptyMessage || "-"}
                  </span>
                )}
              </div>
            );
          }

          if (item.type === "table") {
            return (
              <div key={idx} className="table-responsive">
                <table className="etm-table w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-right text-xs font-medium text-slate-500">
                      {item.columns.map((col) => (
                        <th key={col.key} className="pb-2">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {item.rows.length > 0 ? (
                      item.rows.map((row, ri) => (
                        <tr
                          key={ri}
                          className="border-b border-slate-100 last:border-0"
                        >
                          {item.columns.map((col) => (
                            <td key={col.key} className="py-2 text-slate-800">
                              {item.getCellValue
                                ? item.getCellValue(row, col.key)
                                : (row[col.key] ?? "-")}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={item.columns.length}
                          className="py-2 text-center text-sm text-slate-500"
                        >
                          {item.emptyMessage || "-"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            );
          }

          if (item.type === "attachments") {
            return (
              <div key={idx} className="flex flex-wrap gap-2">
                {item.items.length > 0 ? (
                  item.items.map((att, i) => (
                    <a
                      key={i}
                      className="td-attachment-link inline-flex items-center rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {att.title || "ملف"}
                    </a>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">
                    {item.emptyMessage || "-"}
                  </span>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );

  if (columns === 1) {
    return (
      <div className={`space-y-4 ${className}`}>
        {sections.map(renderSection)}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 md:grid-cols-2 ${className}`}>
      <div className="space-y-4">{col1.map(renderSection)}</div>
      <div className="space-y-4">{col2.map(renderSection)}</div>
    </div>
  );
}
