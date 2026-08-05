import { ReactNode } from "react";
import { AppSidebar } from "../components/layout/app-sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <AppSidebar />

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}