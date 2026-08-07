import { query } from "./_generated/server";
import { v } from "convex/values";
export const getArchivedTenders = query({
  args: {
    search: v.optional(v.string()),
    searchUntil: v.optional(v.string()),
    regionId: v.optional(v.string()),
    agencyId: v.optional(v.string()),
    activityId: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let filtered = await ctx.db.query("archivedTenders").collect();
 
    if (args.search?.trim()) {
      const term = args.search.toLowerCase().trim();
      filtered = filtered.filter(t =>
        t.tender_name?.toLowerCase().includes(term) ||
        t.reference_number?.toLowerCase().includes(term) ||
        t.description?.toLowerCase().includes(term)
      );
    }
 
    if (args.searchUntil) {
      const input = args.searchUntil.trim();
      let startDate: Date, endDate: Date;
      const isMonthOnly = /^\d{4}-\d{2}$/.test(input);
      if (isMonthOnly) {
        const [year, month] = input.split("-").map(Number);
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
      filtered = filtered.filter(t => {
        if (!t.last_submission_date) return false;
        const d = new Date(t.last_submission_date);
        return !isNaN(d.getTime()) && d >= startDate && d <= endDate;
      });
    }

    if (args.regionId) {
      const regionIdNum = Number(args.regionId);
      filtered = filtered.filter(t => t.region_id === regionIdNum);
    }

    if (args.agencyId) {
      const agencyIdNum = Number(args.agencyId);
      filtered = filtered.filter(t => t.agency_id === agencyIdNum);
    }

    if (args.activityId) {
      const activityIdNum = Number(args.activityId);
      filtered = filtered.filter(t =>
        t.activity_ids && t.activity_ids.includes(activityIdNum)
      );
    }

    if (args.status) {
      filtered = filtered.filter(t => t.original_status === args.status);
    }

    // sort by archived date (newest first)
    filtered.sort((a, b) => b.archivedAt - a.archivedAt);
    return filtered;
  },
});

export const getArchivedTenderById = query({
  args: { id: v.number() },
  handler: async (ctx, args) => {
    
    const all = await ctx.db.query("archivedTenders").collect();
  
    return all.find((t) => t.id === args.id);
  },
});