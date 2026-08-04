import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getLatestJob = query({
  args: {},

  handler: async (ctx) => {
    const jobs = await ctx.db
      .query("importJobs")
      .withIndex("by_startedAt")
      .order("desc")
      .take(1);

    return jobs[0] ?? null;
  },
});

export const getHistory = query({
  args: {},

  handler: async (ctx) => {
    return await ctx.db
      .query("importJobs")
      .withIndex("by_startedAt")
      .order("desc")
      .collect();
  },
});

export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("importJobs")
      .withIndex("by_status", (q) =>
        q.eq("status", args.status)
      )
      .collect();
  },
});

export const startJob = mutation({
  args: {
    source: v.union(
      v.literal("etimad"),
      v.literal("csv"),
      v.literal("manual")
    ),

    initiatedBy: v.optional(v.id("users")),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("importJobs", {
      source: args.source,
      initiatedBy: args.initiatedBy,

      status: "running",

      totalFetched: 0,
      totalImported: 0,
      totalSkipped: 0,
      totalFailed: 0,

      startedAt: Date.now(),

      finishedAt: undefined,
      durationMs: undefined,

      errorMessage: undefined,
    });
  },
});

export const completeJob = mutation({
  args: {
    jobId: v.id("importJobs"),

    totalFetched: v.number(),
    totalImported: v.number(),
    totalSkipped: v.number(),
    totalFailed: v.number(),
  },

  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);

    if (!job) {
      throw new Error("Import job not found.");
    }

    const finishedAt = Date.now();

    await ctx.db.patch(args.jobId, {
      status: "completed",

      totalFetched: args.totalFetched,
      totalImported: args.totalImported,
      totalSkipped: args.totalSkipped,
      totalFailed: args.totalFailed,

      finishedAt,
      durationMs: finishedAt - job.startedAt,
    });

    return args.jobId;
  },
});

export const failJob = mutation({
  args: {
    jobId: v.id("importJobs"),

    errorMessage: v.string(),
  },

  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);

    if (!job) {
      throw new Error("Import job not found.");
    }

    const finishedAt = Date.now();

    await ctx.db.patch(args.jobId, {
      status: "failed",

      finishedAt,
      durationMs: finishedAt - job.startedAt,

      errorMessage: args.errorMessage,
    });

    return args.jobId;
  },
});