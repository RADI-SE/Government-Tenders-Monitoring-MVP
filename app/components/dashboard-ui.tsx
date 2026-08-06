import type { CSSProperties, ReactNode } from "react";
import type { Tender, TenderStatus, ViewKey } from "../types";
import { statusLabel } from "../data/localization";
import { Icon, SpiderLogo } from "./icons";
import { LanguageToggle, useLanguage } from "./language-provider";

export const navItems: { key: ViewKey; icon: string }[] = [
  { key: "overview", icon: "overview" },
  { key: "tenders", icon: "tenders" },
  { key: "deadlines", icon: "calendar" },
  { key: "tasks", icon: "tasks" },
  { key: "archive", icon: "archive" },
];

export function Sidebar({
  active,
  onNavigate,
  open,
  onClose,
}: {
  active: ViewKey;
  onNavigate: (view: ViewKey) => void;
  open: boolean;
  onClose: () => void;
}) {
  const { tr } = useLanguage();
  const labels: Record<ViewKey, string> = {
    overview: tr("نظرة عامة", "Overview"),
    tenders: tr("المنافسات", "Tenders"),
    deadlines: tr("المواعيد النهائية", "Deadlines"),
    tasks: tr("المهام والمتابعات", "Tasks & follow-ups"),
    archive: tr("الأرشيف", "Archive"),
  };
  return (
    <>
      <div
        className={`mobile-backdrop ${open ? "is-visible" : ""}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <div className="sidebar-brand">
          <SpiderLogo />
        </div>
        <nav
          className="sidebar-nav"
          aria-label={tr("التنقل الرئيسي", "Main navigation")}
        >
          <p className="nav-label">{tr("مساحة العمل", "Workspace")}</p>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${active === item.key ? "active" : ""}`}
              onClick={() => {
                onNavigate(item.key);
                onClose();
              }}
            >
              <Icon name={item.icon} />
              <span>{labels[item.key]}</span>
              {item.key === "deadlines" && <b className="nav-count">3</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-card">
          <span className="sidebar-card-icon">
            <Icon name="sparkles" />
          </span>
          <div>
            <strong>
              {tr("تحليل الفرص بالذكاء الاصطناعي", "AI opportunity analysis")}
            </strong>
            <p>
              {tr(
                "ملخص وتصنيف مبدئي للعرض التجريبي",
                "Sample summary and classification",
              )}
            </p>
          </div>
        </div>
        <div className="sidebar-profile">
          <span className="avatar">F</span>
          <div>
            <strong>{tr("فرح السيد", "Farah Elsaid")}</strong>
            <span>Spiders AI {tr("فريق", "Team")}</span>
          </div>
          <button aria-label={tr("خيارات الحساب", "Account options")}>
            •••
          </button>
        </div>
      </aside>
    </>
  );
}

export function Topbar({
  title,
  subtitle,
  onMenu,
}: {
  title: string;
  subtitle: string;
  onMenu: () => void;
}) {
  const { tr } = useLanguage();
  return (
    <header className="topbar">
      <div className="topbar-title">
        <button
          className="mobile-menu"
          onClick={onMenu}
          aria-label={tr("فتح القائمة", "Open menu")}
        >
          <Icon name="menu" />
        </button>
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="topbar-actions">
        <LanguageToggle />
        <button
          className="icon-button notification-button"
          aria-label={tr("الإشعارات", "Notifications")}
        >
          <Icon name="bell" />
          <span />
        </button>
        <div className="topbar-profile">
          <span className="avatar">F</span>
          <div>
            <strong>{tr("مرحباً، فرح", "Hello, Farah")}</strong>
            <span>{tr("عضو الفريق", "Team member")}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

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
  tone?: string;
}) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${tone}`}>
        <Icon name={icon} />
      </div>
      <div className="metric-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{hint}</small>
      </div>
    </article>
  );
}
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
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
export function StatusBadge({ status }: { status: TenderStatus }) {
  const { language } = useLanguage();
  return (
    <span className={`status-badge status-${status}`}>
      <i />
      {statusLabel(status, language)}
    </span>
  );
}
export function ScoreRing({
  score,
  small = false,
}: {
  score: number;
  small?: boolean;
}) {
  const { tr } = useLanguage();
  const tone = score >= 85 ? "high" : score >= 70 ? "medium" : "low";
  return (
    <div
      className={`score-ring ${tone} ${small ? "small" : ""}`}
      style={{ "--score": `${score * 3.6}deg` } as CSSProperties}
    >
      <span>{score}</span>
      {!small && <small>{tr("من 100", "out of 100")}</small>}
    </div>
  );
}

export function TenderTable({
  tenders,
  onOpen,
}: {
  tenders: Tender[];
  onOpen: (tender: Tender) => void;
}) {
  const { language, tr } = useLanguage();
  return (
    <div className="table-wrap">
      <table className="tenders-table">
        <thead>
          <tr>
            <th>{tr("المنافسة", "Tender")}</th>
            <th>{tr("الجهة", "Agency")}</th>
            <th>{tr("التصنيف", "Category")}</th>
            <th>{tr("آخر موعد", "Deadline")}</th>
            <th>{tr("درجة الفرصة", "Score")}</th>
            <th>{tr("الحالة", "Status")}</th>
            <th>
              <span className="sr-only">{tr("فتح", "Open")}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender) => (
            <tr
              key={tender.id}
              onClick={() => onOpen(tender)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter") onOpen(tender);
              }}
            >
              <td>
                <div className="tender-title-cell">
                  <span className="tender-doc">
                    <Icon name="file" />
                  </span>
                  <div>
                    <strong>{tender.title}</strong>
                    <small>
                      {tr("رقم", "Ref.")} {tender.reference}
                    </small>
                  </div>
                </div>
              </td>
              <td>{tender.agency}</td>
              <td>
                <span className="category-pill">{tender.category}</span>
              </td>
              <td>
                <strong className="date-cell">
                  {formatDate(tender.deadline, language)}
                </strong>
                <small className="days-cell">
                  {deadlineLabel(tender.deadline, language)}
                </small>
              </td>
              <td>
                <ScoreRing score={tender.score} small />
              </td>
              <td>
                <StatusBadge status={tender.status} />
              </td>
              <td>
                <button
                  className="row-open"
                  aria-label={`${tr("فتح", "Open")} ${tender.title}`}
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

export function EmptyState({ archived = false }: { archived?: boolean }) {
  const { tr } = useLanguage();
  return (
    <div className="empty-state">
      <span>
        <Icon name={archived ? "archive" : "search"} />
      </span>
      <h3>{tr("لا توجد نتائج مطابقة", "No matching results")}</h3>
      <p>
        {tr(
          "جرّب تغيير كلمات البحث أو نطاق التاريخ أو الحالة.",
          "Try changing the search terms, date range, or status.",
        )}
      </p>
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const { tr } = useLanguage();
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        className={`modal ${wide ? "modal-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header>
          <div>
            <span className="eyebrow">
              {tr("منصة رصد المنافسات", "Tender monitoring platform")}
            </span>
            <h2>{title}</h2>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label={tr("إغلاق", "Close")}
          >
            <Icon name="close" />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

export function formatDate(date: string, language: "ar" | "en" = "ar") {
  return new Intl.DateTimeFormat(language === "ar" ? "ar-SA" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    calendar: "gregory",
  }).format(new Date(`${date}T12:00:00`));
}
export function deadlineLabel(date: string, language: "ar" | "en" = "ar") {
  const diff = Math.ceil(
    (new Date(`${date}T12:00:00`).getTime() -
      new Date("2026-08-04T12:00:00").getTime()) /
      86400000,
  );
  if (language === "en")
    return diff < 0
      ? "Deadline passed"
      : diff === 0
        ? "Due today"
        : diff === 1
          ? "1 day left"
          : `${diff} days left`;
  if (diff < 0) return "انتهى الموعد";
  if (diff === 0) return "اليوم";
  if (diff === 1) return "متبقي يوم واحد";
  if (diff <= 10) return `متبقي ${diff} أيام`;
  return `متبقي ${diff} يوماً`;
}
