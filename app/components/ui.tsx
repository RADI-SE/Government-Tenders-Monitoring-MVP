// app/components/ui.tsx
import type { ReactNode, CSSProperties } from "react";
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate, deadlineLabel } from "@/app/utils/date";
import type { Doc } from "@/convex/_generated/dataModel";
import { CompetitionStatus } from "@/components/competitions/competition-status";

type BackendTender = Doc<"tenders">;

// ---------- Language Context ----------
type Lang = "ar" | "en";
const LanguageContext = createContext<{
  language: Lang;
  toggle: () => void;
  tr: (ar: string, en: string) => string;
}>({
  language: "ar",
  toggle: () => { },
  tr: (ar) => ar,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Lang>("ar");
  const toggle = () => setLanguage((l) => (l === "ar" ? "en" : "ar"));
  const tr = (ar: string, en: string) => (language === "ar" ? ar : en);
  return (
    <LanguageContext.Provider value={{ language, toggle, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ---------- Icon (simple emoji map) ----------
const iconMap: Record<string, string> = {
  overview: "📊",
  tenders: "📋",
  calendar: "📅",
  tasks: "✅",
  archive: "🗂️",
  sparkles: "✨",
  menu: "☰",
  bell: "🔔",
  file: "📄",
  chevron: "▶",
  search: "🔍",
  close: "✕",
  home: "🏠",
  stats: "📈",
};
export function Icon({ name }: { name: string }) {
  return (
    <span className="inline-block w-5 h-5 text-center">
      {iconMap[name] || "•"}
    </span>
  );
}

// ---------- Score Ring ----------
export function ScoreRing({
  score,
  small = false,
}: {
  score: number | string;
  small?: boolean;
}) {
  const { language } = useLanguage();
  const tr = (ar: string, en: string) => (language === "ar" ? ar : en);
  const numScore =
    typeof score === "string" ? parseInt(score) || 0 : score || 0;
  const tone = numScore >= 85 ? "high" : numScore >= 70 ? "medium" : "low";
  const colors = {
    high: "text-green-600",
    medium: "text-yellow-600",
    low: "text-red-600",
  };
  return (
    <div className={`flex items-center gap-1 ${small ? "text-sm" : ""}`}>
      <div
        className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full border-2 ${colors[tone]}`}
        style={{ "--score": `${numScore * 3.6}deg` } as CSSProperties}
      >
        <span className="text-sm font-bold">{numScore}</span>
      </div>
      {!small && (
        <small className="text-xs text-gray-400">
          {tr("من 100", "out of 100")}
        </small>
      )}
    </div>
  );
}

// ---------- Status Badge ----------
export function StatusBadge({ status }: { status: string }) {
  const { language } = useLanguage();
  const labels: Record<string, { ar: string; en: string; className: string }> =
  {
    new: { ar: "جديد", en: "New", className: "bg-blue-100 text-blue-800" },
    reviewing: {
      ar: "قيد المراجعة",
      en: "Reviewing",
      className: "bg-yellow-100 text-yellow-800",
    },
    interested: {
      ar: "مثير للاهتمام",
      en: "Interested",
      className: "bg-green-100 text-green-800",
    },
    not_suitable: {
      ar: "غير مناسب",
      en: "Not suitable",
      className: "bg-red-100 text-red-800",
    },
    submitted: {
      ar: "تم التقديم",
      en: "Submitted",
      className: "bg-purple-100 text-purple-800",
    },
    archived: {
      ar: "مؤرشف",
      en: "Archived",
      className: "bg-gray-100 text-gray-800",
    },
  };
  const info = labels[status] || labels.new;
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${info.className}`}
    >
      {language === "ar" ? info.ar : info.en}
    </span>
  );
}

// ---------- Metric Card ----------
export function MetricCard({
  label,
  value,
  hint,
  icon,
  tone = "blue",
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: string;
  tone?: "blue" | "green" | "red" | "yellow";
}) {
  const toneClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    yellow: "bg-yellow-50 text-yellow-700",
  };
  return (
    <article className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${toneClasses[tone]}`}
      >
        <Icon name={icon} />
      </div>
      <div>
        <span className="text-sm text-gray-500">{label}</span>
        <strong className="block text-xl">{value}</strong>
        <small className="text-xs text-gray-400">{hint}</small>
      </div>
    </article>
  );
}

// ---------- Tender Table ----------
export function TenderTable({ tenders }: { tenders: BackendTender[] }) {
  const { language, tr } = useLanguage();
  const router = useRouter();

  // Helpers
  const getAgency = (tender: BackendTender) =>
    tender.raw_data?.agency?.name || tender.agency_id || "-";
  const getCategory = (tender: BackendTender) =>
    tender.classification || tender.raw_data?.classification_field || "-";
  const getScore = (tender: BackendTender) => tender.opportunity_score ?? "-";

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="w-full text-right">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-sm font-medium text-gray-600">
              {tr("المنافسة", "Tender")}
            </th>
            <th className="p-4 text-sm font-medium text-gray-600">
              {tr("الجهة", "Agency")}
            </th>
            <th className="p-4 text-sm font-medium text-gray-600">
              {tr("التصنيف", "Category")}
            </th>
            <th className="p-4 text-sm font-medium text-gray-600">
              {tr("آخر موعد", "Deadline")}
            </th>
            <th className="p-4 text-sm font-medium text-gray-600">
              {tr("درجة الفرصة", "Score")}
            </th>
            <th className="p-4 text-sm font-medium text-gray-600">
              {tr("الحالة", "Status")}
            </th>
            <th className="p-4 text-sm font-medium text-gray-600"></th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender) => (
            <tr
              key={tender._id}
              className="border-b hover:bg-gray-50 cursor-pointer transition"
              onClick={() => router.push("/dashboard/competitions")}
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <Icon name="file" />
                  <div>
                    <strong className="block">{tender.tender_name}</strong>
                    <small className="text-gray-400 text-xs">
                      {tr("رقم", "Ref.")}: {tender.reference_number}
                    </small>
                  </div>
                </div>
              </td>
              <td className="p-4">{getAgency(tender)}</td>
              <td className="p-4">
                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                  {getCategory(tender)}
                </span>
              </td>
              <td className="p-4">
                <strong className="block">
                  {formatDate(tender.last_submission_date, language)}
                </strong>
                <small className="text-gray-400 text-xs">
                  {deadlineLabel(tender.last_submission_date, language)}
                </small>
              </td>
              <td className="p-4">
                <ScoreRing score={getScore(tender)} small />
              </td>
              <td className="p-4">
                <CompetitionStatus status={tender.original_status} />           
                   </td>
              <td className="p-4">
                <button
                  className="text-blue-600 hover:underline"
                  aria-label={tr("فتح التفاصيل", "Open details")}
                >
                  <Icon name="chevron" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- Section Header ----------
export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
