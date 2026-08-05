import {
  LayoutDashboard,
  FileText,
  Bell,
} from "lucide-react";

export const sidebarRoutes = [
  {
    title: "Main Menu",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Competitions",
    href: "/dashboard/competitions",
    icon: FileText,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
];