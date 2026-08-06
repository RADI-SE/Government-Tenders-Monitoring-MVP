export type TenderStatus =
  | "new"
  | "reviewing"
  | "interested"
  | "not-suitable"
  | "submitted"
  | "archived";

export type Tender = {
  id: string;
  reference: string;
  title: string;
  agency: string;
  category: string;
  region: string;
  publishDate: string;
  deadline: string;
  status: TenderStatus;
  score: number;
  value: string;
  purpose: string;
  requirements: string[];
  summary: string;
  recommendation: string;
  documents: { name: string; size: string }[];
  archivedAt?: string;
  reminder?: string;
  taskCreated?: boolean;
};

export type ViewKey =
  "overview" | "tenders" | "deadlines" | "tasks" | "archive";
