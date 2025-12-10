import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all active jobs
export const getActiveJobs = query({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    return jobs;
  },
});

// Get jobs by department
export const getJobsByDepartment = query({
  args: { department: v.string() },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_department", (q) => q.eq("department", args.department))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    return jobs;
  },
});

// Get single job by ID
export const getJob = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobId);
  },
});

// Create a new job (admin function)
export const createJob = mutation({
  args: {
    title: v.string(),
    location: v.string(),
    type: v.string(),
    department: v.string(),
    status: v.string(),
    description: v.string(),
    benefits: v.array(v.string()),
    keywords: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("jobs", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update job status (admin function)
export const updateJobStatus = mutation({
  args: {
    jobId: v.id("jobs"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Seed initial jobs
export const seedJobs = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const jobsData = [
      {
        title: "Warehouse Associate",
        location: "Latrobe, PA",
        type: "Full-time",
        department: "Operations",
        status: "accepting",
        description: "Load/unload trucks, organize inventory, and ensure accurate order fulfillment in our tire distribution warehouse.",
        benefits: ["Competitive hourly pay", "Health insurance", "401(k)", "Paid time off"],
        keywords: [
          "warehouse", "inventory", "forklift", "shipping", "receiving", "logistics",
          "labor", "physical", "loading", "unloading", "pallet", "organization",
          "material handling", "distribution", "stock"
        ],
      },
      {
        title: "Warehouse Picker",
        location: "Latrobe & Uniontown, PA",
        type: "Full-time",
        department: "Operations",
        status: "accepting",
        description: "Pick and prepare tire orders for shipment. Operate pallet jacks and ensure order accuracy in a fast-paced environment.",
        benefits: ["Competitive hourly pay", "Health insurance", "401(k)", "Paid time off"],
        keywords: [
          "picker", "warehouse", "orders", "pallet", "shipping", "fulfillment",
          "picking", "packing", "order fulfillment", "pallet jack", "fast-paced",
          "accuracy", "attention to detail"
        ],
      },
      {
        title: "Inventory Specialist",
        location: "Latrobe, PA",
        type: "Full-time",
        department: "Operations",
        status: "accepting",
        description: "Manage inventory counts, track stock levels, coordinate with purchasing, and maintain accurate inventory records.",
        benefits: ["Competitive salary", "Health insurance", "401(k)", "Growth opportunity"],
        keywords: [
          "inventory", "counting", "stock", "tracking", "data entry", "organization",
          "inventory management", "cycle counting", "ERP", "spreadsheet", "excel",
          "accuracy", "analytical", "purchasing", "supply chain"
        ],
      },
      {
        title: "Warehouse Management",
        location: "Latrobe & Uniontown, PA",
        type: "Full-time",
        department: "Management",
        status: "accepting",
        description: "Supervise warehouse team, optimize operations, manage scheduling, and ensure safety compliance. 3+ years experience required.",
        benefits: ["Competitive salary", "Full benefits", "401(k) match", "Leadership role"],
        keywords: [
          "management", "supervisor", "leadership", "operations", "team", "scheduling",
          "warehouse manager", "team lead", "safety", "compliance", "OSHA",
          "process improvement", "KPIs", "performance management", "training"
        ],
      },
      {
        title: "Shift Supervisor",
        location: "Latrobe & Uniontown, PA",
        type: "Full-time",
        department: "Management",
        status: "accepting",
        description: "Lead warehouse team during assigned shift. Coordinate daily operations, handle issues, and maintain productivity standards.",
        benefits: ["Competitive salary", "Health insurance", "401(k)", "Advancement opportunity"],
        keywords: [
          "supervisor", "shift", "leadership", "team lead", "operations",
          "shift management", "daily operations", "productivity", "problem solving",
          "communication", "coordination"
        ],
      },
      {
        title: "Delivery Driver (CDL)",
        location: "Latrobe & Uniontown, PA",
        type: "Full-time",
        department: "Operations",
        status: "accepting",
        description: "Deliver tires to wholesale customers throughout Western PA. CDL Class A or B required.",
        benefits: ["Top driver pay", "Home daily", "Full benefits", "Newer equipment"],
        keywords: [
          "cdl", "driver", "delivery", "trucking", "transportation", "commercial",
          "CDL Class A", "CDL Class B", "DOT", "driving", "route", "customer service",
          "local delivery", "regional", "truck driver"
        ],
      },
      {
        title: "Inside Sales Representative",
        location: "Uniontown, PA",
        type: "Full-time",
        department: "Sales",
        status: "accepting",
        description: "Build relationships with wholesale accounts, process orders, and provide excellent customer service to our B2B clients.",
        benefits: ["Base + commission", "Growth opportunity", "Health benefits", "Professional environment"],
        keywords: [
          "sales", "customer service", "b2b", "account", "retail", "phone",
          "inside sales", "account management", "relationship building", "order processing",
          "wholesale", "business development", "CRM", "upselling"
        ],
      },
      {
        title: "Technology / IT Support",
        location: "Latrobe, PA",
        type: "Full-time",
        department: "Technology",
        status: "accepting",
        description: "Support IT infrastructure, troubleshoot hardware/software issues, maintain inventory systems, and assist with technology projects.",
        benefits: ["Competitive salary", "Full benefits", "Professional development", "Modern tech stack"],
        keywords: [
          "it", "technology", "computer", "software", "hardware", "support", "helpdesk", "network",
          "IT support", "technical support", "troubleshooting", "Windows", "networking",
          "database", "ERP systems", "Microsoft Office", "system administration"
        ],
      },
      {
        title: "Administrative Assistant",
        location: "Latrobe, PA",
        type: "Full-time",
        department: "Administration",
        status: "accepting",
        description: "Provide administrative support, manage schedules, handle correspondence, and assist with office operations.",
        benefits: ["Competitive salary", "Health insurance", "401(k)", "Professional environment"],
        keywords: [
          "admin", "administrative", "office", "clerical", "assistant", "organization", "scheduling",
          "Microsoft Office", "data entry", "filing", "correspondence", "reception",
          "phone", "multitasking", "communication", "professional"
        ],
      },
    ];

    // Insert all jobs
    for (const job of jobsData) {
      await ctx.db.insert("jobs", {
        ...job,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { inserted: jobsData.length };
  },
});
