import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("desc").collect();
  },
});

export const getById = query({
  args: {
    id: v.id("tasks"),
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
      .query("tasks")
      .withIndex("by_tender", q =>
        q.eq("tenderId", args.tenderId)
      )
      .collect();
  },
});

export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_status", q =>
        q.eq("status", args.status)
      )
      .collect();
  },
});

export const getByAssignedUser = query({
  args: {
    userId: v.id("users"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_assignedTo", q =>
        q.eq("assignedTo", args.userId)
      )
      .collect();
  },
});

export const getUpcoming = query({
  args: {},

  handler: async (ctx) => {
    const now = Date.now();

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_dueDate")
      .collect();

    return tasks.filter(task =>
      task.dueDate &&
      task.dueDate >= now &&
      task.status !== "completed"
    );
  },
});

export const create = mutation({
  args: {
    tenderId: v.id("tenders"),

    title: v.string(),

    description: v.optional(v.string()),

    assignedTo: v.optional(v.id("users")),

    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),

    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),

    dueDate: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      ...args,
      completedAt: undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),

    title: v.optional(v.string()),
    description: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),

    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("urgent")
      )
    ),

    dueDate: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),

    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      completedAt:
        args.status === "completed"
          ? Date.now()
          : undefined,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },

  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});