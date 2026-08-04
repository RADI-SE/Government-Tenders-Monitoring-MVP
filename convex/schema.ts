import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        clerkUserId: v.string(),

        fullName: v.string(),

        email: v.string(),

        role: v.union(
            v.literal("admin"),
            v.literal("analyst")
        ),

        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_clerkUserId", ["clerkUserId"])
        .index("by_email", ["email"]),

    agencies: defineTable({
        externalAgencyId: v.number(),

        name: v.string(),

        website: v.optional(v.string()),

        createdAt: v.number(),

        updatedAt: v.number(),
    })
        .index("by_externalAgencyId", ["externalAgencyId"])
        .index("by_name", ["name"]),

    categories: defineTable({
        externalCategoryId: v.number(),

        name: v.string(),

        createdAt: v.number(),

        updatedAt: v.number(),
    })
        .index("by_externalCategoryId", ["externalCategoryId"])
        .index("by_name", ["name"]),

    tenders: defineTable({
        // External IDs
        referenceNumber: v.string(),
        tenderNumber: v.string(),

        // Relationships
        agencyId: v.id("agencies"),
        categoryId: v.optional(v.id("categories")),

        // Basic Info
        title: v.string(),
        purpose: v.string(),

        tenderType: v.string(),
        etimadStatus: v.string(),

        // Workflow Status (our system)
        workflowStatus: v.union(
            v.literal("new"),
            v.literal("reviewing"),
            v.literal("interested"),
            v.literal("not_suitable"),
            v.literal("submitted"),
            v.literal("archived")
        ),

        // Contract
        documentCost: v.number(),
        contractDuration: v.string(),

        // Submission
        submissionMethod: v.optional(v.string()),
        insuranceRequired: v.boolean(),
        finalGuarantee: v.optional(v.number()),

        // Dates
        enquiryDeadline: v.optional(v.number()),
        submissionDeadline: v.number(),
        openingDate: v.number(),
        expectedAwardDate: v.optional(v.number()),
        workStartDate: v.optional(v.number()),

        // AI
        aiSummary: v.optional(v.string()),
        opportunityScore: v.optional(v.number()),
        classification: v.optional(v.string()),

        // Task
        convertedToTask: v.boolean(),

        // Source
        source: v.union(
            v.literal("etimad"),
            v.literal("csv"),
            v.literal("manual"),
            v.literal("mock")
        ),

        // Metadata
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_referenceNumber", ["referenceNumber"])
        .index("by_agency", ["agencyId"])
        .index("by_workflowStatus", ["workflowStatus"])
        .index("by_submissionDeadline", ["submissionDeadline"])
        .index("by_source", ["source"]),

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

        opportunityScore: v.number(), // 0 - 100

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
        source: v.union(
            v.literal("etimad"),
            v.literal("csv"),
            v.literal("manual")
        ),

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


});