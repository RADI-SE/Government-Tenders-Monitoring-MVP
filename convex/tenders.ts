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
          q.eq(q.field("archived"), false),
          q.eq(q.field("archived"), undefined)
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
      archived: true,
      archivedAt: Date.now(),
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
      archived: false,
      archivedAt: undefined,
    });

    return {
      success: true,
    };
  },
});

 
export const getArchivedTenders = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("tenders")
      .filter((q) =>
        q.eq(q.field("archived"), true)
      )
      .collect();
  },
});