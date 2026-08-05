// app/utils/date.ts
export function formatDate(date: string | null | undefined, language: "ar" | "en" = "ar") {
  if (!date) return "-";
  try {
    return new Intl.DateTimeFormat(language === "ar" ? "ar-SA" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

export function deadlineLabel(date: string | null | undefined, language: "ar" | "en" = "ar") {
  if (!date) return "-";
  const now = new Date();
  const deadline = new Date(date);
  const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (language === "en") {
    if (diffDays < 0) return "Deadline passed";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  } else {
    if (diffDays < 0) return "انتهى الموعد";
    if (diffDays === 0) return "اليوم";
    if (diffDays === 1) return "متبقي يوم واحد";
    if (diffDays <= 10) return `متبقي ${diffDays} أيام`;
    return `متبقي ${diffDays} يوماً`;
  }
}