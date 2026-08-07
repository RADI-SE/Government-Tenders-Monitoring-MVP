import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("attachments").collect();
  },
});

 

export const getByTender = query({
  args: {
    tenderId: v.id("tenders"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("attachments")
      .withIndex("by_tender", (q) =>
        q.eq("tenderId", args.tenderId)
      )
      .collect();
  },
});
 
export const create = mutation({
  args: {
    tenderId: v.id("tenders"),

    title: v.string(),

    url: v.string(),

    type: v.union(
      v.literal("pdf"),
      v.literal("doc"),
      v.literal("excel"),
      v.literal("image"),
      v.literal("zip"),
      v.literal("other")
    ),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("attachments", {
      ...args,
      uploadedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("attachments"),

    title: v.optional(v.string()),
    url: v.optional(v.string()),

    type: v.optional(
      v.union(
        v.literal("pdf"),
        v.literal("doc"),
        v.literal("excel"),
        v.literal("image"),
        v.literal("zip"),
        v.literal("other")
      )
    ),
  },

  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    await ctx.db.patch(id, updates);

    return id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("attachments"),
  },

  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});