"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import Anthropic from "@anthropic-ai/sdk";

export const analyzeResume = action({
  args: {
    resumeText: v.string(),
  },
  handler: async (ctx, args): Promise<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    extractedSkills: string[];
    summary: string;
    jobMatches: Array<{
      jobId: string;
      jobTitle: string;
      score: number;
      matchedKeywords: string[];
      reasoning: string;
    }>;
    missingFields: string[];
    // New candidate analysis fields for hiring team
    candidateAnalysis: {
      overallScore: number; // 0-100 overall candidate rating
      stabilityScore: number; // 0-100 based on tenure history
      experienceScore: number; // 0-100 based on relevant experience
      employmentHistory: Array<{
        company: string;
        title: string;
        duration: string; // e.g., "2 years 3 months"
        durationMonths: number;
        startDate?: string;
        endDate?: string;
      }>;
      redFlags: Array<{
        type: "job_hopping" | "employment_gap" | "short_tenure" | "inconsistency" | "no_experience" | "overqualified";
        severity: "low" | "medium" | "high";
        description: string;
      }>;
      greenFlags: Array<{
        type: "long_tenure" | "promotion" | "relevant_experience" | "certifications" | "leadership";
        description: string;
      }>;
      totalYearsExperience: number;
      averageTenureMonths: number;
      longestTenureMonths: number;
      recommendedAction: "strong_candidate" | "worth_interviewing" | "review_carefully" | "likely_pass";
      hiringTeamNotes: string; // AI-generated summary for hiring team
    };
  }> => {
    const { resumeText } = args;

    // Get all active jobs from database
    const jobs = await ctx.runQuery(api.jobs.getActiveJobs);

    console.log(`Found ${jobs.length} active jobs`);
    console.log(`Resume text length: ${resumeText.length} characters`);
    console.log(`Resume preview: ${resumeText.substring(0, 200)}...`);

    // Check if Anthropic API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY not configured - using fallback analysis");
      return fallbackAnalysis(resumeText, jobs);
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Create a simple job list for the AI with indices
    const jobList = jobs.map((job, index) => ({
      index: index + 1,
      id: job._id,
      title: job.title,
      description: job.description,
      department: job.department,
      keywords: job.keywords,
    }));

    // Use Claude to analyze the resume against jobs
    const prompt = `Analyze this resume and match it against our job positions. Return scores for ALL ${jobs.length} jobs.

RESUME TEXT (this is the ONLY information you have about the candidate):
---
${resumeText}
---

JOB POSITIONS (you must score ALL of these):
${jobList.map(job => `
Job #${job.index}: "${job.title}"
Department: ${job.department}
Description: ${job.description}
Required Skills: ${job.keywords.join(", ")}
`).join("\n")}

Return JSON in this exact format (no other text, just JSON):
{
  "firstName": "first name EXACTLY as written in resume",
  "lastName": "last name EXACTLY as written in resume",
  "email": "email EXACTLY as written in resume",
  "phone": "phone number EXACTLY as written in resume",
  "extractedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "summary": "1-2 sentence summary based ONLY on what is written in the resume",
  "jobMatches": [
    {"jobIndex": 1, "score": 85, "matchedKeywords": ["warehouse", "forklift"], "reasoning": "Based on your experience at [ACTUAL COMPANY FROM RESUME], you have relevant skills."}
  ],
  "candidateAnalysis": {
    "overallScore": 75,
    "stabilityScore": 80,
    "experienceScore": 70,
    "employmentHistory": [
      {"company": "Company Name", "title": "Job Title", "duration": "2 years 3 months", "durationMonths": 27, "startDate": "Jan 2022", "endDate": "Apr 2024"}
    ],
    "redFlags": [
      {"type": "job_hopping", "severity": "medium", "description": "3 jobs in 2 years indicates potential retention issues"}
    ],
    "greenFlags": [
      {"type": "long_tenure", "description": "5 years at XYZ Company shows strong commitment"}
    ],
    "totalYearsExperience": 8.5,
    "averageTenureMonths": 24,
    "longestTenureMonths": 60,
    "recommendedAction": "worth_interviewing",
    "hiringTeamNotes": "Candidate shows strong warehouse experience but has recent job changes. Recommend asking about reasons for leaving recent positions."
  }
}

=== CANDIDATE ANALYSIS INSTRUCTIONS ===
You MUST populate the candidateAnalysis section with detailed analysis:

1. EMPLOYMENT HISTORY: Extract ALL jobs from the resume with:
   - Company name, job title, duration (estimate if only years given)
   - Calculate durationMonths for each position

2. RED FLAGS to detect (be specific and honest):
   - "job_hopping": 3+ jobs in 2 years, or pattern of leaving before 1 year
   - "employment_gap": Gaps of 6+ months between jobs
   - "short_tenure": Multiple positions under 12 months
   - "inconsistency": Conflicting dates, unexplained career changes
   - "no_experience": Applying for role with zero relevant background
   - "overqualified": Senior manager applying for entry-level (flight risk)

3. GREEN FLAGS to highlight:
   - "long_tenure": 3+ years at any single employer
   - "promotion": Internal promotions show growth
   - "relevant_experience": Direct experience in our industry
   - "certifications": Forklift cert, CDL, IT certs, etc.
   - "leadership": Team lead, supervisor, management experience

4. SCORING:
   - overallScore: Weighted combination (40% experience, 40% stability, 20% skills fit)
   - stabilityScore: Based on average tenure and job hopping patterns
   - experienceScore: How relevant is their background to warehouse/logistics

5. RECOMMENDED ACTION:
   - "strong_candidate": 80+ overall, no major red flags
   - "worth_interviewing": 60-79 overall, minor concerns
   - "review_carefully": 40-59 overall, significant concerns to discuss
   - "likely_pass": Under 40, or major red flags

6. HIRING TEAM NOTES: Write 2-3 sentences specifically for the hiring manager about this candidate's strengths, concerns, and suggested interview questions.

CRITICAL RULES - YOU MUST FOLLOW THESE:
1. ONLY use information that is EXPLICITLY written in the resume above
2. NEVER invent, assume, or hallucinate company names, job titles, or experiences
3. NEVER mention companies or experiences that are NOT in the resume text
4. If the resume doesn't clearly state something, say "based on your resume" instead of making up specifics
5. The reasoning MUST reference ONLY actual companies, job titles, and skills from the resume text above

SCORING RULES:
- 80-100: Direct experience in this exact role or very closely related
- 60-79: Similar/related experience that transfers well
- 40-59: Some transferable skills, could learn quickly
- 20-39: Limited background but potential to learn
- 10-19: Minimal relevant experience

=== MANAGEMENT POSITIONS (Warehouse Manager, Shift Manager, Operations Manager) ===
These roles have VERY STRICT requirements. DO NOT inflate scores for candidates without proper qualifications.

REQUIRED FOR WAREHOUSE MANAGER (70+ score):
- MUST have "Warehouse Manager", "Distribution Manager", "Operations Manager", "Logistics Manager" or similar WAREHOUSE-SPECIFIC management title
- MUST have managed warehouse/distribution operations (inventory, shipping, receiving, fulfillment)
- A "Line Supervisor" at a non-warehouse job is NOT warehouse management
- A "Supervisor" at retail, food service, aviation, etc. is NOT warehouse management

SCORING FOR WAREHOUSE MANAGER:
- Direct Warehouse/Distribution Manager experience = 80-95%
- Shift Manager at a warehouse/distribution center = 70-85%
- General "Operations Manager" in logistics/supply chain = 65-80%
- Retail Store Manager (NO warehouse) = 45-55% MAX (transferable management skills only)
- Front-line Supervisor at non-warehouse (Line Supervisor, Crew Lead, etc.) = 35-50% MAX
- No management experience = 25-35% MAX

KEY DISTINCTION - "Supervisor" vs "Manager":
- A "Line Service Supervisor" at an aviation company = entry-level supervisory, NOT a manager
- A "Shift Supervisor" at fast food = NOT warehouse management
- A "Team Lead" without warehouse context = limited transferability
- These candidates should score HIGHER for Warehouse Picker/Associate roles instead!

TENURE/STABILITY still matters:
- Multiple jobs lasting less than 1 year = RED FLAG, reduce score by 15-20 points
- Consistent 2-3+ year tenure at jobs = POSITIVE, add 10 points
- 5+ years at a single employer = Strong stability indicator

INDUSTRY EXPERIENCE:
- Warehouse, distribution, logistics, tire/automotive = most relevant
- Manufacturing, shipping = moderately relevant
- Retail, food service, aviation services = minimal relevance for management roles

=== ENTRY-LEVEL POSITIONS (Warehouse Associate, Warehouse Picker) ===
These positions are essentially the same role. More flexible on tenure/stability.
These roles are IDEAL for candidates with supervisory experience in OTHER industries who want warehouse work.

SCORING FOR WAREHOUSE ASSOCIATE/PICKER:
- Prior warehouse experience (picker, stocker, receiver, etc.) = 80-95%
- Supervisory experience in OTHER industries (aviation, retail, food service) = 70-85%
  - These candidates have proven leadership and reliability, making them excellent picks!
  - A "Line Service Supervisor" from aviation would be GREAT for picker/associate
- Physical labor jobs (construction, manufacturing, loading) = 60-75%
- Retail/customer service = 50-65%
- No relevant experience = 35-50%

WAREHOUSE PICKER vs ASSOCIATE:
- Warehouse Picker: Looks for ACCURACY and attention to detail
  - Forklift certification/experience = +15 points
  - Order picking, inventory counting, quality control experience = +10 points
  - Data entry, detailed work, inspection roles = +5 points
- Warehouse Associate: More general warehouse duties
  - Physical stamina, reliability, willingness to learn valued

Job hopping is LESS penalized for entry-level positions, but note patterns of very short stints (<6 months).

=== TECHNOLOGY / IT SUPPORT (STRICT REQUIREMENTS) ===
This role requires ACTIVE hands-on technical experience. Look for:
1. CODING EXPERIENCE: Must have actual programming/development work
   - Software Engineer, Developer, Programmer titles = 80-95%
   - Languages mentioned (Python, JavaScript, C#, Java, SQL, etc.) = required for high scores
   - GitHub, portfolio projects, or specific coding accomplishments = bonus points
2. NETWORK/SYSTEMS ADMINISTRATION:
   - Network Admin, Systems Admin, IT Admin, SRE, DevOps = 75-90%
   - Certifications (CCNA, CompTIA Network+, AWS, Azure) = +10 points
   - Server management, Active Directory, cloud infrastructure = valued
3. DIGITAL PROJECT CREATION & DESIGN:
   - Building/designing software systems, websites, applications = 70-85%
   - Database design, API development, system architecture = highly valued
   - SRE (Site Reliability Engineer) experience = 80-90%
4. DISQUALIFIERS (cap score at 40% max):
   - Help desk ONLY experience without coding/admin skills
   - "Tech savvy" or "good with computers" without specific technical work
   - Hardware repair only without software/network experience
   - Just using software (Excel, Word) is NOT IT experience

=== OTHER POSITION GUIDELINES ===
- CDL license = 85-95% for "Delivery Driver (CDL)", CDL-A preferred over CDL-B
- Sales experience = 60-80% for sales roles, higher if B2B or automotive industry

Return ALL ${jobs.length} jobs in the jobMatches array, sorted by score descending.
Return ONLY valid JSON, no markdown code blocks, no other text.`;

    try {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 3000,
        temperature: 0, // Deterministic output for consistency
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : "{}";
      console.log("Claude Response received, length:", responseText.length);

      // Parse the AI response
      let aiResponse;
      try {
        const cleanedResponse = responseText
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        aiResponse = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Failed to parse Claude response:", responseText.substring(0, 500));
        return fallbackAnalysis(resumeText, jobs);
      }

      // Map AI job matches using jobIndex to our actual jobs
      const aiMatches = aiResponse.jobMatches || [];
      console.log(`Claude returned ${aiMatches.length} job matches`);

      // Create a map of AI scores by job index
      const scoreMap = new Map<number, { score: number; keywords: string[]; reasoning: string }>();
      for (const match of aiMatches) {
        const index = Number(match.jobIndex);
        if (index >= 1 && index <= jobs.length) {
          scoreMap.set(index, {
            score: Math.min(100, Math.max(0, Number(match.score) || 0)),
            keywords: match.matchedKeywords || [],
            reasoning: match.reasoning || ""
          });
        }
      }

      // Build final job matches ensuring ALL jobs are included
      const jobMatches = jobs.map((job, index) => {
        const jobIndex = index + 1;
        const aiMatch = scoreMap.get(jobIndex);

        return {
          jobId: job._id,
          jobTitle: job.title,
          score: aiMatch?.score ?? 10, // Default to 10 if AI missed this job
          matchedKeywords: aiMatch?.keywords ?? [],
          reasoning: aiMatch?.reasoning ?? "Limited match based on resume analysis.",
        };
      });

      // Sort by score descending
      jobMatches.sort((a, b) => b.score - a.score);

      // Check for missing fields
      const missingFields: string[] = [];
      if (!aiResponse.firstName && !aiResponse.lastName) missingFields.push("name");
      if (!aiResponse.email) missingFields.push("email");
      if (!aiResponse.phone) missingFields.push("phone");

      // Extract and validate candidate analysis
      const rawAnalysis = aiResponse.candidateAnalysis || {};
      const candidateAnalysis = {
        overallScore: Math.min(100, Math.max(0, Number(rawAnalysis.overallScore) || 50)),
        stabilityScore: Math.min(100, Math.max(0, Number(rawAnalysis.stabilityScore) || 50)),
        experienceScore: Math.min(100, Math.max(0, Number(rawAnalysis.experienceScore) || 50)),
        employmentHistory: (rawAnalysis.employmentHistory || []).map((job: any) => ({
          company: job.company || "Unknown",
          title: job.title || "Unknown",
          duration: job.duration || "Unknown",
          durationMonths: Number(job.durationMonths) || 0,
          startDate: job.startDate,
          endDate: job.endDate,
        })),
        redFlags: (rawAnalysis.redFlags || []).map((flag: any) => ({
          type: flag.type || "inconsistency",
          severity: flag.severity || "low",
          description: flag.description || "",
        })),
        greenFlags: (rawAnalysis.greenFlags || []).map((flag: any) => ({
          type: flag.type || "relevant_experience",
          description: flag.description || "",
        })),
        totalYearsExperience: Number(rawAnalysis.totalYearsExperience) || 0,
        averageTenureMonths: Number(rawAnalysis.averageTenureMonths) || 0,
        longestTenureMonths: Number(rawAnalysis.longestTenureMonths) || 0,
        recommendedAction: rawAnalysis.recommendedAction || "review_carefully",
        hiringTeamNotes: rawAnalysis.hiringTeamNotes || "Manual review recommended.",
      };

      return {
        firstName: aiResponse.firstName || "",
        lastName: aiResponse.lastName || "",
        email: aiResponse.email || "",
        phone: aiResponse.phone || "",
        extractedSkills: aiResponse.extractedSkills || [],
        summary: aiResponse.summary || "Resume analyzed successfully.",
        jobMatches,
        missingFields,
        candidateAnalysis,
      };
    } catch (error: any) {
      console.error("Anthropic API error:", error?.message || error);
      return fallbackAnalysis(resumeText, jobs);
    }
  },
});

// Fallback analysis without AI (basic regex extraction)
function fallbackAnalysis(resumeText: string, jobs: any[]) {
  // Extract contact information using regex patterns
  const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = resumeText.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

  // Try to extract name
  const lines = resumeText.split('\n').filter(line => line.trim());
  let firstName = "";
  let lastName = "";

  for (const line of lines.slice(0, 5)) {
    const cleaned = line.trim();
    if (cleaned.includes('@') || cleaned.match(/^\d/) || cleaned.length > 50) continue;

    const nameParts = cleaned.split(/\s+/).filter(p =>
      p.length > 1 &&
      !p.includes('@') &&
      !p.match(/^\d/) &&
      p.match(/^[A-Za-z'-]+$/)
    );

    if (nameParts.length >= 2) {
      firstName = nameParts[0];
      lastName = nameParts[nameParts.length - 1];
      break;
    }
  }

  // Basic keyword matching as fallback
  const jobMatches = jobs.map(job => ({
    jobId: job._id,
    jobTitle: job.title,
    score: 25, // Default low score for fallback
    matchedKeywords: [],
    reasoning: "AI analysis unavailable - manual review recommended.",
  }));

  const missingFields: string[] = [];
  if (!firstName || !lastName) missingFields.push("name");
  if (!emailMatch) missingFields.push("email");
  if (!phoneMatch) missingFields.push("phone");

  // Default candidate analysis for fallback
  const candidateAnalysis = {
    overallScore: 50,
    stabilityScore: 50,
    experienceScore: 50,
    employmentHistory: [],
    redFlags: [{
      type: "inconsistency" as const,
      severity: "low" as const,
      description: "AI analysis unavailable - manual review required",
    }],
    greenFlags: [],
    totalYearsExperience: 0,
    averageTenureMonths: 0,
    longestTenureMonths: 0,
    recommendedAction: "review_carefully" as const,
    hiringTeamNotes: "AI analysis was unavailable for this resume. Please review manually and extract employment history.",
  };

  return {
    firstName,
    lastName,
    email: emailMatch?.[0] || "",
    phone: phoneMatch?.[0] || "",
    extractedSkills: [],
    summary: "Basic resume analysis (AI unavailable). Please review manually.",
    jobMatches,
    missingFields,
    candidateAnalysis,
  };
}
