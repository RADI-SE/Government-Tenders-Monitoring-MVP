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
