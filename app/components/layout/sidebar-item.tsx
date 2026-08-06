"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "../language-provider";
import { cn } from "@/lib/utils";

export function SidebarItem({
  ar,
  en,
  href,
  icon: Icon,
}: {
  ar: string;
  en: string;
  href: string;
  icon: LucideIcon;
}) {
  const pathname = usePathname();
  const { tr } = useLanguage();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-3 transition-all",
        active
          ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
      )}
    >
      <Icon className="h-5 w-5" />
      <strong className="text-sm">{tr(ar, en)}</strong>
    </Link>
  );
}
