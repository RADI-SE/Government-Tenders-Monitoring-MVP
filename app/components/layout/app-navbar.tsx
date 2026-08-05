"use client";

import Link from "next/link";
import { Bell, CircleHelp } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { LanguageToggle, useLanguage } from "../language-provider";

export function AppNavbar() {
  const { isLoaded, isSignedIn } = useAuth();
  const { tr } = useLanguage();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8">
      <strong className="text-sm text-slate-900">{tr("منصة متابعة المنافسات", "Government Tender Monitoring")}</strong>
      <div className="flex items-center gap-2">
        <LanguageToggle />
        <button aria-label={tr("المساعدة", "Help")} className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"><CircleHelp className="h-4 w-4" /></button>
        <Link href="/dashboard/notifications" aria-label={tr("الإشعارات", "Notifications")} className="relative grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"><Bell className="h-4 w-4" /><span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" /></Link>
        {isLoaded && !isSignedIn ? <><Link href="/sign-in" className="rounded-xl px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50">{tr("دخول", "Login")}</Link><Link href="/sign-up" className="rounded-xl bg-indigo-700 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-800">{tr("إنشاء حساب", "Sign up")}</Link></> : null}
        {isLoaded && isSignedIn ? <div className="border-s border-slate-200 ps-3"><UserButton /></div> : null}
      </div>
    </header>
  );
}
