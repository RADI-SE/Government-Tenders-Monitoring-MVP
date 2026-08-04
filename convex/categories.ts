import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("asc").collect();
  },
});

export const getById = query({
  args: {
    id: v.id("categories"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByExternalCategoryId = query({
  args: {
    externalCategoryId: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_externalCategoryId", (q) =>
        q.eq("externalCategoryId", args.externalCategoryId)
      )
      .unique();
  },
});

export const search = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const categories = await ctx.db.query("categories").collect();

    return categories.filter((category) =>
      category.name.toLowerCase().includes(args.name.toLowerCase())
    );
  },
});

export const create = mutation({
  args: {
    externalCategoryId: v.number(),
    name: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", {
      externalCategoryId: args.externalCategoryId,
      name: args.name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.string(),
  },

  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.id);

    if (!category) {
      throw new Error("Category not found.");
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("categories"),
  },

  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const upsert = mutation({
  args: {
    externalCategoryId: v.number(),
    name: v.string(),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_externalCategoryId", (q) =>
        q.eq("externalCategoryId", args.externalCategoryId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        updatedAt: Date.now(),
      });

      return existing._id;
    }

    return await ctx.db.insert("categories", {
      externalCategoryId: args.externalCategoryId,
      name: args.name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});