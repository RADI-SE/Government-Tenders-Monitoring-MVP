import { mutation , query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tenders")
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: {
    id: v.id("tenders"),
  },

  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByReferenceNumber = query({
  args: {
    referenceNumber: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("tenders")
      .withIndex("by_referenceNumber", (q) =>
        q.eq("referenceNumber", args.referenceNumber)
      )
      .unique();
  },
});


export const getByAgency = query({
  args: {
    agencyId: v.id("agencies"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("tenders")
      .withIndex("by_agency", (q) =>
        q.eq("agencyId", args.agencyId)
      )
      .collect();
  },
});


export const getByWorkflowStatus = query({
  args: {
    workflowStatus: v.union(
      v.literal("new"),
      v.literal("reviewing"),
      v.literal("interested"),
      v.literal("not_suitable"),
      v.literal("submitted"),
      v.literal("archived")
    ),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("tenders")
      .withIndex("by_workflowStatus", (q) =>
        q.eq("workflowStatus", args.workflowStatus)
      )
      .collect();
  },
});


export const getUpcomingDeadlines = query({
  args: {},

  handler: async (ctx) => {
    const now = Date.now();

    const tenders = await ctx.db
      .query("tenders")
      .withIndex("by_submissionDeadline")
      .collect();

    return tenders.filter(
      (t) =>
        t.submissionDeadline >= now &&
        t.workflowStatus !== "archived"
    );
  },
});


export const search = query({
  args: {
    keyword: v.string(),
  },

  handler: async (ctx, args) => {
    const keyword = args.keyword.toLowerCase();

    const tenders = await ctx.db.query("tenders").collect();

    return tenders.filter(
      (t) =>
        t.title.toLowerCase().includes(keyword) ||
        t.referenceNumber.toLowerCase().includes(keyword) ||
        t.purpose.toLowerCase().includes(keyword)
    );
  },
});

export const create = mutation({
  args: {
    referenceNumber: v.string(),
    tenderNumber: v.string(),

    agencyId: v.id("agencies"),
    categoryId: v.optional(v.id("categories")),

    title: v.string(),
    purpose: v.string(),

    tenderType: v.string(),
    etimadStatus: v.string(),

    workflowStatus: v.union(
      v.literal("new"),
      v.literal("reviewing"),
      v.literal("interested"),
      v.literal("not_suitable"),
      v.literal("submitted"),
      v.literal("archived")
    ),

    documentCost: v.number(),
    contractDuration: v.string(),

    submissionMethod: v.optional(v.string()),
    insuranceRequired: v.boolean(),
    finalGuarantee: v.optional(v.number()),

    enquiryDeadline: v.optional(v.number()),
    submissionDeadline: v.number(),
    openingDate: v.number(),
    expectedAwardDate: v.optional(v.number()),
    workStartDate: v.optional(v.number()),

    convertedToTask: v.boolean(),

    source: v.union(
      v.literal("etimad"),
      v.literal("csv"),
      v.literal("manual"),
      v.literal("mock")
    ),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("tenders", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});


export const update = mutation({
  args: {
    id: v.id("tenders"),

    title: v.optional(v.string()),
    purpose: v.optional(v.string()),
    workflowStatus: v.optional(
      v.union(
        v.literal("new"),
        v.literal("reviewing"),
        v.literal("interested"),
        v.literal("not_suitable"),
        v.literal("submitted"),
        v.literal("archived")
      )
    ),
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

export const updateWorkflowStatus = mutation({
  args: {
    tenderId: v.id("tenders"),

    workflowStatus: v.union(
      v.literal("new"),
      v.literal("reviewing"),
      v.literal("interested"),
      v.literal("not_suitable"),
      v.literal("submitted"),
      v.literal("archived")
    ),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.tenderId, {
      workflowStatus: args.workflowStatus,
      updatedAt: Date.now(),
    });

    return args.tenderId;
  },
});

export const archive = mutation({
  args: {
    tenderId: v.id("tenders"),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.tenderId, {
      workflowStatus: "archived",
      updatedAt: Date.now(),
    });

    return args.tenderId;
  },
});


export const convertToTask = mutation({
  args: {
    tenderId: v.id("tenders"),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.tenderId, {
      convertedToTask: true,
      updatedAt: Date.now(),
    });

    return args.tenderId;
  },
});


export const upsert = mutation({
  args: {
    referenceNumber: v.string(),

    tenderNumber: v.string(),

    agencyId: v.id("agencies"),
    categoryId: v.optional(v.id("categories")),

    title: v.string(),
    purpose: v.string(),

    tenderType: v.string(),
    etimadStatus: v.string(),

    workflowStatus: v.union(
      v.literal("new"),
      v.literal("reviewing"),
      v.literal("interested"),
      v.literal("not_suitable"),
      v.literal("submitted"),
      v.literal("archived")
    ),

    documentCost: v.number(),
    contractDuration: v.string(),

    submissionMethod: v.optional(v.string()),
    insuranceRequired: v.boolean(),
    finalGuarantee: v.optional(v.number()),

    enquiryDeadline: v.optional(v.number()),
    submissionDeadline: v.number(),
    openingDate: v.number(),
    expectedAwardDate: v.optional(v.number()),
    workStartDate: v.optional(v.number()),

    convertedToTask: v.boolean(),

    source: v.union(
      v.literal("etimad"),
      v.literal("csv"),
      v.literal("manual"),
      v.literal("mock")
    ),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("tenders")
      .withIndex("by_referenceNumber", (q) =>
        q.eq("referenceNumber", args.referenceNumber)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });

      return existing._id;
    }

    return await ctx.db.insert("tenders", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});