"use client";
import { SidebarItem } from "./sidebar-item";
import { sidebarRoutes } from "./sidebar-routes";

export function AppSidebar() {
  return (
    <aside className="hidden h-screen w-72 border-l bg-background lg:flex lg:flex-col">
      {/* Logo */}
      <div className="border-b p-6">
        <h2 className="text-xl font-bold">
          Government Tenders
        </h2>

        <p className="text-sm text-muted-foreground">
          منصة المنافسات الحكومية
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2 p-4">
        {sidebarRoutes.map((route) => (
          <SidebarItem key={route.href} {...route} />
        ))}
      </nav>
    </aside>
  );
}