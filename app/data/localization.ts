import type { Language } from "../components/language-provider";
import type { Tender, TenderStatus } from "../types";

const englishTenderCopy: Record<string, Partial<Tender>> = {
  "t-1042": {
    title: "Development and operation of the unified digital services platform",
    agency: "Ministry of Human Resources and Social Development",
    category: "Information Technology",
    region: "Riyadh",
    purpose:
      "Develop a unified digital platform, improve beneficiary experience, and integrate internal services.",
    requirements: [
      "Government platform experience",
      "Saudi-based support team",
      "Business continuity plan",
    ],
    summary:
      "A high-fit opportunity requiring cloud platform development, government integrations, and 24 months of operational support.",
    recommendation: "Proceed and form an initial technical team this week.",
    documents: [
      { name: "Terms and specifications.pdf", size: "4.8 MB" },
      { name: "Bill of quantities.xlsx", size: "860 KB" },
    ],
  },
  "t-1038": {
    title: "Managed cybersecurity services",
    agency: "Digital Government Authority",
    category: "Cybersecurity",
    region: "Riyadh",
    purpose:
      "Raise cybersecurity maturity and operate a 24/7 monitoring center.",
    requirements: [
      "Cybersecurity provider certification",
      "Local operations center",
      "Monthly reports",
    ],
    summary:
      "The tender fits the cybersecurity practice, with a local SOC and strict service-level requirements.",
    recommendation: "Review the certification requirement before proceeding.",
    documents: [{ name: "Scope of work.pdf", size: "3.2 MB" }],
  },
  "t-1031": {
    title: "Supply and installation of data center infrastructure",
    agency: "King Saud University",
    category: "Infrastructure",
    region: "Riyadh",
    purpose:
      "Modernize the main data center servers and networks and improve reliability.",
    requirements: [
      "Certified manufacturer partner",
      "Three-year warranty",
      "Delivery within 90 days",
    ],
    summary:
      "A medium-fit technology supply opportunity dependent on partner certification and delivery capacity.",
    recommendation: "Confirm partnerships and pricing before proceeding.",
    documents: [{ name: "Technical specifications.pdf", size: "6.1 MB" }],
  },
  "t-0996": {
    title: "Enterprise data warehouse and business intelligence platform",
    agency: "Ministry of Tourism",
    category: "Data and AI",
    region: "Riyadh",
    purpose:
      "Unify data sources and launch executive dashboards for the tourism sector.",
    requirements: [
      "Data warehouse experience",
      "Predictive models",
      "Knowledge transfer",
    ],
    summary:
      "A high-fit historical tender for an integrated data platform with predictive models and executive dashboards.",
    recommendation: "Keep as a reference for similar future opportunities.",
    documents: [{ name: "Project requirements.pdf", size: "8.3 MB" }],
  },
  "t-0971": {
    title: "Branch network operations and maintenance",
    agency: "General Organization for Social Insurance",
    category: "Operations and Maintenance",
    region: "Multiple regions",
    purpose: "Operate and maintain branch networks and provide field support.",
    requirements: ["Field teams", "24/7 support", "Two-hour response time"],
    summary:
      "A broad operational scope requiring field coverage beyond currently available resources.",
    recommendation:
      "Do not bid independently; consider a field-services partner.",
    documents: [{ name: "Conditions.pdf", size: "2.7 MB" }],
  },
  "t-0944": {
    title: "Development of the electronic supplier portal",
    agency: "Jeddah Municipality",
    category: "Software Development",
    region: "Makkah",
    purpose:
      "Digitize supplier registration and qualification and integrate the portal with internal systems.",
    requirements: [
      "Arabic user experience",
      "API integration",
      "User training",
    ],
    summary:
      "A clearly scoped development project combining user experience and internal system integration.",
    recommendation: "Keep as a commercial and technical reference.",
    documents: [{ name: "Portal requirements.pdf", size: "5.4 MB" }],
  },
  "t-scan-1": {
    title: "Open data platform operations and enhancement",
    agency: "Saudi Data and AI Authority",
    category: "Data and AI",
    region: "Riyadh",
    purpose:
      "Operate and develop the open data platform and improve published data quality.",
    requirements: [
      "Data governance experience",
      "Local operations team",
      "Quality dashboards",
    ],
    summary:
      "A recent high-fit data-platform opportunity with clear governance and quality requirements.",
    recommendation: "Start the technical review.",
    documents: [{ name: "Sample scope of work.pdf", size: "3.9 MB" }],
  },
};

export function localizeTender(tender: Tender, language: Language): Tender {
  return language === "en" && englishTenderCopy[tender.id]
    ? { ...tender, ...englishTenderCopy[tender.id] }
    : tender;
}

export function statusLabel(status: TenderStatus, language: Language) {
  const labels: Record<TenderStatus, [string, string]> = {
    new: ["جديدة", "New"],
    reviewing: ["قيد المراجعة", "Reviewing"],
    interested: ["مهتمون", "Interested"],
    "not-suitable": ["غير مناسبة", "Not suitable"],
    submitted: ["تم التقديم", "Submitted"],
    archived: ["مؤرشفة", "Archived"],
  };
  return labels[status][language === "ar" ? 0 : 1];
}
