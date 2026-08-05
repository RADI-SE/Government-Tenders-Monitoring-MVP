import { Archive, FileText, History, LayoutDashboard, ListTodo } from "lucide-react";

export const sidebarRoutes = [
  { ar: "الرئيسية", en: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { ar: "المنافسات", en: "Competitions", href: "/dashboard/competitions", icon: FileText },
  { ar: "سير العمل", en: "Workflow", href: "/dashboard/tasks", icon: ListTodo },
  { ar: "سجل الاستيراد", en: "Data imports", href: "/dashboard/imports", icon: History },
  { ar: "الأرشيف", en: "Archive", href: "/dashboard/archive", icon: Archive },
];
