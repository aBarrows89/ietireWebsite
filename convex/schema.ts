import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Jobs table - positions available at IE Tire
  jobs: defineTable({
    title: v.string(),
    location: v.string(),
    type: v.string(), // "Full-time", "Part-time", etc.
    department: v.string(), // "Operations", "Management", "Sales", etc.
    status: v.string(), // "accepting", "open", "closed"
    description: v.string(),
    benefits: v.array(v.string()),
    keywords: v.array(v.string()), // For AI matching
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_department", ["department"])
    .index("by_status", ["status"])
    .index("by_active", ["isActive"]),

  // Applications table - job applications submitted
  applications: defineTable({
    // Applicant info
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    message: v.optional(v.string()),

    // Resume data
    resumeText: v.optional(v.string()), // Extracted text from resume
    resumeFileId: v.optional(v.id("_storage")), // If storing resume file

    // Job matching
    appliedJobId: v.optional(v.id("jobs")), // The job they selected
    appliedJobTitle: v.string(), // Store title for easy reference

    // AI Analysis results
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

    // Candidate Analysis for hiring team (red flags, scores, etc.)
    candidateAnalysis: v.optional(v.object({
      overallScore: v.number(), // 0-100 overall candidate rating
      stabilityScore: v.number(), // 0-100 based on tenure history
      experienceScore: v.number(), // 0-100 based on relevant experience
      employmentHistory: v.array(v.object({
        company: v.string(),
        title: v.string(),
        duration: v.string(),
        durationMonths: v.number(),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
      })),
      redFlags: v.array(v.object({
        type: v.string(), // "job_hopping", "employment_gap", "short_tenure", "inconsistency", "no_experience", "overqualified"
        severity: v.string(), // "low", "medium", "high"
        description: v.string(),
      })),
      greenFlags: v.array(v.object({
        type: v.string(), // "long_tenure", "promotion", "relevant_experience", "certifications", "leadership"
        description: v.string(),
      })),
      totalYearsExperience: v.number(),
      averageTenureMonths: v.number(),
      longestTenureMonths: v.number(),
      recommendedAction: v.string(), // "strong_candidate", "worth_interviewing", "review_carefully", "likely_pass"
      hiringTeamNotes: v.string(),
    })),

    // Status tracking
    status: v.string(), // "new", "reviewed", "contacted", "interviewed", "hired", "rejected"
    notes: v.optional(v.string()), // Internal notes

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_job", ["appliedJobId"])
    .index("by_created", ["createdAt"]),
});
