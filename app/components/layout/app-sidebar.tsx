"use client";

import { Sparkles } from "lucide-react";
import { useLanguage } from "../language-provider";
import { SidebarItem } from "./sidebar-item";
import { sidebarRoutes } from "./sidebar-routes";

export function AppSidebar() {
  const { tr } = useLanguage();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-e border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex items-center gap-3 border-b border-slate-100 p-5"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 via-cyan-400 to-indigo-600 text-xl text-white shadow-lg shadow-indigo-100">✦</div><div><h2 className="font-bold tracking-tight text-indigo-950">Spiders AI</h2><p className="text-[10px] font-medium text-slate-400">{tr("طريقتك الجديدة للعمل", "Your new way of working")}</p></div></div>
      <div className="px-5 pt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{tr("القائمة الرئيسية", "Main menu")}</div>
      <nav className="flex flex-1 flex-col gap-2 p-4">{sidebarRoutes.map((route) => <SidebarItem key={route.href} {...route} />)}</nav>
      <div className="m-4 rounded-2xl bg-gradient-to-br from-indigo-950 to-indigo-700 p-4 text-white shadow-lg shadow-indigo-100"><Sparkles className="mb-3 h-5 w-5 text-emerald-300" /><strong className="text-xs">{tr("مراقب المنافسات الذكي", "AI Tender Monitor")}</strong><p className="mt-1 text-[10px] leading-5 text-indigo-200">{tr("بيانات المنصة متصلة وجاهزة للتحليل.", "Platform data is connected and ready for analysis.")}</p></div>
    </aside>
  );
}
