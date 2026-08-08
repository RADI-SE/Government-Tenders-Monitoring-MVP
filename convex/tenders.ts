import { mutation , query } from "./_generated/server";
import { v } from "convex/values";


export const getTenderById = query({
  args: { id: v.number() },
  handler: async (ctx, args) => {
    
    const all = await ctx.db.query("tenders").collect();
  
    return all.find((t) => t.id === args.id);
  },
});


export const getActiveTenders = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("tenders")
      .filter((q) =>
        q.or(
          q.eq(q.field("favorite"), false),
          q.eq(q.field("favorite"), undefined)
        )
      )
      .collect();
  },
});

export const archiveTender = mutation({
  args: {
    tenderId: v.id("tenders"),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.tenderId, {
      favorite: true,
      favoritedAt: Date.now(),
    });

    return {
      success: true,
    };
  },
});


export const restoreTender = mutation({
  args: {
    tenderId: v.id("tenders"),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.tenderId, {
      favorite: false,
    });

    return {
      success: true,
    };
  },
});

export const getArchivedTenders = query({
  handler: async (ctx) => {
    return await ctx.db.query("archivedTenders").collect();
  },
});

export const cleanupExpiredTenders = mutation({
  handler: async (ctx) => {
    const tenders = await ctx.db.query("tenders").collect();

    const finalStatuses = [
      "تم اعتماد الترسية",
      "تم الإلغاء",
      "تم رفض الترسية",
    ];

    for (const tender of tenders) {
      const expired =
        tender.last_submission_date &&
        new Date(tender.last_submission_date) < new Date();

      const finished = finalStatuses.includes(
        tender.original_status ?? ""
      );

      if (!expired && !finished) continue;

      const { _id, _creationTime, ...data } = tender;

      await ctx.db.insert("archivedTenders", {
        ...data,
        archived: true,
        archive_reason: expired ? "expired" : "completed",
        archivedAt: Date.now(),
      });

      await ctx.db.delete(_id);
    }
  },
});



export const searchActiveTenders = query({
  args: {
    search: v.optional(v.string()),
    regionId: v.optional(v.string()),
    agencyId: v.optional(v.string()),
    activityId: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let filtered = await ctx.db.query("tenders").collect();
 
    if (args.search?.trim()) {
      const term = args.search.toLowerCase().trim();
      filtered = filtered.filter(t =>
        t.tender_name?.toLowerCase().includes(term) ||
        t.reference_number?.toLowerCase().includes(term) ||
        t.description?.toLowerCase().includes(term)
      );
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
 
     return filtered;
  },
});