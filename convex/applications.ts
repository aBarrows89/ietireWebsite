import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Submit a new application
export const submitApplication = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    message: v.optional(v.string()),
    resumeText: v.optional(v.string()),
    appliedJobId: v.optional(v.id("jobs")),
    appliedJobTitle: v.string(),
    aiAnalysis: v.optional(v.object({
      suggestedJobId: v.optional(v.id("jobs")),
      suggestedJobTitle: v.optional(v.string()),
      matchScore: v.number(),
      allScores: v.array(v.object({
        jobId: v.id("jobs"),
        jobTitle: v.string(),
        score: v.number(),
        matchedKeywords: v.array(v.string()),
        reasoning: v.optional(v.string()),
      })),
      extractedSkills: v.array(v.string()),
      summary: v.optional(v.string()),
    })),
    // Candidate Analysis for hiring team
    candidateAnalysis: v.optional(v.object({
      overallScore: v.number(),
      stabilityScore: v.number(),
      experienceScore: v.number(),
      employmentHistory: v.array(v.object({
        company: v.string(),
        title: v.string(),
        duration: v.string(),
        durationMonths: v.number(),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
      })),
      redFlags: v.array(v.object({
        type: v.string(),
        severity: v.string(),
        description: v.string(),
      })),
      greenFlags: v.array(v.object({
        type: v.string(),
        description: v.string(),
      })),
      totalYearsExperience: v.number(),
      averageTenureMonths: v.number(),
      longestTenureMonths: v.number(),
      recommendedAction: v.string(),
      hiringTeamNotes: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("applications", {
      ...args,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get all applications (for admin dashboard)
export const getAllApplications = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("applications")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

// Get applications by status
export const getApplicationsByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("applications")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Get applications for a specific job
export const getApplicationsByJob = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("applications")
      .withIndex("by_job", (q) => q.eq("appliedJobId", args.jobId))
      .collect();
  },
});

// Update application status (for admin)
export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.applicationId, {
      status: args.status,
      notes: args.notes,
      updatedAt: Date.now(),
    });
  },
});

// Get application count by status (for dashboard)
export const getApplicationStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("applications").collect();

    const stats = {
      total: all.length,
      new: 0,
      reviewed: 0,
      contacted: 0,
      interviewed: 0,
      hired: 0,
      rejected: 0,
    };

    for (const app of all) {
      if (app.status in stats) {
        (stats as any)[app.status]++;
      }
    }

    return stats;
  },
});
