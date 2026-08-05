import type { ReactNode } from "react";
import { AppSidebar } from "../components/layout/app-sidebar";
import { AppNavbar } from "../components/layout/app-navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar />
      <div className="min-w-0 flex-1"><AppNavbar /><main>{children}</main></div>
    </div>
  );
}
