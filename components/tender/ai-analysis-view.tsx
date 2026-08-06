"use client";

import { ReactNode } from "react";
import {
  Clock,
  Target,
  Shield,
  TrendingUp,
  Building2,
  FileCheck,
} from "lucide-react";

export interface AIInsight {
  icon: ReactNode;
  label: string;
  value: string;
  color?: string;
}

export interface AIRecommendation {
  text: string;
  color: "indigo" | "amber" | "green" | "purple" | "red" | "blue";
  priority?: "high" | "medium" | "low";
}

export interface AIRisk {
  title: string;
  items: string[];
  type: "high" | "low";
}

interface AIAnalysisViewProps {
  title?: string;
  insights?: AIInsight[];
  recommendations?: AIRecommendation[];
  risks?: AIRisk[];
  className?: string;
  loading?: boolean;
}

const colorMap = {
  indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
  amber: "bg-amber-50 border-amber-200 text-amber-700",
  green: "bg-green-50 border-green-200 text-green-700",
  purple: "bg-purple-50 border-purple-200 text-purple-700",
  red: "bg-red-50 border-red-200 text-red-700",
  blue: "bg-blue-50 border-blue-200 text-blue-700",
};

const dotColorMap = {
  indigo: "bg-indigo-500",
  amber: "bg-amber-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
};

export function AIAnalysisView({
  title = "تحليل الذكاء الاصطناعي",
  insights = [],
  recommendations = [],
  risks = [],
  className = "",
  loading = false,
}: AIAnalysisViewProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="td-section-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h6 className="td-section-title mb-3 text-sm font-semibold text-slate-700">
            {title}
          </h6>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg bg-slate-100 p-4"
              >
                <div className="mb-2 h-4 w-20 rounded bg-slate-200"></div>
                <div className="h-5 w-32 rounded bg-slate-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Insights */}
      {insights.length > 0 && (
        <div className="td-section-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h6 className="td-section-title mb-3 text-sm font-semibold text-slate-700">
            ملخص تحليلي
          </h6>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 rounded-lg p-3 ${
                  insight.color || "bg-indigo-50"
                }`}
              >
                {insight.icon}
                <div>
                  <p className="text-xs text-slate-500">{insight.label}</p>
                  <p className="font-medium text-slate-800">{insight.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="td-section-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h6 className="td-section-title mb-3 text-sm font-semibold text-slate-700">
            التوصيات الذكية
          </h6>
          <ul className="space-y-2 text-sm text-slate-700">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span
                  className={`mt-1 inline-block h-1.5 w-1.5 rounded-full ${dotColorMap[rec.color]}`}
                />
                <span>{rec.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risks */}
      {risks.length > 0 && (
        <div className="td-section-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h6 className="td-section-title mb-3 text-sm font-semibold text-slate-700">
            تحليل المخاطر
          </h6>
          <div className="grid gap-3 md:grid-cols-2">
            {risks.map((risk, idx) => (
              <div
                key={idx}
                className={`rounded-lg border p-3 ${
                  risk.type === "high"
                    ? "border-red-200 bg-red-50"
                    : "border-green-200 bg-green-50"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    risk.type === "high" ? "text-red-700" : "text-green-700"
                  }`}
                >
                  {risk.title}
                </p>
                {risk.items.length > 0 && (
                  <ul className="mt-1 list-inside list-disc text-xs text-slate-600">
                    {risk.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
