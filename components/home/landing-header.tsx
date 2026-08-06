"use client";

import Link from "next/link";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import {
  LanguageToggle,
  useLanguage,
} from "@/app/components/language-provider";
import { BrandLockup } from "@/components/brand/spiders-brand";

export function LandingHeader() {
  const { tr } = useLanguage();
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <nav className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
      <Link href="/" aria-label="Spiders AI home">
        <BrandLockup
          tagline={tr("طريقتك الجديدة للعمل", "Your new way of working")}
          compact
        />
      </Link>
      <div className="flex items-center gap-2">
        <LanguageToggle />
        {isLoaded && isSignedIn ? (
          <>
            <SignOutButton redirectUrl="/">
              <button className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-indigo-800 transition hover:bg-white/80 sm:block">
                {tr("تسجيل الخروج", "Sign out")}
              </button>
            </SignOutButton>
            <Link
              href="/dashboard"
              className="rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-800"
            >
              {tr("لوحة التحكم", "Dashboard")}
            </Link>
          </>
        ) : isLoaded ? (
          <>
            <Link
              href="/sign-in"
              className="rounded-xl px-3 py-2.5 text-sm font-bold text-indigo-800 transition hover:bg-white/80 sm:px-4"
            >
              {tr("تسجيل الدخول", "Login")}
            </Link>
            <Link
              href="/sign-up"
              className="rounded-xl bg-indigo-700 px-3 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-800 sm:px-4"
            >
              {tr("إنشاء حساب", "Sign up")}
            </Link>
          </>
        ) : null}
      </div>
    </nav>
  );
}
