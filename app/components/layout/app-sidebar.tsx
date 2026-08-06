"use client";

import { Sparkles } from "lucide-react";
import { BrandLockup, WebPattern } from "@/components/brand/spiders-brand";
import { useLanguage } from "../language-provider";
import { SidebarItem } from "./sidebar-item";
import { sidebarRoutes } from "./sidebar-routes";

export function AppSidebar() {
  const { tr } = useLanguage();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-e border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="border-b border-slate-100 p-5">
        <BrandLockup
          tagline={tr("طريقتك الجديدة للعمل", "Your new way of working")}
          compact
        />
      </div>
      <div className="px-5 pt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {tr("القائمة الرئيسية", "Main menu")}
      </div>
      <nav className="flex flex-1 flex-col gap-2 p-4">
        {sidebarRoutes.map((route) => (
          <SidebarItem key={route.href} {...route} />
        ))}
      </nav>
      <div className="relative m-4 overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#152269,#3155ef_65%,#2fbfd0)] p-4 text-white shadow-lg shadow-indigo-100">
        <WebPattern className="absolute -right-16 -top-20 h-44 w-44 text-white/10" />
        <Sparkles className="relative mb-3 h-5 w-5 text-emerald-300" />
        <strong className="relative text-xs">
          {tr("مراقب المنافسات الذكي", "AI Tender Monitor")}
        </strong>
        <p className="relative mt-1 text-[10px] leading-5 text-indigo-100">
          {tr(
            "بيانات المنصة متصلة وجاهزة للتحليل.",
            "Platform data is connected and ready for analysis.",
          )}
        </p>
      </div>
    </aside>
  );
}
