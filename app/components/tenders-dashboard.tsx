"use client";

import { useMemo, useRef, useState } from "react";
import { initialTenders, statusLabels } from "../data/mock-tenders";
import type { Tender, ViewKey } from "../types";
import { Icon } from "./icons";
import {
  EmptyState,
  MetricCard,
  Modal,
  SectionHeader,
  Sidebar,
  StatusBadge,
  TenderTable,
  Topbar,
  deadlineLabel,
  formatDate,
} from "./dashboard-ui";
import { TenderDetail } from "./tender-detail";
import { useLanguage } from "./language-provider";
import { localizeTender, statusLabel } from "../data/localization";

export function TendersDashboard() {
  const { language, tr } = useLanguage();
  const [view, setView] = useState<ViewKey>("overview");
  const [tenders, setTenders] = useState<Tender[]>(initialTenders);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const localizedTenders = tenders.map((tender) =>
    localizeTender(tender, language),
  );
  const selected =
    localizedTenders.find((tender) => tender.id === selectedId) ?? null;
  const categories = [
    ...new Set(localizedTenders.map((tender) => tender.category)),
  ];
  const activeTenders = localizedTenders.filter(
    (tender) => tender.status !== "archived",
  );
  const archivedTenders = localizedTenders.filter(
    (tender) => tender.status === "archived",
  );
  const tasks = localizedTenders.filter((tender) => tender.taskCreated);
  const upcoming = [...activeTenders]
    .filter((tender) => new Date(tender.deadline) >= new Date("2026-08-04"))
    .sort((a, b) => a.deadline.localeCompare(b.deadline));

  const filteredTenders = useMemo(() => {
    const source = view === "archive" ? archivedTenders : activeTenders;
    const normalized = query.trim().toLocaleLowerCase("ar");
    return source.filter((tender) => {
      const textMatch =
        !normalized ||
        [
          tender.title,
          tender.agency,
          tender.reference,
          tender.category,
          tender.purpose,
        ]
          .join(" ")
          .toLocaleLowerCase("ar")
          .includes(normalized);
      const categoryMatch = category === "all" || tender.category === category;
      const statusMatch = status === "all" || tender.status === status;
      const fromMatch = !fromDate || tender.publishDate >= fromDate;
      const toMatch = !toDate || tender.publishDate <= toDate;
      return textMatch && categoryMatch && statusMatch && fromMatch && toMatch;
    });
  }, [
    activeTenders,
    archivedTenders,
    category,
    fromDate,
    query,
    status,
    toDate,
    view,
  ]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }

  function patchTender(id: string, patch: Partial<Tender>) {
    setTenders((current) =>
      current.map((tender) =>
        tender.id === id ? { ...tender, ...patch } : tender,
      ),
    );
  }

  function navigate(next: ViewKey) {
    setView(next);
    setQuery("");
    setCategory("all");
    setStatus("all");
    setFromDate("");
    setToDate("");
  }

  function runMockScan() {
    const exists = tenders.some((tender) => tender.id === "t-scan-1");
    if (exists) {
      notify(
        tr(
          "الفحص التجريبي مكتمل — لا توجد منافسات جديدة",
          "Sample scan complete — no new tenders",
        ),
      );
      return;
    }
    setTenders((current) => [
      {
        id: "t-scan-1",
        reference: "2026/1051",
        title: "تشغيل منصة البيانات المفتوحة وتطوير خدماتها",
        agency: "الهيئة السعودية للبيانات والذكاء الاصطناعي",
        category: "البيانات والذكاء الاصطناعي",
        region: "الرياض",
        publishDate: "2026-08-03",
        deadline: "2026-08-24",
        status: "new",
        score: 89,
        value: "2,750,000 ر.س",
        purpose:
          "تشغيل وتطوير منصة البيانات المفتوحة ورفع جودة البيانات المنشورة.",
        requirements: [
          "خبرة في حوكمة البيانات",
          "فريق تشغيل محلي",
          "لوحات قياس جودة",
        ],
        summary:
          "فرصة حديثة عالية الملاءمة في تشغيل منصات البيانات، مع متطلبات واضحة للحوكمة والجودة.",
        recommendation: "يوصى ببدء المراجعة الفنية.",
        documents: [{ name: "نطاق العمل التجريبي.pdf", size: "3.9 MB" }],
      },
      ...current,
    ]);
    notify(
      tr(
        "تم الفحص التجريبي وإضافة منافسة جديدة",
        "Sample scan complete — one tender added",
      ),
    );
  }

  function importCsv(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const lines = String(reader.result).split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) {
        notify(
          tr(
            "ملف CSV لا يحتوي على سجلات قابلة للاستيراد",
            "The CSV file has no importable records",
          ),
        );
        return;
      }
      const headers = lines[0]
        .split(",")
        .map((item) => item.trim().toLowerCase());
      const imported = lines.slice(1).map((line, index): Tender => {
        const values = line
          .split(",")
          .map((item) => item.trim().replace(/^"|"$/g, ""));
        const read = (key: string, fallback: string) =>
          values[headers.indexOf(key)] || fallback;
        return {
          id: `csv-${Date.now()}-${index}`,
          reference: read("reference", `CSV-${index + 1}`),
          title: read("title", "منافسة مستوردة"),
          agency: read("agency", "جهة حكومية"),
          category: read("category", "غير مصنف"),
          region: read("region", "المملكة العربية السعودية"),
          publishDate: read("publishdate", "2026-08-04"),
          deadline: read("deadline", "2026-08-30"),
          status: "new",
          score: Number(read("score", "70")),
          value: read("value", "غير محدد"),
          purpose: read("purpose", "سجل مستورد من ملف CSV للعرض التجريبي."),
          requirements: ["تحتاج إلى مراجعة الفريق"],
          summary: "لم يتم إنشاء الملخص بعد؛ هذا السجل مستورد من ملف CSV.",
          recommendation: "مراجعة البيانات والوثائق قبل اتخاذ القرار.",
          documents: [],
        };
      });
      setTenders((current) => [...imported, ...current]);
      notify(
        language === "ar"
          ? `تم استيراد ${imported.length} منافسة من CSV`
          : `${imported.length} tenders imported from CSV`,
      );
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsText(file, "utf-8");
  }

  const content =
    view === "overview" ? (
      <Overview
        tenders={activeTenders}
        archivedCount={archivedTenders.length}
        upcoming={upcoming}
        onOpen={(tender) => setSelectedId(tender.id)}
        onNavigate={navigate}
        onAdd={() => setShowAdd(true)}
        onScan={runMockScan}
        onImport={() => fileRef.current?.click()}
      />
    ) : view === "tenders" || view === "archive" ? (
      <Listing
        view={view}
        tenders={filteredTenders}
        categories={categories}
        query={query}
        category={category}
        status={status}
        fromDate={fromDate}
        toDate={toDate}
        setQuery={setQuery}
        setCategory={setCategory}
        setStatus={setStatus}
        setFromDate={setFromDate}
        setToDate={setToDate}
        onOpen={(tender) => setSelectedId(tender.id)}
        onAdd={() => setShowAdd(true)}
        onScan={runMockScan}
        onImport={() => fileRef.current?.click()}
      />
    ) : view === "deadlines" ? (
      <Deadlines
        tenders={upcoming}
        onOpen={(tender) => setSelectedId(tender.id)}
      />
    ) : (
      <Tasks
        tenders={tasks}
        onOpen={(tender) => setSelectedId(tender.id)}
        onNavigate={() => navigate("tenders")}
      />
    );

  return (
    <div className="app-shell" dir={language === "ar" ? "rtl" : "ltr"}>
      <Sidebar
        active={view}
        onNavigate={navigate}
        open={mobileNav}
        onClose={() => setMobileNav(false)}
      />
      <div className="app-main">
        <Topbar
          title={
            {
              overview: tr("نظرة عامة", "Overview"),
              tenders: tr("المنافسات الحكومية", "Government tenders"),
              deadlines: tr("المواعيد النهائية", "Deadlines"),
              tasks: tr("المهام والمتابعات", "Tasks & follow-ups"),
              archive: tr("أرشيف المنافسات", "Tender archive"),
            }[view]
          }
          subtitle={
            {
              overview: tr(
                "ملخص الفرص والمواعيد التي تحتاج انتباهك",
                "A summary of opportunities and deadlines needing attention",
              ),
              tenders: tr(
                "ابحث، راجع، وحوّل الفرص المناسبة إلى مهام",
                "Search, review, and turn suitable opportunities into tasks",
              ),
              deadlines: tr(
                "راقب المواعيد القادمة والتذكيرات النشطة",
                "Monitor upcoming deadlines and active reminders",
              ),
              tasks: tr(
                "الفرص التي حوّلتها إلى عمل قابل للتنفيذ",
                "Opportunities converted into actionable work",
              ),
              archive: tr(
                "ابحث في الفرص التاريخية حسب الكلمة أو التاريخ",
                "Search historical opportunities by keyword or date",
              ),
            }[view]
          }
          onMenu={() => setMobileNav(true)}
        />
        <main className="page-content">{content}</main>
      </div>
      <input
        ref={fileRef}
        className="sr-only"
        type="file"
        accept=".csv,text/csv"
        onChange={(event) => importCsv(event.target.files?.[0])}
      />
      {selected && (
        <TenderDetail
          tender={selected}
          onClose={() => setSelectedId(null)}
          onStatusChange={(next) => {
            patchTender(selected.id, {
              status: next,
              archivedAt:
                next === "archived" ? "2026-08-04" : selected.archivedAt,
            });
            notify(
              `${tr("تم تحديث الحالة إلى", "Status updated to")}: ${statusLabel(next, language)}`,
            );
          }}
          onCreateTask={() => {
            patchTender(selected.id, { taskCreated: true });
            notify(
              tr(
                "تم إنشاء متابعة مرتبطة بالمنافسة",
                "A linked follow-up was created",
              ),
            );
          }}
          onReminder={() => setShowReminder(true)}
        />
      )}
      {showAdd && (
        <AddTenderModal
          onClose={() => setShowAdd(false)}
          onAdd={(tender) => {
            setTenders((current) => [tender, ...current]);
            setShowAdd(false);
            notify(tr("تمت إضافة المنافسة يدوياً", "Tender added manually"));
          }}
        />
      )}
      {showReminder && selected && (
        <ReminderModal
          tender={selected}
          onClose={() => setShowReminder(false)}
          onSave={(date) => {
            patchTender(selected.id, { reminder: date });
            setShowReminder(false);
            notify(tr("تم حفظ التذكير بنجاح", "Reminder saved"));
          }}
        />
      )}
      {toast && (
        <div className="toast">
          <span>
            <Icon name="check" />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}

function Overview({
  tenders,
  archivedCount,
  upcoming,
  onOpen,
  onNavigate,
  onAdd,
  onScan,
  onImport,
}: {
  tenders: Tender[];
  archivedCount: number;
  upcoming: Tender[];
  onOpen: (t: Tender) => void;
  onNavigate: (v: ViewKey) => void;
  onAdd: () => void;
  onScan: () => void;
  onImport: () => void;
}) {
  const { tr } = useLanguage();
  const interested = tenders.filter(
    (tender) => tender.status === "interested",
  ).length;
  return (
    <>
      <section className="welcome-banner">
        <div className="banner-content">
          <span className="live-pill">
            <i />
            {tr("بيانات تجريبية جاهزة للعرض", "Sample data ready for demo")}
          </span>
          <h2>
            {tr("حوّل المنافسات الحكومية", "Turn government tenders")}
            <br />
            {tr("إلى فرص قابلة للتنفيذ", "into actionable opportunities")}
          </h2>
          <p>
            {tr(
              "مساحة موحدة للرصد، التحليل، الأرشفة والمتابعة — بهوية Spiders AI.",
              "One workspace for monitoring, analysis, archiving, and follow-up — by Spiders AI.",
            )}
          </p>
          <div className="banner-actions">
            <button className="light-button" onClick={onAdd}>
              <Icon name="plus" />
              {tr("إضافة منافسة", "Add tender")}
            </button>
            <button className="glass-button" onClick={onScan}>
              <Icon name="scan" />
              {tr("فحص تجريبي", "Sample scan")}
            </button>
          </div>
        </div>
        <div className="banner-web" aria-hidden="true">
          <span className="orb orb-one" />
          <span className="orb orb-two" />
          <svg viewBox="0 0 240 240">
            <g fill="none" stroke="currentColor">
              <path d="M120 4v232M4 120h232M38 38l164 164M202 38 38 202" />
              <path d="M120 35 180 60 205 120 180 180 120 205 60 180 35 120 60 60zM120 68l37 15 15 37-15 37-37 15-37-15-15-37 15-37zM120 96l17 7 7 17-7 17-17 7-17-7-7-17 7-17z" />
            </g>
          </svg>
        </div>
      </section>
      <div className="metrics-grid">
        <MetricCard
          label={tr("منافسات نشطة", "Active tenders")}
          value={tenders.length}
          hint={tr("سجلات قيد المتابعة", "Records being tracked")}
          icon="tenders"
          tone="blue"
        />
        <MetricCard
          label={tr("فرص واعدة", "Promising opportunities")}
          value={interested}
          hint={tr("درجة ملاءمة مرتفعة", "High-fit score")}
          icon="sparkles"
          tone="green"
        />
        <MetricCard
          label={tr("مواعيد قريبة", "Upcoming deadlines")}
          value={upcoming.filter((t) => deadlineDays(t.deadline) <= 7).length}
          hint={tr("خلال 7 أيام", "Within 7 days")}
          icon="calendar"
          tone="orange"
        />
        <MetricCard
          label={tr("في الأرشيف", "Archived")}
          value={archivedCount}
          hint={tr("قابلة للبحث والاسترجاع", "Searchable history")}
          icon="archive"
          tone="purple"
        />
      </div>
      <div className="dashboard-columns">
        <section className="panel recent-panel">
          <SectionHeader
            title={tr("أحدث المنافسات", "Latest tenders")}
            subtitle={tr(
              "آخر الفرص المضافة إلى المنصة",
              "Most recently added opportunities",
            )}
            action={
              <button
                className="text-button"
                onClick={() => onNavigate("tenders")}
              >
                {tr("عرض الكل", "View all")}
                <Icon name="chevron" />
              </button>
            }
          />
          <TenderTable tenders={tenders.slice(0, 4)} onOpen={onOpen} />
        </section>
        <aside className="panel quick-panel">
          <SectionHeader
            title={tr("إجراءات سريعة", "Quick actions")}
            subtitle={tr("ابدأ من هنا", "Start here")}
          />
          <button onClick={onAdd}>
            <span className="quick-icon blue">
              <Icon name="plus" />
            </span>
            <div>
              <strong>
                {tr("إضافة منافسة يدوياً", "Add tender manually")}
              </strong>
              <small>
                {tr("تسجيل فرصة جديدة", "Create a new opportunity")}
              </small>
            </div>
            <Icon name="chevron" />
          </button>
          <button onClick={onImport}>
            <span className="quick-icon green">
              <Icon name="upload" />
            </span>
            <div>
              <strong>{tr("استيراد ملف CSV", "Import CSV")}</strong>
              <small>
                {tr("رفع مجموعة منافسات", "Upload multiple tenders")}
              </small>
            </div>
            <Icon name="chevron" />
          </button>
          <button onClick={onScan}>
            <span className="quick-icon purple">
              <Icon name="scan" />
            </span>
            <div>
              <strong>{tr("تشغيل فحص تجريبي", "Run sample scan")}</strong>
              <small>
                {tr("محاكاة رصد مصدر جديد", "Simulate a new source scan")}
              </small>
            </div>
            <Icon name="chevron" />
          </button>
          <button onClick={() => onNavigate("archive")}>
            <span className="quick-icon orange">
              <Icon name="archive" />
            </span>
            <div>
              <strong>{tr("البحث في الأرشيف", "Search archive")}</strong>
              <small>
                {tr("استرجاع المنافسات السابقة", "Retrieve historical tenders")}
              </small>
            </div>
            <Icon name="chevron" />
          </button>
        </aside>
      </div>
    </>
  );
}

function Listing({
  view,
  tenders,
  categories,
  query,
  category,
  status,
  fromDate,
  toDate,
  setQuery,
  setCategory,
  setStatus,
  setFromDate,
  setToDate,
  onOpen,
  onAdd,
  onScan,
  onImport,
}: {
  view: ViewKey;
  tenders: Tender[];
  categories: string[];
  query: string;
  category: string;
  status: string;
  fromDate: string;
  toDate: string;
  setQuery: (v: string) => void;
  setCategory: (v: string) => void;
  setStatus: (v: string) => void;
  setFromDate: (v: string) => void;
  setToDate: (v: string) => void;
  onOpen: (t: Tender) => void;
  onAdd: () => void;
  onScan: () => void;
  onImport: () => void;
}) {
  const { language, tr } = useLanguage();
  const archive = view === "archive";
  return (
    <>
      <div className="page-actions">
        <div>
          <span className="result-count">{tenders.length}</span>
          <span>
            {archive
              ? tr("منافسة مؤرشفة مطابقة", "matching archived tenders")
              : tr("منافسة نشطة مطابقة", "matching active tenders")}
          </span>
        </div>
        <div>
          <button className="secondary-button" onClick={onImport}>
            <Icon name="upload" />
            {tr("استيراد CSV", "Import CSV")}
          </button>
          <button className="secondary-button" onClick={onScan}>
            <Icon name="scan" />
            {tr("فحص تجريبي", "Sample scan")}
          </button>
          <button className="primary-button" onClick={onAdd}>
            <Icon name="plus" />
            {tr("إضافة منافسة", "Add tender")}
          </button>
        </div>
      </div>
      <section className="panel filters-panel">
        <div className="search-field">
          <Icon name="search" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              archive
                ? tr(
                    "ابحث في العنوان، الجهة، الرقم أو الكلمات المفتاحية...",
                    "Search title, agency, reference, or keywords...",
                  )
                : tr(
                    "ابحث عن منافسة أو جهة...",
                    "Search for a tender or agency...",
                  )
            }
          />
        </div>
        <div className="filter-row">
          <label>
            <span>{tr("التصنيف", "Category")}</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="all">
                {tr("كل التصنيفات", "All categories")}
              </option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          {!archive && (
            <label>
              <span>{tr("الحالة", "Status")}</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="all">{tr("كل الحالات", "All statuses")}</option>
                {Object.keys(statusLabels)
                  .filter((key) => key !== "archived")
                  .map((key) => (
                    <option key={key} value={key}>
                      {statusLabel(key as Tender["status"], language)}
                    </option>
                  ))}
              </select>
            </label>
          )}
          <label>
            <span>{tr("من تاريخ النشر", "Published from")}</span>
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
            />
          </label>
          <label>
            <span>{tr("إلى تاريخ النشر", "Published to")}</span>
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
            />
          </label>
        </div>
      </section>
      <section className="panel list-panel">
        <SectionHeader
          title={
            archive
              ? tr("السجل التاريخي", "Historical records")
              : tr("قائمة المنافسات", "Tender list")
          }
          subtitle={
            archive
              ? tr(
                  "المنافسات المنتهية أو المحفوظة للرجوع إليها",
                  "Expired or saved tenders for future reference",
                )
              : tr(
                  "انقر على أي منافسة لعرض التفاصيل والتحليل",
                  "Open any tender to view details and analysis",
                )
          }
        />
        {tenders.length ? (
          <TenderTable tenders={tenders} onOpen={onOpen} />
        ) : (
          <EmptyState archived={archive} />
        )}
      </section>
    </>
  );
}

function Deadlines({
  tenders,
  onOpen,
}: {
  tenders: Tender[];
  onOpen: (t: Tender) => void;
}) {
  const { language, tr } = useLanguage();
  return (
    <>
      <div className="metrics-grid metrics-grid--three">
        <MetricCard
          label={tr("خلال 3 أيام", "Within 3 days")}
          value={tenders.filter((t) => deadlineDays(t.deadline) <= 3).length}
          hint={tr("تحتاج إجراءً عاجلاً", "Urgent action needed")}
          icon="bell"
          tone="red"
        />
        <MetricCard
          label={tr("خلال أسبوع", "Within a week")}
          value={tenders.filter((t) => deadlineDays(t.deadline) <= 7).length}
          hint={tr("جدولة المراجعة", "Schedule a review")}
          icon="calendar"
          tone="orange"
        />
        <MetricCard
          label={tr("تذكيرات نشطة", "Active reminders")}
          value={tenders.filter((t) => t.reminder).length}
          hint={tr("مرتبطة بمنافسات", "Linked to tenders")}
          icon="clock"
          tone="green"
        />
      </div>
      <section className="panel deadline-panel">
        <SectionHeader
          title={tr("الجدول الزمني القادم", "Upcoming timeline")}
          subtitle={tr(
            "مرتب حسب أقرب موعد نهائي",
            "Sorted by nearest deadline",
          )}
        />
        <div className="timeline">
          {tenders.map((tender) => (
            <button key={tender.id} onClick={() => onOpen(tender)}>
              <span
                className={`timeline-date ${deadlineDays(tender.deadline) <= 3 ? "urgent" : ""}`}
              >
                <strong>{new Date(tender.deadline).getDate()}</strong>
                <small>
                  {new Intl.DateTimeFormat(
                    language === "ar" ? "ar-SA" : "en-GB",
                    { month: "short", calendar: "gregory" },
                  ).format(new Date(tender.deadline))}
                </small>
              </span>
              <span className="timeline-line" />
              <div>
                <StatusBadge status={tender.status} />
                <h3>{tender.title}</h3>
                <p>{tender.agency}</p>
                <small>
                  <Icon name="clock" />
                  {deadlineLabel(tender.deadline, language)}
                  {tender.reminder &&
                    ` • ${tr("تذكير", "Reminder")} ${formatDate(tender.reminder, language)}`}
                </small>
              </div>
              <Icon name="chevron" />
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function Tasks({
  tenders,
  onOpen,
  onNavigate,
}: {
  tenders: Tender[];
  onOpen: (t: Tender) => void;
  onNavigate: () => void;
}) {
  const { language, tr } = useLanguage();
  return (
    <section className="panel tasks-panel">
      <SectionHeader
        title={tr("المتابعات المحوّلة", "Converted follow-ups")}
        subtitle={tr(
          "كل متابعة مرتبطة بسجل المنافسة الأصلي",
          "Every follow-up links to its source tender",
        )}
      />
      {tenders.length ? (
        <div className="task-grid">
          {tenders.map((tender) => (
            <button key={tender.id} onClick={() => onOpen(tender)}>
              <div className="task-card-top">
                <span>
                  <Icon name="tasks" />
                </span>
                <StatusBadge status={tender.status} />
              </div>
              <h3>{tender.title}</h3>
              <p>{tender.agency}</p>
              <div className="task-meta">
                <span>
                  <Icon name="calendar" />
                  {tr("التسليم", "Due")} {formatDate(tender.deadline, language)}
                </span>
                <span className="priority">
                  {tr("أولوية", "Priority")}{" "}
                  {tender.score >= 85
                    ? tr("عالية", "high")
                    : tr("متوسطة", "medium")}
                </span>
              </div>
              <div className="task-progress">
                <span
                  style={{
                    width: tender.status === "submitted" ? "100%" : "45%",
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span>
            <Icon name="tasks" />
          </span>
          <h3>{tr("لا توجد متابعات بعد", "No follow-ups yet")}</h3>
          <p>
            {tr(
              "افتح منافسة مناسبة وحوّلها إلى متابعة.",
              "Open a suitable tender and convert it to a follow-up.",
            )}
          </p>
          <button className="primary-button" onClick={onNavigate}>
            {tr("استعراض المنافسات", "Browse tenders")}
          </button>
        </div>
      )}
    </section>
  );
}

function AddTenderModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (tender: Tender) => void;
}) {
  const { tr } = useLanguage();
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onAdd({
      id: `manual-${Date.now()}`,
      reference: String(data.get("reference")),
      title: String(data.get("title")),
      agency: String(data.get("agency")),
      category: String(data.get("category")),
      region: String(data.get("region")),
      publishDate: String(data.get("publishDate")),
      deadline: String(data.get("deadline")),
      status: "new",
      score: 70,
      value: String(data.get("value") || "غير محدد"),
      purpose: String(data.get("purpose")),
      requirements: ["تحتاج إلى مراجعة الفريق"],
      summary: "سيظهر الملخص التجريبي بعد مراجعة بيانات المنافسة.",
      recommendation: "إكمال البيانات والوثائق ثم بدء التقييم.",
      documents: [],
    });
  }
  return (
    <Modal
      title={tr("إضافة منافسة يدوياً", "Add tender manually")}
      onClose={onClose}
    >
      <form className="form-grid" onSubmit={submit}>
        <label className="span-2">
          {tr("عنوان المنافسة", "Tender title")}
          <input
            required
            name="title"
            placeholder={tr(
              "مثال: تطوير منصة الخدمات الرقمية",
              "Example: Digital services platform development",
            )}
          />
        </label>
        <label>
          {tr("الجهة الحكومية", "Government agency")}
          <input
            required
            name="agency"
            placeholder={tr("اسم الجهة", "Agency name")}
          />
        </label>
        <label>
          {tr("الرقم المرجعي", "Reference number")}
          <input required name="reference" placeholder="2026/0000" />
        </label>
        <label>
          {tr("التصنيف", "Category")}
          <select name="category">
            <option>{tr("تقنية المعلومات", "Information Technology")}</option>
            <option>{tr("البيانات والذكاء الاصطناعي", "Data and AI")}</option>
            <option>{tr("الأمن السيبراني", "Cybersecurity")}</option>
            <option>{tr("تطوير البرمجيات", "Software Development")}</option>
          </select>
        </label>
        <label>
          {tr("المنطقة", "Region")}
          <input required name="region" defaultValue={tr("الرياض", "Riyadh")} />
        </label>
        <label>
          {tr("تاريخ النشر", "Publish date")}
          <input
            required
            name="publishDate"
            type="date"
            defaultValue="2026-08-04"
          />
        </label>
        <label>
          {tr("آخر موعد", "Deadline")}
          <input
            required
            name="deadline"
            type="date"
            defaultValue="2026-08-30"
          />
        </label>
        <label className="span-2">
          {tr("القيمة التقديرية", "Estimated value")}
          <input
            name="value"
            placeholder={tr("مثال: 1,500,000 ر.س", "Example: SAR 1,500,000")}
          />
        </label>
        <label className="span-2">
          {tr("وصف مختصر", "Short description")}
          <textarea required name="purpose" rows={3} />
        </label>
        <div className="form-actions span-2">
          <button type="button" className="secondary-button" onClick={onClose}>
            {tr("إلغاء", "Cancel")}
          </button>
          <button className="primary-button" type="submit">
            <Icon name="plus" />
            {tr("حفظ المنافسة", "Save tender")}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ReminderModal({
  tender,
  onClose,
  onSave,
}: {
  tender: Tender;
  onClose: () => void;
  onSave: (date: string) => void;
}) {
  const { tr } = useLanguage();
  const [date, setDate] = useState(tender.reminder || tender.deadline);
  return (
    <Modal title={tr("ضبط تذكير", "Set reminder")} onClose={onClose}>
      <div className="reminder-form">
        <p>
          {tr("اختر موعد التذكير الخاص بمنافسة", "Choose a reminder date for")}{" "}
          <strong>{tender.title}</strong>.
        </p>
        <label>
          {tr("تاريخ التذكير", "Reminder date")}
          <input
            type="date"
            value={date}
            max={tender.deadline}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <div className="form-actions">
          <button className="secondary-button" onClick={onClose}>
            {tr("إلغاء", "Cancel")}
          </button>
          <button className="primary-button" onClick={() => onSave(date)}>
            <Icon name="bell" />
            {tr("حفظ التذكير", "Save reminder")}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function deadlineDays(date: string) {
  return Math.ceil(
    (new Date(`${date}T12:00:00`).getTime() -
      new Date("2026-08-04T12:00:00").getTime()) /
      86400000,
  );
}
