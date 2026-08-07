import { query } from "./_generated/server";
import { v } from "convex/values";

export const searchTenders = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        if (!args.query) return [];
        return await ctx.db
            .query("tenders")
            .withSearchIndex("by_tender_name", (q) => q.search("tender_name", args.query))
            .collect();
    },
});

export const getAllRegions = query({
    handler: async (ctx) => await ctx.db.query("regions").collect(),
});
export const getAllAgencies = query({
    handler: async (ctx) => await ctx.db.query("agencies").collect(),
});
export const getAllActivities = query({
    handler: async (ctx) => await ctx.db.query("activities").collect(),
});
export const getAllStatuses = query({
    handler: async (ctx) => await ctx.db.query("statuses").collect(),
});
 

export const getTendersByAgency = query({
    args: { agencyId: v.number() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("tenders")
            .withIndex("by_agency_id", (q) => q.eq("agency_id", args.agencyId))
            .collect();
    },
});

export const getTendersByRegion = query({
    args: { regionId: v.number() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("tenders")
            .withIndex("by_region_id", (q) => q.eq("region_id", args.regionId))
            .collect();
    },
});

export const getTendersByActivity = query({
    args: { activityId: v.number() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("tenders")
            .withIndex("by_activity_ids", (q) => q.eq("activity_ids", args.activityId as any))
            .collect();
    },
});

export const getTendersByAgencyAndStatus = query({
    args: { agencyId: v.number(), status: v.string() },
    handler: async (ctx, args) => {
        const tenders = await ctx.db
            .query("tenders")
            .withIndex("by_agency_id", (q) => q.eq("agency_id", args.agencyId))
            .collect();
        return tenders.filter((t) => t.original_status === args.status);
    },
});