import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agencies").order("asc").collect();
  },
});

export const getById = query({
  args: {
    id: v.id("agencies"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByExternalAgencyId = query({
  args: {
    externalAgencyId: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agencies")
      .withIndex("by_externalAgencyId", (q) =>
        q.eq("externalAgencyId", args.externalAgencyId)
      )
      .unique();
  },
});

export const search = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const agencies = await ctx.db.query("agencies").collect();

    return agencies.filter((agency) =>
      agency.name.toLowerCase().includes(args.name.toLowerCase())
    );
  },
});

export const create = mutation({
  args: {
    externalAgencyId: v.number(),
    name: v.string(),
    website: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("agencies", {
      externalAgencyId: args.externalAgencyId,
      name: args.name,
      website: args.website,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("agencies"),
    name: v.optional(v.string()),
    website: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const agency = await ctx.db.get(args.id);

    if (!agency) {
      throw new Error("Agency not found.");
    }

    await ctx.db.patch(args.id, {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.website !== undefined && { website: args.website }),
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("agencies"),
  },

  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const upsert = mutation({
  args: {
    externalAgencyId: v.number(),
    name: v.string(),
    website: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("agencies")
      .withIndex("by_externalAgencyId", (q) =>
        q.eq("externalAgencyId", args.externalAgencyId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        website: args.website,
        updatedAt: Date.now(),
      });

      return existing._id;
    }

    return await ctx.db.insert("agencies", {
      externalAgencyId: args.externalAgencyId,
      name: args.name,
      website: args.website,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});