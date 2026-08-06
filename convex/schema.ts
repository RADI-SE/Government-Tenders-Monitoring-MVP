import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  users: defineTable({
    clerkUserId: v.string(),
    fullName: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("analyst")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_email", ["email"]),

 
  categories: defineTable({
    externalCategoryId: v.number(), // original activity ID
    name: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_externalCategoryId", ["externalCategoryId"])
    .index("by_name", ["name"]),
 
  tenders: defineTable({
    id: v.number(),
    reference_number: v.string(),
    tender_number: v.optional(v.string()),
    tender_name: v.string(),
    description: v.optional(v.string()),
    budget: v.optional(v.number()),
    workflow_status: v.union(
      v.literal("new"),
      v.literal("reviewing"),
      v.literal("interested"),
      v.literal("not_suitable"),
      v.literal("submitted"),
      v.literal("archived")
    ),
    original_status: v.optional(v.string()),
    opportunity_score: v.optional(v.number()),
    classification: v.optional(v.string()),
    ai_summary: v.optional(v.string()),
    last_submission_date: v.optional(v.string()),
    created_at: v.string(),
    updated_at: v.optional(v.string()),
    agency_id: v.optional(v.number()),
    region_id: v.optional(v.number()),
    tender_type: v.optional(v.string()),
    documents: v.optional(v.array(v.string())),
    activity_ids: v.optional(v.array(v.number())),
    raw_data: v.optional(v.any()),
    archived: v.optional(v.boolean()),
    archivedAt: v.optional(v.number()),
  })
    .index("by_original_id", ["id"])
    .index("by_workflow_status", ["workflow_status"])
    .index("by_agency_id", ["agency_id"])          // ← NEW
    .index("by_region_id", ["region_id"])          // ← NEW
    .index("by_activity_ids", ["activity_ids"])    // ← NEW
    .searchIndex("by_tender_name", { searchField: "tender_name" }),
 
  attachments: defineTable({
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
    uploadedAt: v.number(),
  })
    .index("by_tender", ["tenderId"])
    .index("by_type", ["type"]),
 
  aiAnalysis: defineTable({
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
    analyzedAt: v.number(),
  })
    .index("by_tender", ["tenderId"]),
 
  tasks: defineTable({
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
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tender", ["tenderId"])
    .index("by_status", ["status"])
    .index("by_assignedTo", ["assignedTo"])
    .index("by_dueDate", ["dueDate"]),
 
  reminders: defineTable({
    tenderId: v.id("tenders"),
    title: v.string(),
    reminderType: v.union(
      v.literal("submission_deadline"),
      v.literal("award_date"),
      v.literal("custom")
    ),
    remindAt: v.number(),
    isSent: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_tender", ["tenderId"])
    .index("by_remindAt", ["remindAt"])
    .index("by_isSent", ["isSent"]),
 
  importJobs: defineTable({
    source: v.union(v.literal("etimad"), v.literal("csv"), v.literal("manual")),
    status: v.union(
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
    totalFetched: v.number(),
    totalImported: v.number(),
    totalSkipped: v.number(),
    totalFailed: v.number(),
    startedAt: v.number(),
    finishedAt: v.optional(v.number()),
    durationMs: v.optional(v.number()),
    initiatedBy: v.optional(v.id("users")),
    errorMessage: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_startedAt", ["startedAt"])
    .index("by_source", ["source"]),
 
  regions: defineTable({
    id: v.number(),
    name: v.string(),
  })
    .index("by_region_id", ["id"]),

  agencies: defineTable({
    id: v.number(),
    name: v.string(),
  }).index("by_agency_id", ["id"]),

  activities: defineTable({
    id: v.number(),
    name: v.string(),
  }).index("by_activity_id", ["id"]),

  statuses: defineTable({
    id: v.string(),
    name: v.string(),
  }).index("by_status_id", ["id"]),
});