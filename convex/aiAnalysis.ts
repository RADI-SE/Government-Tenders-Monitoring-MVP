import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("aiAnalysis").collect();
  },
});

export const getById = query({
  args: {
    id: v.id("aiAnalysis"),
  },

  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByTender = query({
  args: {
    tenderId: v.id("tenders"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiAnalysis")
      .withIndex("by_tender", (q) =>
        q.eq("tenderId", args.tenderId)
      )
      .unique();
  },
});

export const create = mutation({
  args: {
    tenderId: v.id("tenders"),

    summary: v.string(),

    classification: v.union(
      v.literal("Construction"),
      v.literal("IT"),
      v.literal("Consulting"),
      v.literal("Medical"),
      v.literal("Maintenance"),
      v.literal("Other")
    ),

    opportunityScore: v.number(),

    recommendation: v.union(
      v.literal("Apply"),
      v.literal("Review"),
      v.literal("Ignore")
    ),

    strengths: v.array(v.string()),

    risks: v.array(v.string()),

    requiredDocuments: v.array(v.string()),

    generatedBy: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("aiAnalysis", {
      ...args,
      analyzedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("aiAnalysis"),

    summary: v.optional(v.string()),

    classification: v.optional(
      v.union(
        v.literal("Construction"),
        v.literal("IT"),
        v.literal("Consulting"),
        v.literal("Medical"),
        v.literal("Maintenance"),
        v.literal("Other")
      )
    ),

    opportunityScore: v.optional(v.number()),

    recommendation: v.optional(
      v.union(
        v.literal("Apply"),
        v.literal("Review"),
        v.literal("Ignore")
      )
    ),

    strengths: v.optional(v.array(v.string())),

    risks: v.optional(v.array(v.string())),

    requiredDocuments: v.optional(v.array(v.string())),

    generatedBy: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    await ctx.db.patch(id, {
      ...updates,
      analyzedAt: Date.now(),
    });

    return id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("aiAnalysis"),
  },

  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});