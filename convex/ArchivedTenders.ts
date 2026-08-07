import { query } from "./_generated/server";
import { v } from "convex/values";

export const getArchivedTenders = query({
  args: {
    // Accepts either a full date (YYYY-MM-DD) or a month (YYYY-MM)
    searchUntil: v.optional(v.string()),
    search: v.optional(v.string()),

  },

  handler: async (ctx, args) => {
    // 1. Fetch all archived tenders
    let filtered = await ctx.db.query("archivedTenders").collect();

    console.log("first filtered", filtered);

    // 2. Text search on tender_name, reference_number, description
    if (args.search?.trim()) {
      const search = args.search.toLowerCase().trim();
      filtered = filtered.filter(
        (t) =>
          t.tender_name?.toLowerCase().includes(search) ||
          t.reference_number?.toLowerCase().includes(search) ||
          t.description?.toLowerCase().includes(search)
      );
    }

    // 3. Filter by last_submission_date using a 3‑month window
    if (args.searchUntil) {
      const input = args.searchUntil.trim();
      let startDate: Date;
      let endDate: Date;

      // Determine if input is a month-only (YYYY-MM) or a full date
      const isMonthOnly = /^\d{4}-\d{2}$/.test(input);

      if (isMonthOnly) {
        // Example: "2026-06" → June 2026
        const [year, month] = input.split("-").map(Number);
        // First day of the selected month
        const firstOfSelected = new Date(year, month - 1, 1);
        // Last day of the selected month (month index is 0-based, so we use month as the next month index and 0 for last day)
        endDate = new Date(year, month, 0);
        endDate.setHours(23, 59, 59, 999);
 
        startDate = new Date(year, month - 3, 1);
        startDate.setHours(0, 0, 0, 0);
      } else { 
        endDate = new Date(input);
        endDate.setHours(23, 59, 59, 999);

        startDate = new Date(input);
        startDate.setMonth(startDate.getMonth() - 3);
        startDate.setHours(0, 0, 0, 0);
      }
 
      filtered = filtered.filter((t) => {
        if (!t.last_submission_date) return false;
        const tenderDate = new Date(t.last_submission_date);
        if (isNaN(tenderDate.getTime())) {
          console.warn("Invalid date:", t.last_submission_date);
          return false;
        }
        return tenderDate >= startDate && tenderDate <= endDate;
      });
    }
 
    filtered.sort((a, b) => b.archivedAt - a.archivedAt);

    console.log(`Filtered results: ${filtered.length}`);
    return filtered;
  },
});

export const getDistinctStatuses = query({
  handler: async (ctx) => {
    const tenders = await ctx.db.query("archivedTenders").collect();
    // Extract unique, non‑null original_status
    const statusSet = new Set<string>();
    tenders.forEach((t) => {
      if (t.original_status) statusSet.add(t.original_status);
    });
    // Sort alphabetically for consistent ordering
    return Array.from(statusSet).sort();
  },
});