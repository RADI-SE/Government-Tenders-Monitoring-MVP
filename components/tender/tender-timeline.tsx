"use client";

interface TenderTimelineProps {
  tender: any;
}

export function TenderTimeline({
  tender,
}: TenderTimelineProps) {
  const raw = tender.raw_data;

  const items = [
    ["تاريخ الإضافة", raw.created_at],
    ["آخر موعد للاستفسارات", raw.last_enquiry_date],
    ["آخر موعد للتقديم", raw.last_submission_date],
    ["فتح العروض", raw.opening_date],
    ["الترسية المتوقعة", raw.expected_award_date],
  ];

  return (
    <div className="space-y-4">
      {items.map(([title, date]) => (
        <div
          key={title}
          className="rounded-xl border p-4"
        >
          <h3 className="font-semibold">
            {title}
          </h3>

          <p className="mt-2 text-muted-foreground">
            {date
              ? new Date(date).toLocaleDateString("ar-SA")
              : "-"}
          </p>
        </div>
      ))}
    </div>
  );
}