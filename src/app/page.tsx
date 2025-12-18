"use client";

import { motion, useScroll, useTransform, useSpring, MotionValue, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Truck,
  Shield,
  Users,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  Send,
  Briefcase,
  DollarSign,
  Award,
  Package,
  CheckCircle2,
  Upload,
  FileText,
  Sparkles,
  Loader2,
  AlertCircle,
  ArrowUp,
} from "lucide-react";

// 3D Tire SVG Component for Return to Top button
const Tire3D = ({ className = "", spinning = false }: { className?: string; spinning?: boolean }) => (
  <motion.svg
    viewBox="0 0 100 100"
    className={className}
    animate={spinning ? { rotateY: 360 } : {}}
    transition={spinning ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
    style={{ transformStyle: "preserve-3d" }}
  >
    {/* Outer tire ring */}
    <ellipse cx="50" cy="50" rx="45" ry="45" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
    {/* Tire tread pattern - outer ring */}
    <ellipse cx="50" cy="50" rx="42" ry="42" fill="none" stroke="#2a2a2a" strokeWidth="6" strokeDasharray="8 4" />
    {/* Sidewall */}
    <ellipse cx="50" cy="50" rx="35" ry="35" fill="#252525" stroke="#333" strokeWidth="1" />
    {/* Rim outer */}
    <ellipse cx="50" cy="50" rx="28" ry="28" fill="#666" stroke="#888" strokeWidth="2" />
    {/* Rim inner - metallic */}
    <ellipse cx="50" cy="50" rx="24" ry="24" fill="url(#rimGradient)" />
    {/* Rim spokes */}
    {[0, 72, 144, 216, 288].map((angle, i) => (
      <motion.line
        key={i}
        x1="50"
        y1="50"
        x2={50 + 22 * Math.cos((angle * Math.PI) / 180)}
        y2={50 + 22 * Math.sin((angle * Math.PI) / 180)}
        stroke="#888"
        strokeWidth="4"
        strokeLinecap="round"
      />
    ))}
    {/* Center hub */}
    <circle cx="50" cy="50" r="8" fill="#444" stroke="#666" strokeWidth="2" />
    {/* Center cap */}
    <circle cx="50" cy="50" r="5" fill="#555" />
    {/* Gradient definitions */}
    <defs>
      <radialGradient id="rimGradient" cx="40%" cy="40%">
        <stop offset="0%" stopColor="#999" />
        <stop offset="50%" stopColor="#666" />
        <stop offset="100%" stopColor="#444" />
      </radialGradient>
    </defs>
  </motion.svg>
);

const brands = [
  { name: "Falken", tier: "premium", logo: "/images/brands/falken.svg" },
  { name: "Kenda", tier: "premium", logo: "/images/brands/kenda.webp" },
  { name: "Atturo", tier: "premium", logo: "/images/brands/atturo.webp" },
  { name: "Milestar", tier: "performance", logo: "/images/brands/milestar.webp" },
  { name: "Lionhart", tier: "performance", logo: "/images/brands/lionhart.webp" },
  { name: "American Roadstar", tier: "performance", logo: "/images/brands/american-roadstar.webp" },
  { name: "RBP", tier: "value", logo: "/images/brands/rbp.webp" },
  { name: "Lancaster", tier: "value", logo: "/images/brands/lancaster.png" },
];

const jobs = [
  {
    id: 1,
    title: "Warehouse Associate",
    location: "Latrobe, PA",
    type: "Full-time",
    department: "Operations",
    status: "accepting", // "accepting" | "open" | "closed"
    description: "Load/unload trucks, organize inventory, and ensure accurate order fulfillment in our tire distribution warehouse.",
    benefits: ["Competitive hourly pay", "Health insurance", "401(k)", "Paid time off"],
    keywords: ["warehouse", "inventory", "forklift", "shipping", "receiving", "logistics", "labor"],
  },
  {
    id: 2,
    title: "Warehouse Picker",
    location: "Latrobe & Uniontown, PA",
    type: "Full-time",
    department: "Operations",
    status: "accepting",
    description: "Pick and prepare tire orders for shipment. Operate pallet jacks and ensure order accuracy in a fast-paced environment.",
    benefits: ["Competitive hourly pay", "Health insurance", "401(k)", "Paid time off"],
    keywords: ["picker", "warehouse", "orders", "pallet", "shipping", "fulfillment"],
  },
  {
    id: 3,
    title: "Inventory Specialist",
    location: "Latrobe, PA",
    type: "Full-time",
    department: "Operations",
    status: "accepting",
    description: "Manage inventory counts, track stock levels, coordinate with purchasing, and maintain accurate inventory records.",
    benefits: ["Competitive salary", "Health insurance", "401(k)", "Growth opportunity"],
    keywords: ["inventory", "counting", "stock", "tracking", "data entry", "organization"],
  },
  {
    id: 4,
    title: "Warehouse Management",
    location: "Latrobe & Uniontown, PA",
    type: "Full-time",
    department: "Management",
    status: "accepting",
    description: "Supervise warehouse team, optimize operations, manage scheduling, and ensure safety compliance. 3+ years experience required.",
    benefits: ["Competitive salary", "Full benefits", "401(k) match", "Leadership role"],
    keywords: ["management", "supervisor", "leadership", "operations", "team", "scheduling"],
  },
  {
    id: 5,
    title: "Shift Supervisor",
    location: "Latrobe & Uniontown, PA",
    type: "Full-time",
    department: "Management",
    status: "accepting",
    description: "Lead warehouse team during assigned shift. Coordinate daily operations, handle issues, and maintain productivity standards.",
    benefits: ["Competitive salary", "Health insurance", "401(k)", "Advancement opportunity"],
    keywords: ["supervisor", "shift", "leadership", "team lead", "operations"],
  },
  {
    id: 6,
    title: "Delivery Driver (CDL)",
    location: "Latrobe & Uniontown, PA",
    type: "Full-time",
    department: "Operations",
    status: "accepting",
    description: "Deliver tires to wholesale customers throughout Western PA. CDL Class A or B required.",
    benefits: ["Top driver pay", "Home daily", "Full benefits", "Newer equipment"],
    keywords: ["cdl", "driver", "delivery", "trucking", "transportation", "commercial"],
  },
  {
    id: 7,
    title: "Inside Sales Representative",
    location: "Uniontown, PA",
    type: "Full-time",
    department: "Sales",
    status: "accepting",
    description: "Build relationships with wholesale accounts, process orders, and provide excellent customer service to our B2B clients.",
    benefits: ["Base + commission", "Growth opportunity", "Health benefits", "Professional environment"],
    keywords: ["sales", "customer service", "b2b", "account", "retail", "phone"],
  },
  {
    id: 8,
    title: "Technology / IT Support",
    location: "Latrobe, PA",
    type: "Full-time",
    department: "Technology",
    status: "accepting",
    description: "Support IT infrastructure, troubleshoot hardware/software issues, maintain inventory systems, and assist with technology projects.",
    benefits: ["Competitive salary", "Full benefits", "Professional development", "Modern tech stack"],
    keywords: ["it", "technology", "computer", "software", "hardware", "support", "helpdesk", "network"],
  },
  {
    id: 9,
    title: "Administrative Assistant",
    location: "Latrobe, PA",
    type: "Full-time",
    department: "Administration",
    status: "accepting",
    description: "Provide administrative support, manage schedules, handle correspondence, and assist with office operations.",
    benefits: ["Competitive salary", "Health insurance", "401(k)", "Professional environment"],
    keywords: ["admin", "administrative", "office", "clerical", "assistant", "organization", "scheduling"],
  },
];

// Hook for parallax effect
function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

// 3D Card component with mouse tracking
function Card3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    setRotateX(-mouseY / 20);
    setRotateY(mouseX / 20);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeJob, setActiveJob] = useState<string | null>(null);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [showReturnToTop, setShowReturnToTop] = useState(false);

  // Track scroll position for return to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowReturnToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Convex queries and mutations
  const convexJobs = useQuery(api.jobs.getActiveJobs);
  const submitApplication = useMutation(api.applications.submitApplication);
  const analyzeResume = useAction(api.aiMatching.analyzeResume);

  // Resume parsing state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    summary: string;
    extractedSkills: string[];
    jobMatches: Array<{
      jobId: string;
      jobTitle: string;
      score: number;
      matchedKeywords: string[];
      reasoning: string;
    }>;
    missingFields: string[];
    candidateAnalysis: {
      overallScore: number;
      stabilityScore: number;
      experienceScore: number;
      employmentHistory: Array<{
        company: string;
        title: string;
        duration: string;
        durationMonths: number;
        startDate?: string;
        endDate?: string;
      }>;
      redFlags: Array<{
        type: string;
        severity: string;
        description: string;
      }>;
      greenFlags: Array<{
        type: string;
        description: string;
      }>;
      totalYearsExperience: number;
      averageTenureMonths: number;
      longestTenureMonths: number;
      recommendedAction: string;
      hiringTeamNotes: string;
    };
  } | null>(null);

  // Selected job for application
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("");

  // Manual input for missing fields
  const [manualInput, setManualInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Scroll tracking for parallax
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Parallax values
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, -100]);
  const heroRotate = useTransform(smoothProgress, [0, 0.2], [0, -2]);
  const statsY = useTransform(smoothProgress, [0, 0.3], [0, -50]);
  const statsRotateX = useTransform(smoothProgress, [0, 0.3], [0, 5]);

  // Background layer parallax
  const bgLayerY = useTransform(smoothProgress, [0, 0.5], [0, 200]);

  // Floating orb parallax
  const orb1Y = useTransform(smoothProgress, [0, 0.5], [0, 150]);
  const orb1Scale = useTransform(smoothProgress, [0, 0.3], [1, 0.8]);
  const orb2Y = useTransform(smoothProgress, [0, 0.5], [0, 100]);
  const orb2X = useTransform(smoothProgress, [0, 0.5], [0, -50]);

  // Floating tire silhouette parallax values
  const tire1Y = useTransform(smoothProgress, [0, 0.5], [0, 50]);
  const tire1Rotate = useTransform(smoothProgress, [0, 1], [0, 45]);
  const tire2Y = useTransform(smoothProgress, [0, 0.5], [0, 120]);
  const tire2X = useTransform(smoothProgress, [0, 0.5], [0, -30]);
  const tire2Rotate = useTransform(smoothProgress, [0, 1], [0, -90]);
  const tire3Y = useTransform(smoothProgress, [0, 0.5], [0, 200]);
  const tire3Rotate = useTransform(smoothProgress, [0, 1], [0, 180]);
  const tire3Scale = useTransform(smoothProgress, [0, 0.3], [1, 1.1]);
  const tire4Y = useTransform(smoothProgress, [0, 0.5], [0, 250]);
  const tire4X = useTransform(smoothProgress, [0, 0.5], [0, 50]);
  const tire4Rotate = useTransform(smoothProgress, [0, 1], [0, -270]);

  // Stats section parallax
  const statsSectionY = useTransform(smoothProgress, [0.2, 0.5], [100, 0]);

  const scrollToSection = (id: string, center: boolean = false) => {
    const element = document.getElementById(id);
    if (element) {
      if (center) {
        // Scroll to center the element on screen
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 4);
        window.scrollTo({
          top: middle,
          behavior: "smooth"
        });
      } else {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  // Handle hash on initial load (for /careers redirect)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      setTimeout(() => {
        scrollToSection(hash, true);
      }, 300);
    }
  }, []);

  // Extract text from uploaded file
  const extractTextFromFile = async (file: File): Promise<string> => {
    // For TXT files, read directly
    if (file.type === "text/plain") {
      return await file.text();
    }

    // For PDF files, use server-side API route
    if (file.type === "application/pdf") {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to parse PDF');
        }

        const data = await response.json();
        const rawText = data.text || '';
        const result = typeof rawText === 'string' ? rawText.trim() : String(rawText);

        console.log("Extracted PDF text:", result.substring(0, 500));

        if (result.length < 50) {
          throw new Error("Could not extract text from PDF. The PDF may be image-based or protected.");
        }

        return result;
      } catch (error: any) {
        console.error("Error parsing PDF:", error);
        throw new Error(error.message || "Failed to parse PDF. Please try a different file format.");
      }
    }

    // For Word docs (.docx), we need a different approach
    // For now, show an error for unsupported formats
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword") {
      throw new Error("Word documents are not yet supported. Please upload a PDF or TXT file.");
    }

    // Fallback - try to read as text
    return await file.text();
  };

  // AI resume parsing using Convex action
  const parseResume = async (file: File) => {
    setIsParsing(true);
    setSubmitError(null);

    try {
      // Extract text from file
      const text = await extractTextFromFile(file);
      setResumeText(text);

      // Call Convex AI action for analysis
      const result = await analyzeResume({ resumeText: text });

      setParsedData(result);

      // Pre-fill manual input with detected values
      setManualInput({
        firstName: result.firstName || "",
        lastName: result.lastName || "",
        email: result.email || "",
        phone: result.phone || "",
      });

      // Auto-select the best matching job
      if (result.jobMatches.length > 0) {
        setSelectedJobId(result.jobMatches[0].jobId);
        setSelectedJobTitle(result.jobMatches[0].jobTitle);
      }
    } catch (error) {
      console.error("Error parsing resume:", error);
      setSubmitError("Failed to analyze resume. Please try again.");
    }

    setIsParsing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setSubmitSuccess(false);
      parseResume(file);
    }
  };

  // Submit application to Convex
  const handleSubmitApplication = async () => {
    if (!parsedData || !selectedJobTitle) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Use manual input if provided, otherwise use parsed data
      const firstName = manualInput.firstName || parsedData.firstName;
      const lastName = manualInput.lastName || parsedData.lastName;
      const email = manualInput.email || parsedData.email;
      const phone = manualInput.phone || parsedData.phone;

      // Validate required fields
      if (!firstName || !lastName || !email || !phone) {
        setSubmitError("Please fill in all required fields.");
        setIsSubmitting(false);
        return;
      }

      // Submit to Convex
      await submitApplication({
        firstName,
        lastName,
        email,
        phone,
        resumeText,
        appliedJobId: selectedJobId as Id<"jobs"> | undefined,
        appliedJobTitle: selectedJobTitle,
        aiAnalysis: {
          suggestedJobId: parsedData.jobMatches[0]?.jobId as Id<"jobs"> | undefined,
          suggestedJobTitle: parsedData.jobMatches[0]?.jobTitle,
          matchScore: parsedData.jobMatches[0]?.score || 0,
          allScores: parsedData.jobMatches.map(m => ({
            jobId: m.jobId as Id<"jobs">,
            jobTitle: m.jobTitle,
            score: m.score,
            matchedKeywords: m.matchedKeywords,
            reasoning: m.reasoning,
          })),
          extractedSkills: parsedData.extractedSkills,
          summary: parsedData.summary,
        },
        candidateAnalysis: parsedData.candidateAnalysis,
      });

      setSubmitSuccess(true);
      // Scroll to the careers section header (which contains the success message)
      setTimeout(() => {
        const careersSection = document.getElementById("careers");
        if (careersSection) {
          const elementRect = careersSection.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          const middle = absoluteElementTop - 100; // 100px from top of viewport
          window.scrollTo({
            top: middle,
            behavior: "smooth"
          });
        }
      }, 100);
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmitError("Failed to submit application. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 overflow-x-hidden" style={{ perspective: "1000px" }}>
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <img
                src="/images/logo.gif"
                alt="Import Export Tire"
                className="h-10 w-auto"
              />
              <div className="hidden sm:block">
                <span className="font-semibold text-white">Import Export</span>
                <span className="text-slate-400 ml-1">Tire</span>
              </div>
            </motion.div>

            <div className="hidden md:flex items-center gap-1">
              {["About", "Brands", "Services", "Careers", "Contact"].map((item, i) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
                >
                  {item}
                </motion.button>
              ))}
              <motion.a
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                href="https://b2b.ietires.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-red-500/30 flex items-center gap-2"
              >
                <Users size={18} />
                Dealer Login
              </motion.a>
            </div>

            <button
              className="md:hidden text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-slate-900 border-t border-slate-800"
          >
            <div className="px-4 py-3 space-y-1">
              {["About", "Brands", "Services", "Careers", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {item}
                </button>
              ))}
              <a
                href="https://b2b.ietires.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold mt-3"
              >
                <Users size={18} />
                Dealer Login
              </a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main>
      {/* Hero Section with Enhanced 3D Parallax */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden" aria-label="Hero">
        {/* Animated background layers */}
        <motion.div
          style={{ y: bgLayerY }}
          className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
        />

        {/* Floating orbs with depth */}
        <motion.div
          style={{
            y: orb1Y,
            scale: orb1Scale,
          }}
          className="absolute top-20 right-10 w-72 h-72 bg-red-500/10 rounded-full blur-[100px]"
        />
        <motion.div
          style={{
            y: orb2Y,
            x: orb2X,
          }}
          className="absolute bottom-40 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]"
        />

        {/* ENHANCED: Floating tire silhouettes at different depths - hidden on mobile for performance */}
        {/* Far background tire - very slow parallax */}
        <motion.div
          style={{
            y: tire1Y,
            rotate: tire1Rotate,
          }}
          className="hidden md:block absolute -top-20 -right-40 w-[600px] h-[600px] opacity-[0.03]"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="8" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="4" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="6" />
          </svg>
        </motion.div>

        {/* Mid-ground tire - medium parallax */}
        <motion.div
          style={{
            y: tire2Y,
            x: tire2X,
            rotate: tire2Rotate,
          }}
          className="hidden md:block absolute top-1/3 -left-32 w-[400px] h-[400px] opacity-[0.04]"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="10" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="3" strokeDasharray="8 4" />
            <circle cx="50" cy="50" r="18" fill="none" stroke="white" strokeWidth="5" />
          </svg>
        </motion.div>

        {/* Foreground tire - fast parallax */}
        <motion.div
          style={{
            y: tire3Y,
            rotate: tire3Rotate,
            scale: tire3Scale,
          }}
          className="hidden md:block absolute -bottom-40 right-1/4 w-[300px] h-[300px] opacity-[0.06]"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="12" />
            <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="white" strokeWidth="4" />
            {/* Tread marks - pre-calculated to avoid hydration mismatch */}
            <line x1="88" y1="50" x2="95" y2="50" stroke="white" strokeWidth="3" />
            <line x1="83" y1="69" x2="89" y2="72.5" stroke="white" strokeWidth="3" />
            <line x1="69" y1="83" x2="72.5" y2="89" stroke="white" strokeWidth="3" />
            <line x1="50" y1="88" x2="50" y2="95" stroke="white" strokeWidth="3" />
            <line x1="31" y1="83" x2="27.5" y2="89" stroke="white" strokeWidth="3" />
            <line x1="17" y1="69" x2="11" y2="72.5" stroke="white" strokeWidth="3" />
            <line x1="12" y1="50" x2="5" y2="50" stroke="white" strokeWidth="3" />
            <line x1="17" y1="31" x2="11" y2="27.5" stroke="white" strokeWidth="3" />
            <line x1="31" y1="17" x2="27.5" y2="11" stroke="white" strokeWidth="3" />
            <line x1="50" y1="12" x2="50" y2="5" stroke="white" strokeWidth="3" />
            <line x1="69" y1="17" x2="72.5" y2="11" stroke="white" strokeWidth="3" />
            <line x1="83" y1="31" x2="89" y2="27.5" stroke="white" strokeWidth="3" />
          </svg>
        </motion.div>

        {/* Small accent tire - extra fast */}
        <motion.div
          style={{
            y: tire4Y,
            x: tire4X,
            rotate: tire4Rotate,
          }}
          className="hidden md:block absolute top-1/4 right-20 w-[150px] h-[150px] opacity-[0.08]"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#ef4444" strokeWidth="8" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="#ef4444" strokeWidth="3" />
          </svg>
        </motion.div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left content with parallax */}
            <motion.div
              style={{ y: heroY, rotateZ: heroRotate }}
              className="origin-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Wholesale Tire Distribution
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
                  Western PA&apos;s Trusted
                  <motion.span
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Wholesale Tire
                  </motion.span>
                  Distributor
                </h1>

                <motion.p
                  className="text-base sm:text-lg text-slate-400 mb-6 sm:mb-8 max-w-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Competitive wholesale pricing, 50+ premium brands, and reliable
                  delivery to keep your business rolling. Over 1,000 dealers trust
                  Import Export Tire.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="bg-red-600 hover:bg-red-500 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all hover:shadow-lg hover:shadow-red-500/25 hover:scale-105 flex items-center justify-center gap-2 group min-h-[48px]"
                  >
                    Open Wholesale Account
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => scrollToSection("brands")}
                    className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    View Brands
                  </button>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                  className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 sm:mt-10 pt-6 sm:pt-10 border-t border-slate-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {[
                    "Same-day availability",
                    "Net terms available",
                    "No minimums"
                  ].map((text, i) => (
                    <motion.div
                      key={text}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                      <span className="text-slate-400 text-xs sm:text-sm">{text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Stats Card with 3D effect */}
            <motion.div
              style={{ y: statsY, rotateX: statsRotateX }}
              className="relative"
            >
              <Card3D className="cursor-default">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-700/50 shadow-2xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="grid grid-cols-2 gap-3 sm:gap-6">
                    {[
                      { value: "50+", label: "Years in Business", icon: Award },
                      { value: "1000+", label: "Active Dealers", icon: Users },
                      { value: "50+", label: "Tire Brands", icon: Package },
                      { value: "2", label: "PA Locations", icon: MapPin },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30, rotateX: -20 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        whileHover={{ scale: 1.05, z: 20 }}
                        className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-800/50 border border-slate-700/30 transition-all"
                        style={{ transform: "translateZ(20px)" }}
                      >
                        <stat.icon size={20} className="mx-auto mb-2 sm:mb-3 text-red-500 sm:w-6 sm:h-6" />
                        <div className="text-2xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">{stat.value}</div>
                        <div className="text-slate-500 text-xs sm:text-sm">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="mt-4 sm:mt-8 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-red-500/10 border border-red-500/20"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <p className="text-center text-red-400 font-medium text-sm sm:text-base">
                      Family-owned & operated for 50+ years
                    </p>
                  </motion.div>
                </motion.div>
              </Card3D>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
              >
                Open Mon-Fri
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <button
            onClick={() => scrollToSection("about")}
            className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-400 transition-colors"
          >
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown size={20} />
            </motion.div>
          </button>
        </motion.div>
      </section>

      {/* About Section with 3D cards */}
      <section id="about" className="py-16 sm:py-24 relative bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50, rotateY: 10 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">About Us</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-3 mb-4 sm:mb-6">
                A Legacy of Wholesale Excellence in Western PA
              </h2>
              <div className="space-y-4 text-slate-400">
                <p>
                  For over five decades, Import Export Tire has been the backbone of tire
                  retail in Western Pennsylvania. We understand the wholesale business because
                  we&apos;ve lived it—through economic ups and downs, industry changes, and the
                  evolving needs of our dealer partners.
                </p>
                <p>
                  Our mission is simple: provide the inventory you need, at prices that let
                  you compete, with service that makes your job easier. No corporate
                  bureaucracy, just real people who pick up the phone and solve problems.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {[
                  { icon: Shield, title: "Quality Guaranteed", desc: "Only authentic, warrantied products" },
                  { icon: Truck, title: "Fast Delivery", desc: "Scheduled routes throughout Western PA" },
                  { icon: TrendingUp, title: "Competitive Pricing", desc: "Volume discounts that add up" },
                  { icon: Users, title: "Personal Service", desc: "Your dedicated account rep" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, rotateX: -10 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02, rotateY: 5 }}
                    className="flex gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                      <item.icon size={20} className="text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <Card3D>
                <div className="aspect-[4/3] rounded-2xl border border-slate-700/50 overflow-hidden relative">
                  <img
                    src="/images/team.jpeg"
                    alt="Import Export Tire team"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-semibold text-lg">Our Team</p>
                    <p className="text-slate-300 text-sm">Dedicated to your success</p>
                  </div>
                </div>
              </Card3D>

              {/* Floating accent card */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-6 -left-6 bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                    <Award size={24} className="text-red-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-slate-500 text-sm">Years of Excellence</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brands Section with 3D hover */}
      <section id="brands" className="py-16 sm:py-24 relative overflow-hidden">
        <motion.div
          style={{ y: statsSectionY }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">Our Brands</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-3 mb-3 sm:mb-4">
              Premium Tire Brands at Wholesale Prices
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From premium OE-quality tires to value-driven options, we stock the brands
              your customers ask for. All backed by full manufacturer warranties.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {brands.map((brand, i) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 10,
                  z: 50,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="group relative bg-slate-800/30 hover:bg-slate-800/60 border border-slate-800 hover:border-red-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-300 cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex flex-col items-center gap-2 sm:gap-3">
                  <div className="h-12 sm:h-14 w-full flex items-center justify-center px-2 sm:px-3 bg-white/90 rounded-lg">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-8 sm:max-h-10 w-auto object-contain"
                    />
                  </div>
                  <span className={`text-[10px] sm:text-xs uppercase tracking-wider px-2 py-0.5 sm:py-1 rounded-full ${
                    brand.tier === 'premium'
                      ? 'bg-amber-500/10 text-amber-500'
                      : brand.tier === 'performance'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-green-500/10 text-green-500'
                  }`}>
                    {brand.tier}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-slate-500 mb-4">
              + Dozens more brands in stock. Contact us for specific availability.
            </p>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-red-500 hover:text-red-400 font-medium inline-flex items-center gap-2 transition-colors"
            >
              Request Full Brand List
              <ChevronRight size={18} />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-24 relative bg-slate-900/50">
        {/* Warehouse image background */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <img
            src="/images/warehouse.webp"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">Services</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-3 mb-3 sm:mb-4">
              Everything Your Tire Business Needs
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We&apos;re more than a supplier—we&apos;re a partner in your success.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Truck, title: "Scheduled Delivery", description: "Regular delivery routes throughout Western PA. We keep your inventory stocked so you never miss a sale." },
              { icon: DollarSign, title: "Wholesale Pricing", description: "Competitive pricing designed to protect your margins. Volume discounts that actually make a difference." },
              { icon: Award, title: "50+ Brands", description: "Premium, performance, and value tires. Whatever your customers need, we have it in stock." },
              { icon: Users, title: "Account Management", description: "A dedicated rep who knows your business. Quick answers, expert recommendations, real support." },
              { icon: Package, title: "Huge Inventory", description: "Over 100,000 tires in stock. If we have it listed, it's ready to ship today." },
              { icon: TrendingUp, title: "Flexible Terms", description: "Net terms available for qualified accounts. Payment options that work with your cash flow." },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, rotateY: 5, z: 20 }}
                className="bg-slate-800/30 border border-slate-800 rounded-xl p-5 sm:p-6 hover:border-red-500/30 transition-all group cursor-default"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-red-500/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-red-500/20 transition-colors"
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.5 }}
                >
                  <service.icon size={20} className="text-red-500 sm:w-6 sm:h-6" />
                </motion.div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers Section with AI Resume Upload */}
      <section id="careers" className="py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">Careers</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-3 mb-3 sm:mb-4">
              Join the IE Tire Team
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We&apos;re a family business that treats employees like family. Good pay,
              real benefits, and a team that has your back.
            </p>
          </motion.div>

          {/* Success Message */}
          {submitSuccess && (
            <motion.div
              id="application-success"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6 text-center">
                <CheckCircle2 className="mx-auto text-green-500 mb-3" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">Application Submitted!</h3>
                <p className="text-slate-400">
                  Thank you for applying to {selectedJobTitle}. We&apos;ll review your application and be in touch soon.
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 1: AI Resume Upload - Primary CTA */}
          {!submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto mb-8 sm:mb-12"
            >
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                  <Sparkles className="text-amber-500" size={20} />
                  <span className="text-amber-500 font-semibold text-sm sm:text-base">AI-Powered Application</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Start with Your Resume</h3>
                <p className="text-slate-400 text-sm sm:text-base mb-4 sm:mb-6">
                  Upload your resume and our AI will extract your information and match you to the best positions.
                </p>

                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer block"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-xl border-2 border-dashed transition-all ${
                      isParsing
                        ? 'border-red-500 bg-red-500/10'
                        : resumeFile && parsedData
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-slate-600 hover:border-red-500/50 bg-slate-800/50'
                    }`}
                  >
                    {isParsing ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 size={40} className="text-red-500 animate-spin" />
                        <span className="text-white font-medium">Analyzing your resume...</span>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          Extracting contact info, skills, and matching to jobs
                        </div>
                      </div>
                    ) : resumeFile && parsedData ? (
                      <div className="flex flex-col items-center gap-3">
                        <FileText size={40} className="text-green-500" />
                        <span className="text-white font-medium">{resumeFile.name}</span>
                        <span className="text-green-400 text-sm flex items-center gap-1">
                          <CheckCircle2 size={16} />
                          Resume analyzed - scroll down to review matches
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Upload size={40} className="text-slate-400" />
                        <span className="text-white font-medium">Drop your resume here or click to browse</span>
                        <span className="text-slate-500 text-sm">Supports PDF, DOC, DOCX, TXT</span>
                      </div>
                    )}
                  </motion.div>
                </label>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto mb-6"
            >
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="text-red-500 shrink-0" size={20} />
                <span className="text-red-400">{submitError}</span>
              </div>
            </motion.div>
          )}

          {/* AI Analysis Results */}
          {parsedData && !submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="text-green-500" size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">AI Analysis Complete</h4>
                      <p className="text-slate-400 text-sm">Review your information and select a position</p>
                    </div>
                  </div>
                </div>

                {/* Applicant Information - Always Editable */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <label className="text-slate-400 text-xs uppercase block mb-2">First Name *</label>
                    <input
                      type="text"
                      value={manualInput.firstName}
                      onChange={(e) => setManualInput({ ...manualInput, firstName: e.target.value })}
                      placeholder="First name"
                      className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 transition-colors ${
                        !manualInput.firstName ? 'border-amber-500/50' : 'border-slate-700'
                      }`}
                    />
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <label className="text-slate-400 text-xs uppercase block mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={manualInput.lastName}
                      onChange={(e) => setManualInput({ ...manualInput, lastName: e.target.value })}
                      placeholder="Last name"
                      className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 transition-colors ${
                        !manualInput.lastName ? 'border-amber-500/50' : 'border-slate-700'
                      }`}
                    />
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <label className="text-slate-400 text-xs uppercase block mb-2">Email *</label>
                    <input
                      type="email"
                      value={manualInput.email}
                      onChange={(e) => setManualInput({ ...manualInput, email: e.target.value })}
                      placeholder="email@example.com"
                      className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 transition-colors ${
                        !manualInput.email ? 'border-amber-500/50' : 'border-slate-700'
                      }`}
                    />
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <label className="text-slate-400 text-xs uppercase block mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={manualInput.phone}
                      onChange={(e) => setManualInput({ ...manualInput, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 transition-colors ${
                        !manualInput.phone ? 'border-amber-500/50' : 'border-slate-700'
                      }`}
                    />
                  </div>
                </div>

                {/* Skills & Summary */}
                {(parsedData.extractedSkills.length > 0 || parsedData.summary) && (
                  <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                    {parsedData.summary && (
                      <div className="mb-4">
                        <span className="text-slate-400 text-xs uppercase block mb-2">AI Summary</span>
                        <p className="text-slate-300 text-sm">{parsedData.summary}</p>
                      </div>
                    )}
                    {parsedData.extractedSkills.length > 0 && (
                      <div>
                        <span className="text-slate-400 text-xs uppercase block mb-2">Detected Skills</span>
                        <div className="flex flex-wrap gap-2">
                          {parsedData.extractedSkills.map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Missing Fields Warning */}
                {(!manualInput.firstName || !manualInput.lastName || !manualInput.email || !manualInput.phone) && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-6">
                    <div className="flex items-center gap-2 text-amber-400 text-sm">
                      <AlertCircle size={16} />
                      <span>Please complete all required fields marked with *</span>
                    </div>
                  </div>
                )}

                {/* Job Matches */}
                <h5 className="text-white font-semibold mb-4">Job Matches (select one to apply)</h5>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {parsedData.jobMatches.slice(0, 6).map((match, i) => (
                    <motion.button
                      key={match.jobId}
                      onClick={() => {
                        setSelectedJobId(match.jobId);
                        setSelectedJobTitle(match.jobTitle);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        selectedJobId === match.jobId
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-lg font-bold ${
                          match.score >= 70 ? 'text-green-400' :
                          match.score >= 40 ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          {match.score}%
                        </span>
                        {i === 0 && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                            Best Match
                          </span>
                        )}
                        {selectedJobId === match.jobId && (
                          <CheckCircle2 size={16} className="text-red-500" />
                        )}
                      </div>
                      <h6 className="text-white font-medium text-sm">{match.jobTitle}</h6>
                      {match.reasoning && (
                        <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                          {match.reasoning}
                        </p>
                      )}
                      {match.matchedKeywords.length > 0 && (
                        <p className="text-slate-500 text-xs mt-1">
                          Skills: {match.matchedKeywords.slice(0, 3).join(', ')}
                        </p>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Submit Button */}
                <motion.button
                  onClick={handleSubmitApplication}
                  disabled={!selectedJobId || isSubmitting}
                  whileHover={{ scale: selectedJobId && !isSubmitting ? 1.02 : 1 }}
                  whileTap={{ scale: selectedJobId && !isSubmitting ? 0.98 : 1 }}
                  className={`w-full mt-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    selectedJobId && !isSubmitting
                      ? 'bg-red-600 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25'
                      : 'bg-slate-700 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {selectedJobTitle ? `Apply for ${selectedJobTitle}` : 'Select a position above'}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Available Positions (shown before resume upload) */}
          {!parsedData && !submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
                Available Positions
              </h3>

              {/* Department filters */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {['All', 'Operations', 'Management', 'Sales', 'Technology', 'Administration'].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setActiveJob(dept === 'All' ? null : dept)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      (dept === 'All' && activeJob === null) || activeJob === dept
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(convexJobs || jobs)
                  .filter((job: any) => !activeJob || activeJob === null || job.department === activeJob)
                  .map((job: any, i: number) => {
                    const jobId = job._id || job.id || `job-${i}`;
                    const isExpanded = expandedJobId === jobId;
                    const effectiveBadgeType = job.badgeType || (job.urgentHiring ? 'urgently_hiring' : 'open_position');

                    // Generate JobPosting structured data
                    const jobPostingSchema = {
                      "@context": "https://schema.org",
                      "@type": "JobPosting",
                      "title": job.title,
                      "description": job.description,
                      "datePosted": job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                      "hiringOrganization": {
                        "@type": "Organization",
                        "name": "IE Tire",
                        "sameAs": "https://www.ietires.com",
                        "logo": "https://www.ietires.com/logo.png"
                      },
                      "jobLocation": {
                        "@type": "Place",
                        "address": {
                          "@type": "PostalAddress",
                          "addressLocality": job.location?.split(',')[0]?.trim() || "Latrobe",
                          "addressRegion": job.location?.split(',')[1]?.trim() || "PA",
                          "addressCountry": "US"
                        }
                      },
                      "employmentType": job.type === "Full-time" ? "FULL_TIME" : job.type === "Part-time" ? "PART_TIME" : "FULL_TIME",
                      "industry": "Wholesale Tire Distribution",
                      "occupationalCategory": job.department || "Operations"
                    };

                    return (
                      <motion.div
                        key={jobId}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        layout
                        className="relative bg-slate-800/30 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all overflow-hidden cursor-pointer"
                        onClick={() => setExpandedJobId(isExpanded ? null : jobId)}
                      >
                        {/* JSON-LD Structured Data */}
                        <script
                          type="application/ld+json"
                          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
                        />

                        {/* Status Ribbon - supports both badgeType and legacy urgentHiring field */}
                        <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold ${
                          effectiveBadgeType === 'urgently_hiring'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : effectiveBadgeType === 'accepting_applications'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {effectiveBadgeType === 'urgently_hiring' ? 'Urgently Hiring' : effectiveBadgeType === 'accepting_applications' ? 'Accepting Applications' : 'Open Position'}
                        </div>

                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-white mb-2 pr-28">{job.title}</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {job.location}
                          </span>
                          <span className="bg-slate-700/50 px-2 py-0.5 rounded text-slate-400">
                            {job.department}
                          </span>
                          <span className="bg-slate-700/50 px-2 py-0.5 rounded text-slate-400">
                            {job.type}
                          </span>
                        </div>
                        <p className={`text-slate-400 text-sm ${isExpanded ? '' : 'line-clamp-2'}`}>{job.description}</p>

                        {/* Expandable Details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              {/* Benefits */}
                              {job.benefits && job.benefits.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-700/50">
                                  <h5 className="text-sm font-medium text-white mb-2">Benefits</h5>
                                  <ul className="space-y-1">
                                    {job.benefits.map((benefit: string, idx: number) => (
                                      <li key={idx} className="text-slate-400 text-sm flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                                        {benefit}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Keywords/Skills */}
                              {job.keywords && job.keywords.length > 0 && (
                                <div className="mt-4">
                                  <h5 className="text-sm font-medium text-white mb-2">Skills & Keywords</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {job.keywords.map((keyword: string, idx: number) => (
                                      <span key={idx} className="bg-slate-700/70 px-2 py-1 rounded text-xs text-slate-300">
                                        {keyword}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Apply CTA */}
                              <div className="mt-4 pt-4 border-t border-slate-700/50">
                                <p className="text-slate-400 text-sm">
                                  Interested? Upload your resume above to apply!
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Expand/Collapse Indicator */}
                        <div className="flex items-center justify-center mt-3">
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={16} className="text-slate-500" />
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>

              <p className="text-center text-slate-500 mt-6">
                Upload your resume above to see which positions match your skills!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24 relative bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">Contact</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-3 mb-3 sm:mb-4">
              Let&apos;s Talk Tires
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Ready to open a wholesale account? Have questions? We&apos;re real people
              who answer phones and solve problems.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Latrobe */}
            <Card3D>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-slate-800/30 border border-slate-800 rounded-xl p-6 h-full"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Latrobe</h3>
                    <p className="text-slate-500 text-sm">Main Office</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <p className="text-slate-300">410 Unity Street<br />Latrobe, PA 15650</p>
                  <a href="tel:724-539-8705" className="block text-red-400 hover:text-red-300 font-medium">
                    (724) 539-8705
                  </a>
                  <p className="text-slate-500 flex items-center gap-2">
                    <Clock size={14} />
                    Mon-Fri: 8am - 5pm
                  </p>
                </div>
                <a
                  href="https://maps.google.com/?q=410+Unity+Street+Latrobe+PA+15650"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block w-full bg-slate-700/50 hover:bg-slate-700 py-3 rounded-lg text-center text-sm font-medium transition-colors"
                >
                  Get Directions
                </a>
              </motion.div>
            </Card3D>

            {/* Uniontown */}
            <Card3D>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800/30 border border-slate-800 rounded-xl p-6 h-full"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Uniontown</h3>
                    <p className="text-slate-500 text-sm">Distribution Center</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <p className="text-slate-300">350 Pittsburgh Street<br />Uniontown, PA 15401</p>
                  <a href="tel:724-438-4131" className="block text-red-400 hover:text-red-300 font-medium">
                    (724) 438-4131
                  </a>
                  <p className="text-slate-500 flex items-center gap-2">
                    <Clock size={14} />
                    Mon-Fri: 8am - 5pm
                  </p>
                </div>
                <a
                  href="https://maps.google.com/?q=350+Pittsburgh+Street+Uniontown+PA+15401"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block w-full bg-slate-700/50 hover:bg-slate-700 py-3 rounded-lg text-center text-sm font-medium transition-colors"
                >
                  Get Directions
                </a>
              </motion.div>
            </Card3D>

            {/* Quick Contact - Animated CTA */}
            <Card3D>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative rounded-xl p-6 h-full overflow-hidden"
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-700"
                  animate={{
                    background: [
                      "linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #b91c1c 100%)",
                      "linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)",
                      "linear-gradient(135deg, #ef4444 0%, #b91c1c 50%, #dc2626 100%)",
                      "linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #b91c1c 100%)",
                    ]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
                    backgroundSize: "200% 200%",
                  }}
                  animate={{
                    backgroundPosition: ["200% 200%", "-200% -200%"]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white/20 rounded-full"
                      style={{
                        left: `${15 + i * 15}%`,
                        top: `${20 + (i % 3) * 25}%`,
                      }}
                      animate={{
                        y: [-10, 10, -10],
                        opacity: [0.2, 0.5, 0.2],
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="font-semibold text-white text-lg mb-4">Quick Contact</h3>
                <p className="text-red-100 text-sm mb-6">
                  Ready to open an account or have questions? Give us a call or send us a message.
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:724-539-8705"
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 transition-colors"
                  >
                    <Phone size={18} />
                    <span className="font-medium">(724) 539-8705</span>
                  </a>
                  <a
                    href="mailto:info@ietires.com"
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 transition-colors"
                  >
                    <Mail size={18} />
                    <span className="font-medium">info@ietires.com</span>
                  </a>
                  </div>
                </div>
              </motion.div>
            </Card3D>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 sm:mt-12 bg-slate-800/30 border border-slate-800 rounded-xl p-5 sm:p-6 lg:p-8 max-w-3xl mx-auto sm:col-span-2 lg:col-span-3"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 text-center">Send Us a Message</h3>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Business Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="Smith's Tire Shop"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="john@tireshop.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="(724) 555-0123"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">How can we help? *</label>
                <textarea
                  rows={4}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
                  placeholder="Tell us about your business and what you're looking for..."
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.gif"
                alt="Import Export Tire"
                className="h-10 w-auto"
              />
              <div>
                <span className="font-semibold text-white">Import Export Tire</span>
                <p className="text-slate-500 text-sm">Western PA Wholesale</p>
              </div>
            </div>
            <div className="text-slate-500 text-sm text-center">
              &copy; {new Date().getFullYear()} Import Export Tire. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <a
                href="tel:724-539-8705"
                className="text-slate-400 hover:text-white transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Call us at 724-539-8705"
              >
                <Phone size={20} />
              </a>
              <a
                href="mailto:info@ietires.com"
                className="text-slate-400 hover:text-white transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Email us at info@ietires.com"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Return to Top Button with 3D Tire */}
      <AnimatePresence>
        {showReturnToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 group min-h-[44px] min-w-[44px]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Return to top of page"
          >
            <div className="relative">
              {/* Tire spins on hover */}
              <motion.div
                className="w-14 h-14"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                whileHover={{ transition: { duration: 0.5 } }}
              >
                <Tire3D className="w-full h-full drop-shadow-lg" />
              </motion.div>
              {/* Up arrow indicator */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ y: 0 }}
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowUp size={18} className="text-white drop-shadow-md" />
              </motion.div>
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
            {/* Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Back to top
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
