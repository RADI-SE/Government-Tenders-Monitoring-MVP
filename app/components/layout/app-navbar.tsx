"use client";

import { Bell, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function AppNavbar() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <input
          placeholder="ابحث عن منافسة..."
          className="pl-9"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <button className="rounded-md p-2 hover:bg-muted">
          <Bell className="h-5 w-5" />
        </button>

        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  );
}