import type { Tender, TenderStatus } from "../types";
import { statusLabel } from "../data/localization";
import { Icon } from "./icons";
import { Modal, ScoreRing, StatusBadge, formatDate } from "./dashboard-ui";
import { useLanguage } from "./language-provider";

export function TenderDetail({
  tender,
  onClose,
  onStatusChange,
  onCreateTask,
  onReminder,
}: {
  tender: Tender;
  onClose: () => void;
  onStatusChange: (status: TenderStatus) => void;
  onCreateTask: () => void;
  onReminder: () => void;
}) {
  const { language, tr } = useLanguage();
  const statuses: TenderStatus[] = [
    "new",
    "reviewing",
    "interested",
    "not-suitable",
    "submitted",
    "archived",
  ];
  return (
    <Modal title={tender.title} onClose={onClose} wide>
      <div className="detail-topline">
        <span>
          {tr("رقم المرجع", "Reference")} {tender.reference}
        </span>
        <StatusBadge status={tender.status} />
      </div>
      <div className="detail-grid">
        <div className="detail-main">
          <section className="detail-section">
            <h3>{tr("نظرة عامة", "Overview")}</h3>
            <p>{tender.purpose}</p>
            <div className="detail-facts">
              <Fact label={tr("الجهة", "Agency")} value={tender.agency} />
              <Fact label={tr("التصنيف", "Category")} value={tender.category} />
              <Fact label={tr("المنطقة", "Region")} value={tender.region} />
              <Fact
                label={tr("القيمة التقديرية", "Estimated value")}
                value={tender.value}
              />
              <Fact
                label={tr("تاريخ النشر", "Published")}
                value={formatDate(tender.publishDate, language)}
              />
              <Fact
                label={tr("آخر موعد", "Deadline")}
                value={formatDate(tender.deadline, language)}
              />
            </div>
          </section>
          <section className="ai-panel">
            <div className="ai-panel-title">
              <span>
                <Icon name="sparkles" />
              </span>
              <div>
                <h3>{tr("تحليل الذكاء الاصطناعي", "AI analysis")}</h3>
                <small>
                  {tr(
                    "تحليل تجريبي مبني على بيانات العينة",
                    "Sample analysis based on mock data",
                  )}
                </small>
              </div>
            </div>
            <div className="ai-content">
              <div>
                <h4>{tr("الملخص الذكي", "AI summary")}</h4>
                <p>{tender.summary}</p>
                <h4>{tr("المتطلبات الرئيسية", "Key requirements")}</h4>
                <ul>
                  {tender.requirements.map((item) => (
                    <li key={item}>
                      <Icon name="check" />
                      {item}
                    </li>
                  ))}
                </ul>
                <h4>{tr("التوصية", "Recommendation")}</h4>
                <p className="recommendation">{tender.recommendation}</p>
              </div>
              <ScoreRing score={tender.score} />
            </div>
          </section>
          <section className="detail-section">
            <h3>{tr("الوثائق المرفقة", "Attachments")}</h3>
            <div className="document-list">
              {tender.documents.map((doc) => (
                <button key={doc.name}>
                  <span>
                    <Icon name="file" />
                  </span>
                  <div>
                    <strong>{doc.name}</strong>
                    <small>{doc.size}</small>
                  </div>
                  <Icon name="external" />
                </button>
              ))}
            </div>
          </section>
        </div>
        <aside className="detail-aside">
          <h3>{tr("إجراءات المنافسة", "Tender actions")}</h3>
          <label className="field-label">
            {tr("تحديث الحالة", "Update status")}
            <select
              value={tender.status}
              onChange={(event) =>
                onStatusChange(event.target.value as TenderStatus)
              }
            >
              {statuses.map((item) => (
                <option value={item} key={item}>
                  {statusLabel(item, language)}
                </option>
              ))}
            </select>
          </label>
          <button
            className="primary-button full"
            onClick={onCreateTask}
            disabled={tender.taskCreated}
          >
            <Icon name={tender.taskCreated ? "check" : "tasks"} />
            {tender.taskCreated
              ? tr("تم إنشاء المتابعة", "Follow-up created")
              : tr("تحويل إلى متابعة", "Convert to follow-up")}
          </button>
          <button className="secondary-button full" onClick={onReminder}>
            <Icon name="bell" />
            {tender.reminder
              ? tr("تحديث التذكير", "Update reminder")
              : tr("إضافة تذكير", "Add reminder")}
          </button>
          {tender.reminder && (
            <div className="reminder-note">
              <Icon name="clock" />
              <div>
                <strong>{tr("تذكير نشط", "Active reminder")}</strong>
                <span>{formatDate(tender.reminder, language)}</span>
              </div>
            </div>
          )}
          <div className="honesty-note">
            <strong>{tr("بيانات تجريبية", "Sample data")}</strong>
            <p>
              {tr(
                "هذه المنافسة والتحليل مخصّصان لعرض الـ MVP وليسا نتيجة رصد حي.",
                "This tender and analysis are for the MVP demo and are not live monitoring results.",
              )}
            </p>
          </div>
        </aside>
      </div>
    </Modal>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
