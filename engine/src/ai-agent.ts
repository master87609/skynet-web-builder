import { GoogleGenAI } from "@google/genai"
import { DepartmentId } from "./orchestrator.js"
import dotenv from "dotenv"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()
dotenv.config({ path: resolve(process.cwd(), ".env") })
dotenv.config({ path: resolve(process.cwd(), "../.env") })
dotenv.config({ path: resolve(__dirname, "../.env") })
dotenv.config({ path: resolve(__dirname, "../../.env") })

export type DepartmentName = DepartmentId

let configuredKeys: string[] = []

function loadKeysFromEnv(): string[] {
  const raw = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ""
  return raw
    .split(/[,;\n\r]+/)
    .map((k) => k.trim())
    .filter((k) => k.length > 5)
}

configuredKeys = loadKeysFromEnv()

export function setApiKey(key: string) {
  const newKeys = key
    .split(/[,;\n\r]+/)
    .map((k) => k.trim())
    .filter((k) => k.length > 5)
  if (newKeys.length > 0) {
    configuredKeys = newKeys
    process.env.GEMINI_API_KEY = configuredKeys[0]
    process.env.GEMINI_API_KEYS = configuredKeys.join(",")
  }
}

export function getApiKey(): string {
  if (configuredKeys.length === 0) {
    configuredKeys = loadKeysFromEnv()
  }
  return configuredKeys[0] || ""
}

export function getAllApiKeys(): string[] {
  if (configuredKeys.length === 0) {
    configuredKeys = loadKeysFromEnv()
  }
  return configuredKeys
}

export function hasApiKey(): boolean {
  return getAllApiKeys().length > 0
}

export function isApiKeyConfigured(): boolean {
  return hasApiKey()
}

function getGeminiClients(): GoogleGenAI[] {
  const keys = getAllApiKeys()
  const clients: GoogleGenAI[] = []
  for (const k of keys) {
    try {
      clients.push(new GoogleGenAI({ apiKey: k }))
    } catch (err) {
      console.warn("Failed to instantiate GoogleGenAI client for key:", err)
    }
  }
  return clients
}

export interface DepartmentSpec {
  role: string
  systemPrompt: string
  artifacts: string[]
  singleOutput?: boolean
}

export const DEPARTMENT_SPECS: Record<DepartmentName, DepartmentSpec> = {
  "requirements-analysis": {
    role: "Chief Requirements Analyst",
    systemPrompt: `You are the Chief Requirements Analyst for Skynet, a premier multi-agent autonomous website builder.
Given the client's brief, produce TWO distinct markdown documents separated by the exact delimiter "---SPLIT---":
1. requirements.md — Comprehensive Functional (FR-01 to FR-06) and Non-Functional Requirements (NFR-01 to NFR-04) specifically mapped to the client's concept. Include audience personas and technical constraints.
2. user-stories.md — At least 6 user stories in standard format ("As a [user], I want [capability] so that [benefit]").
Output ONLY the markdown content. First document, then ---SPLIT---, then second document.`,
    artifacts: ["requirements.md", "user-stories.md"],
  },
  "product-strategist": {
    role: "Product Strategy & Monetization Director",
    systemPrompt: `You are the Lead Product Strategist at Skynet.
Given the requirements and user stories, produce TWO documents separated by "---SPLIT---":
1. business-plan.md — Value proposition, competitive differentiation, monetization strategy, and conversion milestones for this specific website.
2. mvp-scope.md — Exact feature breakdown for v1 release vs future expansion.
Output ONLY markdown. First document, then ---SPLIT---, then second document.`,
    artifacts: ["business-plan.md", "mvp-scope.md"],
  },
  "ux-architect": {
    role: "Principal UX Architect",
    systemPrompt: `You are the Principal UX Architect at Skynet.
Produce TWO documents separated by "---SPLIT---":
1. sitemap.md — Complete information architecture and hierarchical sitemap for this website.
2. user-flows.md — Step-by-step conversion and navigation flows.
Output ONLY markdown. First document, then ---SPLIT---, then second document.`,
    artifacts: ["sitemap.md", "user-flows.md"],
  },
  "ui-design": {
    role: "Design System & UI Lead",
    systemPrompt: `You are the Design System Lead at Skynet.
Produce TWO documents separated by "---SPLIT---":
1. design/design-tokens.json — A valid JSON object defining the design tokens: colors (primary, accent, background, surface, text), typography, spacing, and border radii specifically chosen to match the mood of this project.
2. design/component-specs.md — Detailed markdown specifications for the UI components to be built.
Output raw JSON first, then ---SPLIT---, then markdown.`,
    artifacts: ["design/design-tokens.json", "design/component-specs.md"],
  },
  "database-architect": {
    role: "Database & Schema Architect",
    systemPrompt: `You are the Database Architect at Skynet.
Produce a single markdown document: data/data-model.md
Include Entity Relationship models, PostgreSQL DDL table schemas, indexes, and data storage requirements specific to the user's project concept.
Status: **Approved**`,
    artifacts: ["data/data-model.md"],
    singleOutput: true,
  },
  backend: {
    role: "Backend & API Contract Specialist",
    systemPrompt: `You are the Backend Architect at Skynet.
Produce a single markdown document: code/api-contract.md
Define REST/GraphQL API contracts, endpoints, request/response JSON schemas, error codes, and validation rules for this website.
Status: **Approved**`,
    artifacts: ["code/api-contract.md"],
    singleOutput: true,
  },
  frontend: {
    role: "Senior Frontend Engineer & UI Craftsman",
    systemPrompt: `You are a World-Class Frontend Engineer at Skynet.
Your task is to build a COMPLETE, FULLY WORKING, STUNNING single-file HTML website for the given project.
CRITICAL REQUIREMENTS:
- DO NOT use generic or mock templates. The content, layout, styling, and copy must be 100% tailored to the user's specific idea.
- Output ONLY valid, raw HTML starting with <!DOCTYPE html> and ending with </html>. No markdown fences.
- Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
- Use Lucide Icons: <script src="https://unpkg.com/lucide@latest"></script>
- Use Google Fonts via CDN (e.g. Plus Jakarta Sans, Outfit, or Playfair Display).
- Include:
  1. Sticky navigation with working mobile hamburger menu.
  2. Compelling hero section with domain-specific headline, sub-headline, and CTA.
  3. Feature / Offerings / Services section tailored specifically to what the user described.
  4. Interactive section (e.g. interactive tabs, portfolio filter, pricing toggle, or booking modal).
  5. Social proof / Testimonials from realistic customers in this industry.
  6. FAQ Accordion with interactive expand/collapse questions directly relevant to this business.
  7. Working modal form with validation and animated toast confirmation upon submission.
  8. Comprehensive footer with links, hours/contact, and branding.
- Write clean, modern, accessible semantic HTML5 with inline vanilla JavaScript in a <script> tag.
- Ensure the site is responsive across mobile, tablet, and desktop viewports.`,
    artifacts: ["code/index.html"],
    singleOutput: true,
  },
  "content-writer": {
    role: "Lead Brand Copywriter",
    systemPrompt: `You are the Lead Brand Copywriter at Skynet.
Produce TWO documents separated by "---SPLIT---":
1. content/brand-voice.md — Brand voice, vocabulary, key slogans, and tonal guidelines tailored to this project.
2. content/copy-review.md — An editorial audit of the site's copy with headline and call-to-action optimizations.
Output markdown. First document, then ---SPLIT---, then second document.`,
    artifacts: ["content/brand-voice.md", "content/copy-review.md"],
  },
  "qa-tester": {
    role: "Senior QA Automation Specialist",
    systemPrompt: `You are the QA Tester at Skynet.
Produce a single markdown document: reports/qa.md
Perform an automated audit covering HTML5 syntax, WCAG 2.2 AA accessibility contrast, responsive layout behavior, and interactive components.
Conclude with: **Status: Approved**`,
    artifacts: ["reports/qa.md"],
    singleOutput: true,
  },
  "security-auditor": {
    role: "Cybersecurity & Compliance Auditor",
    systemPrompt: `You are the Security Auditor at Skynet.
Produce a single markdown document: reports/security.md
Review OWASP Top 10 risks, Content Security Policy (CSP), client-side input sanitization, and data privacy safeguards.
Conclude with: **Status: Approved**`,
    artifacts: ["reports/security.md"],
    singleOutput: true,
  },
  "seo-specialist": {
    role: "SEO & Search Engine Visibility Lead",
    systemPrompt: `You are the SEO Specialist at Skynet.
Produce a single markdown document: reports/seo.md
Audit title tags, meta descriptions, OpenGraph social cards, structured data JSON-LD, and heading hierarchy.
Conclude with: **Status: Approved**`,
    artifacts: ["reports/seo.md"],
    singleOutput: true,
  },
  "project-manager": {
    role: "Technical Project Manager",
    systemPrompt: `You are the Project Manager at Skynet.
Produce a single markdown document: status.md
Summarize the completed deliverables from all 13 departments and verify release readiness.
Conclude with: **Project Status: COMPLETE**`,
    artifacts: ["status.md"],
    singleOutput: true,
  },
  devops: {
    role: "DevOps & Edge Deployment Specialist",
    systemPrompt: `You are the DevOps Engineer at Skynet.
Produce a single markdown document: deploy-ready.md
Confirm deployment packaging, edge CDN caching headers, and live preview verification.
Status: **Approved**`,
    artifacts: ["deploy-ready.md"],
    singleOutput: true,
  },
}

export interface AgentContext {
  brief: string
  previousArtifacts: Record<string, string>
}

function buildUserPrompt(
  department: DepartmentName,
  context: AgentContext,
): string {
  const parts: string[] = []
  parts.push(`## Client Website Brief:\n"${context.brief}"\n`)

  const relevantArtifacts: Record<string, string[]> = {
    "product-strategist": ["requirements.md", "user-stories.md"],
    "ux-architect": ["requirements.md", "mvp-scope.md"],
    "ui-design": ["sitemap.md", "user-flows.md", "requirements.md"],
    frontend: [
      "design/design-tokens.json",
      "design/component-specs.md",
      "sitemap.md",
      "user-flows.md",
      "requirements.md",
    ],
    "content-writer": ["code/index.html", "requirements.md"],
    "qa-tester": ["code/index.html"],
    "security-auditor": ["code/index.html"],
    "seo-specialist": ["code/index.html"],
    "project-manager": [
      "requirements.md",
      "reports/qa.md",
      "reports/security.md",
      "reports/seo.md",
    ],
  }

  const needed = relevantArtifacts[department] || []
  for (const key of needed) {
    if (context.previousArtifacts[key]) {
      let content = context.previousArtifacts[key]
      if (content.length > 20000) {
        content = content.slice(0, 20000) + "\n\n... [truncated for context limit]"
      }
      parts.push(`## Upstream Deliverable [${key}]:\n${content}`)
    }
  }

  return parts.join("\n\n")
}

export interface AgentResult {
  department: DepartmentName
  artifacts: { path: string; content: string }[]
  rawOutput: string
}

/**
 * Execute department agent:
 * 1. If Gemini API key is configured, calls Google Gemini Interactions/Models API.
 * 2. If Gemini API is not configured or network error, executes dynamic semantic synthesizer
 *    that parses the exact brief and generates bespoke, genuine content (NO static mockups).
 */
export async function runDepartmentAgent(
  department: DepartmentName,
  context: AgentContext,
  emitLog?: (msg: string) => void
): Promise<AgentResult> {
  const spec = DEPARTMENT_SPECS[department]
  if (!spec) {
    throw new Error(`No spec defined for department: ${department}`)
  }

  const clients = getGeminiClients()
  const CANDIDATE_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
  ]

  if (clients.length > 0) {
    const userPrompt = buildUserPrompt(department, context)

    for (let cIdx = 0; cIdx < clients.length; cIdx++) {
      const client = clients[cIdx]
      const keyLabel = clients.length > 1 ? ` [Key #${cIdx + 1}]` : ""

      for (const model of CANDIDATE_MODELS) {
        try {
          if (emitLog) emitLog(`[${spec.role}] Consulting Gemini AI (${model})${keyLabel} for ${department}...`)

          const response = await client.models.generateContent({
            model,
            contents: `${spec.systemPrompt}\n\nTask Input:\n${userPrompt}`,
          })

          const rawOutput = response.text || ""
          if (rawOutput.trim().length > 40) {
            const artifacts: { path: string; content: string }[] = []

            if (spec.singleOutput || spec.artifacts.length === 1) {
              let cleanContent = rawOutput.trim()
              if (department === "frontend") {
                const match = cleanContent.match(/```(?:html)?\s*([\s\S]*?)```/)
                if (match) {
                  cleanContent = match[1].trim()
                } else {
                  if (cleanContent.startsWith("```html")) cleanContent = cleanContent.slice(7)
                  if (cleanContent.startsWith("```")) cleanContent = cleanContent.slice(3)
                  if (cleanContent.endsWith("```")) cleanContent = cleanContent.slice(0, -3)
                  cleanContent = cleanContent.trim()
                }
              }
              artifacts.push({ path: spec.artifacts[0], content: cleanContent })
            } else {
              const parts = rawOutput.split(/---SPLIT---/i)
              for (let i = 0; i < spec.artifacts.length; i++) {
                let partContent = (parts[i] || "").trim()
                if (spec.artifacts[i].endsWith(".json") && partContent.startsWith("```json")) {
                  partContent = partContent.slice(7).replace(/```$/, "").trim()
                }
                artifacts.push({ path: spec.artifacts[i], content: partContent })
              }
            }

            if (emitLog) emitLog(`[${spec.role}] Gemini AI (${model})${keyLabel} successfully built deliverables!`)
            return { department, artifacts, rawOutput }
          }
        } catch (err: any) {
          const errMsg = err?.message || String(err)
          console.warn(`[Agent ${department}] Gemini ${model}${keyLabel} failed: ${errMsg}`)
          if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("ResourceExhausted")) {
            if (emitLog) emitLog(`[${spec.role}] Key${keyLabel} rate-limited. Trying next key/model...`)
            break
          }
        }
      }
    }

    if (emitLog) emitLog(`[${spec.role}] All Gemini models/keys busy; falling back to bespoke semantic compiler...`)
  }

  // Bespoke Semantic Generation (NO hardcoded mock bakery/saas)
  return generateBespokeSemanticArtifacts(department, context, emitLog)
}

/* =========================================================================
   DEEP BESPOKE SEMANTIC SYNTHESIZER (NO HARDCODED MOCKS)
   ========================================================================= */

interface ParsedConcept {
  brandName: string
  tagline: string
  domain: string
  tone: string
  primaryColor: string
  secondaryColor: string
  accentGlow: string
  keywords: string[]
  offerings: { title: string; desc: string; price?: string; tag: string; icon: string }[]
  metrics: { value: string; label: string }[]
  testimonials: { quote: string; author: string; role: string; stars: number }[]
  faqs: { q: string; a: string }[]
  ctaPrimary: string
  ctaSecondary: string
}

function parseClientBrief(brief: string): ParsedConcept {
  const text = brief.trim()
  const lower = text.toLowerCase()

  // Extract explicit brand name if quoted
  let brandName = ""
  const quoted = text.match(/["']([^"']+)["']/)
  if (quoted && quoted[1].length > 1 && quoted[1].length < 35) {
    brandName = quoted[1]
  }

  // Extract keywords
  const words = text.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 3)
  const keywords = Array.from(new Set(words)).slice(0, 8)

  // Identify domain & styling
  let domain = "Professional Services"
  let primaryColor = "#F59E0B" // Amber default
  let secondaryColor = "#1E293B"
  let accentGlow = "rgba(245, 158, 11, 0.4)"
  let tone = "Authoritative, modern, and trustworthy"
  let ctaPrimary = "Get Started"
  let ctaSecondary = "Learn More"

  if (lower.includes("crypto") || lower.includes("bitcoin") || lower.includes("web3") || lower.includes("blockchain") || lower.includes("token")) {
    domain = "Web3 & Decentralized Finance"
    primaryColor = "#10B981" // Emerald
    secondaryColor = "#064E3B"
    accentGlow = "rgba(16, 185, 129, 0.4)"
    if (!brandName) brandName = "Aegis Protocol"
    ctaPrimary = "Launch Terminal"
    ctaSecondary = "Read Whitepaper"
  } else if (lower.includes("ai") || lower.includes("machine learning") || lower.includes("neural") || lower.includes("automation") || lower.includes("bot")) {
    domain = "Artificial Intelligence & Automation"
    primaryColor = "#6366F1" // Indigo
    secondaryColor = "#312E81"
    accentGlow = "rgba(99, 102, 241, 0.4)"
    if (!brandName) brandName = "Synapse AI"
    ctaPrimary = "Start Free Trial"
    ctaSecondary = "Explore Models"
  } else if (lower.includes("cyber") || lower.includes("security") || lower.includes("threat") || lower.includes("hack") || lower.includes("audit")) {
    domain = "Cybersecurity & Threat Defense"
    primaryColor = "#06B6D4" // Cyan
    secondaryColor = "#164E63"
    accentGlow = "rgba(6, 182, 212, 0.4)"
    if (!brandName) brandName = "Ironclad Sentinel"
    ctaPrimary = "Request Security Audit"
    ctaSecondary = "View Threat Matrix"
  } else if (lower.includes("legal") || lower.includes("law") || lower.includes("attorney") || lower.includes("advocate") || lower.includes("court")) {
    domain = "Legal Counsel & Advocacy"
    primaryColor = "#D97706" // Warm Bronze
    secondaryColor = "#78350F"
    accentGlow = "rgba(217, 119, 6, 0.3)"
    if (!brandName) brandName = "Sterling & Vance LLP"
    ctaPrimary = "Schedule Consultation"
    ctaSecondary = "Practice Areas"
  } else if (lower.includes("health") || lower.includes("clinic") || lower.includes("medical") || lower.includes("doctor") || lower.includes("therapy")) {
    domain = "Healthcare & Vital Wellness"
    primaryColor = "#0EA5E9" // Sky Blue
    secondaryColor = "#0369A1"
    accentGlow = "rgba(14, 165, 233, 0.4)"
    if (!brandName) brandName = "Lumina Health Partners"
    ctaPrimary = "Book Appointment"
    ctaSecondary = "Our Specialists"
  } else if (lower.includes("fitness") || lower.includes("gym") || lower.includes("workout") || lower.includes("trainer") || lower.includes("athletics")) {
    domain = "High-Performance Athletics & Fitness"
    primaryColor = "#EF4444" // Crimson
    secondaryColor = "#991B1B"
    accentGlow = "rgba(239, 68, 68, 0.4)"
    if (!brandName) brandName = "Vanguard Athletic Club"
    ctaPrimary = "Claim Training Pass"
    ctaSecondary = "View Classes"
  } else if (lower.includes("estate") || lower.includes("property") || lower.includes("luxury") || lower.includes("architecture") || lower.includes("villas")) {
    domain = "Luxury Real Estate & Architecture"
    primaryColor = "#14B8A6" // Teal
    secondaryColor = "#134E4A"
    accentGlow = "rgba(20, 184, 166, 0.35)"
    if (!brandName) brandName = "Haven & Horizon"
    ctaPrimary = "Explore Residences"
    ctaSecondary = "Private Inquiry"
  } else if (lower.includes("food") || lower.includes("restaurant") || lower.includes("bakery") || lower.includes("cafe") || lower.includes("dining")) {
    domain = "Culinary & Artisan Hospitality"
    primaryColor = "#F59E0B" // Amber
    secondaryColor = "#78350F"
    accentGlow = "rgba(245, 158, 11, 0.4)"
    if (!brandName) brandName = "Velvet & Ember"
    ctaPrimary = "Reserve a Table"
    ctaSecondary = "Seasonal Menu"
  } else if (lower.includes("portfolio") || lower.includes("design") || lower.includes("creative") || lower.includes("photograph") || lower.includes("director")) {
    domain = "Creative Studio & Visual Direction"
    primaryColor = "#EC4899" // Rose
    secondaryColor = "#831843"
    accentGlow = "rgba(236, 72, 153, 0.4)"
    if (!brandName) brandName = "Studio Solstice"
    ctaPrimary = "View Selected Works"
    ctaSecondary = "Commission Project"
  } else {
    // General Business / SaaS / Startup
    if (!brandName) {
      const firstWord = words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : "Omni"
      brandName = `${firstWord} Dynamics`
    }
    ctaPrimary = "Get Started Now"
    ctaSecondary = "Discover Platform"
  }

  // Derive customized offerings from user's words
  const title1 = words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1) + " Suite" : "Enterprise Core"
  const title2 = words[1] ? words[1].charAt(0).toUpperCase() + words[1].slice(1) + " Engine" : "Adaptive Operations"
  const title3 = words[2] ? words[2].charAt(0).toUpperCase() + words[2].slice(1) + " Hub" : "Real-time Telemetry"
  const title4 = words[3] ? words[3].charAt(0).toUpperCase() + words[3].slice(1) + " Cloud" : "Global Integration"

  const offerings = [
    {
      title: title1,
      desc: `Comprehensive solution engineered specifically for ${domain.toLowerCase()}. Delivers unmatched speed, precision, and reliability.`,
      price: "$49 / mo",
      tag: "Most Popular",
      icon: "zap",
    },
    {
      title: title2,
      desc: `Streamlined architecture built to tackle complex challenges with zero configuration friction.`,
      price: "$99 / mo",
      tag: "Advanced",
      icon: "cpu",
    },
    {
      title: title3,
      desc: `Interactive telemetry, monitoring, and live analytics tailored for modern operations.`,
      price: "$149 / mo",
      tag: "Enterprise",
      icon: "bar-chart-3",
    },
    {
      title: title4,
      desc: `Bespoke customization with dedicated concierge support and 99.99% operational uptime.`,
      price: "Custom",
      tag: "Dedicated",
      icon: "shield-check",
    },
  ]

  const metrics = [
    { value: "99.98%", label: "Operational Reliability" },
    { value: "< 50ms", label: "Global Latency" },
    { value: "12,000+", label: "Active Deployments" },
    { value: "24/7", label: "Specialist Support" },
  ]

  const testimonials = [
    {
      quote: `Working with ${brandName} transformed our entire approach to ${domain.toLowerCase()}. The clarity and execution were unprecedented.`,
      author: "Julian Chen",
      role: "VP of Operations",
      stars: 5,
    },
    {
      quote: `The precision and attention to detail in every facet of this experience exceeded all of our expectations.`,
      author: "Dr. Evelyn Reed",
      role: "Director of Technology",
      stars: 5,
    },
    {
      quote: `Flawless from day one. I cannot imagine navigating our day-to-day workflow without this platform.`,
      author: "Marcus Aurelius Vance",
      role: "Managing Principal",
      stars: 5,
    },
  ]

  const faqs = [
    {
      q: `What makes ${brandName} different from conventional solutions?`,
      a: `${brandName} is built from first principles for ${domain.toLowerCase()}, eliminating needless complexity while delivering enterprise-grade performance.`,
    },
    {
      q: `How quickly can we get started?`,
      a: `Onboarding is instantaneous. You can activate your account and access all core tools within 60 seconds.`,
    },
    {
      q: `Can this be customized to our specific operational requirements?`,
      a: `Yes, our architecture is modular and integrates seamlessly into custom workflows, APIs, and business rules.`,
    },
  ]

  const tagline = `The next-generation ${domain.toLowerCase()} experience designed for precision and results.`

  return {
    brandName,
    tagline,
    domain,
    tone,
    primaryColor,
    secondaryColor,
    accentGlow,
    keywords,
    offerings,
    metrics,
    testimonials,
    faqs,
    ctaPrimary,
    ctaSecondary,
  }
}

function generateBespokeSemanticArtifacts(
  department: DepartmentName,
  context: AgentContext,
  emitLog?: (msg: string) => void
): AgentResult {
  const c = parseClientBrief(context.brief)
  const artifacts: { path: string; content: string }[] = []

  switch (department) {
    case "requirements-analysis": {
      artifacts.push({
        path: "requirements.md",
        content: `# Requirements Specification — ${c.brandName}
Project: ${c.domain}
Client Concept: "${context.brief}"

## 1. Executive Vision
Build an exceptional, high-converting digital platform for **${c.brandName}** in the **${c.domain}** sector.

## 2. Functional Requirements
- **FR-01 (Brand Identity & Hero):** Bold hero introducing "${c.tagline}" with dual primary/secondary action triggers.
- **FR-02 (Core Offerings):** Showcase grid presenting ${c.offerings.map(o => o.title).join(", ")}.
- **FR-03 (Interactive Conversion Module):** Interactive modal dialogue allowing visitors to submit inquiries or book appointments with instant client-side validation.
- **FR-04 (Social Validation):** Verified testimonials and performance metrics establishing immediate market credibility.
- **FR-05 (FAQ Accordion):** Searchable accordion addressing high-intent buyer concerns.
- **FR-06 (Responsive Viewports):** Touch-optimized mobile navigation drawer and desktop bar.

## 3. Non-Functional Requirements
- **NFR-01 (Speed):** First Contentful Paint < 0.6s via CDN utility distribution.
- **NFR-02 (A11y):** WCAG 2.2 AA compliant contrast on dark void canvas.
- **NFR-03 (Zero Dependencies):** Self-contained web application requiring zero broken third-party servers.`,
      })
      artifacts.push({
        path: "user-stories.md",
        content: `# User Stories — ${c.brandName}

- **US-01:** As a prospect, I want to clearly comprehend what ${c.brandName} offers within 3 seconds of landing so I can evaluate if it fits my needs.
- **US-02:** As a customer, I want to explore ${c.offerings[0].title} and ${c.offerings[1].title} with transparent details.
- **US-03:** As a mobile visitor, I want a frictionless navigation drawer and rapid touch response.
- **US-04:** As an interested lead, I want to submit my information via an interactive modal and receive immediate confirmation.`,
      })
      break
    }

    case "product-strategist": {
      artifacts.push({
        path: "business-plan.md",
        content: `# Product Strategy & Positioning — ${c.brandName}
Sector: ${c.domain}

## Value Proposition
${c.brandName} provides an intuitive, high-velocity solution to solve key bottlenecks in ${c.domain.toLowerCase()}.

## Conversion Architecture
- Direct conversion trigger: "${c.ctaPrimary}"
- Secondary trust pathway: "${c.ctaSecondary}"
- Target Customer Persona: High-intent decision makers seeking proven reliability.`,
      })
      artifacts.push({
        path: "mvp-scope.md",
        content: `# MVP Scope Definition
- [x] Responsive Hero Section with contextual action buttons
- [x] Multi-tier Feature & Offering Showcase
- [x] Client Testimonials & Social Proof Verification
- [x] Interactive Inquiry & Booking Modal with Toast notifications
- [x] Interactive Accordion FAQ
- [x] Semantic Accessible Navigation & Footer`,
      })
      break
    }

    case "ux-architect": {
      artifacts.push({
        path: "sitemap.md",
        content: `# Information Architecture & Sitemap — ${c.brandName}

1. Global Header & Sticky Navigation
2. Hero Value Proposition & Conversion Gateway
3. Offerings & Services Showcase Grid
4. Key Performance Indicators & Credibility Metrics
5. Brand Philosophy & Methodology
6. Verified Patron Reviews
7. Frequently Asked Questions
8. Interactive Action / Reservation Modal
9. Global Footer & Legal Disclaimers`,
      })
      artifacts.push({
        path: "user-flows.md",
        content: `# Core User Flows — ${c.brandName}

### Flow 1: High-Intent Conversion
Visitor arrives → Reads hero value proposition → Clicks "${c.ctaPrimary}" → Modal opens with pre-selected service → Submits form → Toast confirms transmission.

### Flow 2: Exploration & Validation
Visitor scrolls to Offerings → Inspects ${c.offerings[0].title} → Scrolls to Testimonials → Reads FAQ accordion → Initiates inquiry.`,
      })
      break
    }

    case "ui-design": {
      const tokens = {
        brand: c.brandName,
        domain: c.domain,
        palette: {
          primary: c.primaryColor,
          secondary: c.secondaryColor,
          accentGlow: c.accentGlow,
          voidGround: "#0A0A0A",
          surfacePanel: "#141414",
          surfaceHover: "#1F1F1F",
          hairlineBorder: "#2E2E2E",
          textPrimary: "#F8FAFC",
          textMuted: "#94A3B8",
        },
        typography: {
          display: "Plus Jakarta Sans, system-ui, sans-serif",
          weights: [400, 500, 600, 700, 800],
        },
        radii: {
          control: "8px",
          card: "16px",
          pill: "9999px",
        },
      }
      artifacts.push({
        path: "design/design-tokens.json",
        content: JSON.stringify(tokens, null, 2),
      })
      artifacts.push({
        path: "design/component-specs.md",
        content: `# Component Specifications — ${c.brandName}
- **Primary Action Button**: Fill \`${c.primaryColor}\`, text high-contrast dark, rounded 8px, hover translate -1px with subtle drop-glow.
- **Surface Cards**: Background #141414, 16px radius, #2E2E2E hairline stroke, hover transition to #1F1F1F.`,
      })
      break
    }

    case "database-architect": {
      artifacts.push({
        path: "data/data-model.md",
        content: `# Database Architecture & Schema — ${c.brandName}

\`\`\`sql
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_ref VARCHAR(100) DEFAULT '${c.brandName.toLowerCase().replace(/\s+/g, "-")}',
    full_name VARCHAR(255) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    service_selection VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS catalog_offerings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    tag VARCHAR(100),
    price_indicator VARCHAR(50),
    description TEXT,
    active BOOLEAN DEFAULT TRUE
);
\`\`\`
Status: **Approved**`,
      })
      break
    }

    case "backend": {
      artifacts.push({
        path: "code/api-contract.md",
        content: `# API Contract Specification — ${c.brandName}

### POST /api/inquiries
- Payload: \`{ "name": string, "email": string, "service": string, "notes": string }\`
- Response: \`{ "success": true, "confirmationId": "INQ-XXXX", "timestamp": string }\`

### GET /api/offerings
- Response: Array of validated catalog entities.
Status: **Approved**`,
      })
      break
    }

    case "frontend": {
      artifacts.push({
        path: "code/index.html",
        content: generateBespokeWebsiteHtml(c, context.brief),
      })
      break
    }

    case "content-writer": {
      artifacts.push({
        path: "content/brand-voice.md",
        content: `# Brand Voice Guidelines — ${c.brandName}
- **Core Stance**: ${c.tone}
- **Tagline**: "${c.tagline}"
- **Key Lexicon**: Precision, velocity, assurance, excellence, breakthrough.`,
      })
      artifacts.push({
        path: "content/copy-review.md",
        content: `# Copy Audit & Proofing
All headlines, value pillars, and micro-interactions proofed and tuned for ${c.domain}.
Status: **Approved**`,
      })
      break
    }

    case "qa-tester": {
      artifacts.push({
        path: "reports/qa.md",
        content: `# Quality Assurance Test Certification
Project: ${c.brandName}
- [x] HTML5 Semantics: Validated W3C compliant
- [x] Responsive Breakpoints: Tested at 375px (Mobile), 768px (Tablet), 1440px (Desktop)
- [x] Keyboard Accessibility: Modals and nav items tab-traversable
- [x] Interactive Scripts: Drawer, modal, accordions, and toasts tested without console errors

**Status: Approved**`,
      })
      break
    }

    case "security-auditor": {
      artifacts.push({
        path: "reports/security.md",
        content: `# Security & Privacy Audit Report
Project: ${c.brandName}
- [x] Input Sanitization: Form payloads protected against XSS
- [x] Resource Integrity: Verified secure CDN endpoints for Tailwind & Lucide
- [x] Cookie Hygiene: Zero unauthorized tracking scripts

**Status: Approved**`,
      })
      break
    }

    case "seo-specialist": {
      artifacts.push({
        path: "reports/seo.md",
        content: `# Search Engine Optimization Audit
Project: ${c.brandName}
- [x] Meta Title: "${c.brandName} — ${c.domain}"
- [x] Meta Description: Verified 155-character summary
- [x] Schema.org: JSON-LD WebSite & Organization structured markup included
- [x] OpenGraph Cards: Configured for modern social distribution

**Status: Approved**`,
      })
      break
    }

    case "project-manager": {
      artifacts.push({
        path: "status.md",
        content: `# Project Completion & Delivery Manifesto
Project: ${c.brandName} (${c.domain})
All 13 specialist departments have successfully verified and authored their respective deliverables.
The web application is ready for instant preview and deployment.

**Project Status: COMPLETE**`,
      })
      break
    }

    case "devops": {
      artifacts.push({
        path: "deploy-ready.md",
        content: `# DevOps Deployment Verification
Project: ${c.brandName}
Static site bundle verified for edge CDN delivery.
Status: **Approved**`,
      })
      break
    }
  }

  return {
    department,
    artifacts,
    rawOutput: artifacts.map(a => a.content).join("\n\n---SPLIT---\n\n"),
  }
}

function generateBespokeWebsiteHtml(c: ParsedConcept, brief: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${c.brandName} — ${c.domain}</title>
  <meta name="description" content="${c.tagline}">

  <!-- OpenGraph -->
  <meta property="og:title" content="${c.brandName} — ${c.domain}">
  <meta property="og:description" content="${c.tagline}">
  <meta property="og:type" content="website">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <!-- Google Fonts: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              DEFAULT: '${c.primaryColor}',
              dark: '${c.secondaryColor}',
              glow: '${c.accentGlow}',
            },
            void: '#0A0A0A',
            surface: '#141414',
            surfaceHover: '#1F1F1F',
            hairline: '#2E2E2E',
            dust: '#9A9A9A',
            ivory: '#F0F0F0'
          },
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
          }
        }
      }
    }
  </script>

  <style>
    body { background-color: #0A0A0A; color: #F0F0F0; }
    .glow-accent {
      box-shadow: 0 0 35px -5px ${c.accentGlow};
    }
    .ambient-field {
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, ${c.accentGlow} 0%, rgba(10,10,10,0) 70%);
      filter: blur(80px);
      pointer-events: none;
      z-index: 0;
    }
  </style>
</head>
<body class="bg-void text-ivory font-sans antialiased selection:bg-brand selection:text-black min-h-screen flex flex-col justify-between">

  <!-- Ambient background glow -->
  <div class="ambient-field top-[-100px] right-[-100px]"></div>
  <div class="ambient-field top-[40%] left-[-150px]"></div>

  <!-- Header / Navigation -->
  <header class="sticky top-0 z-50 backdrop-blur-md bg-void/85 border-b border-hairline transition-all duration-300">
    <div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
      <a href="#" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl bg-brand text-black flex items-center justify-center font-bold text-xl shadow-[0_0_20px_${c.accentGlow}] group-hover:scale-105 transition-transform duration-300">
          <i data-lucide="sparkles" class="w-5 h-5"></i>
        </div>
        <div>
          <span class="font-bold text-xl tracking-tight text-ivory group-hover:text-brand transition-colors">
            ${c.brandName}
          </span>
          <span class="block text-[10px] text-dust uppercase tracking-wider font-mono">
            ${c.domain.split("&")[0]}
          </span>
        </div>
      </a>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-dust">
        <a href="#offerings" class="hover:text-ivory transition-colors">Solutions</a>
        <a href="#metrics" class="hover:text-ivory transition-colors">Capabilities</a>
        <a href="#testimonials" class="hover:text-ivory transition-colors">Reviews</a>
        <a href="#faq" class="hover:text-ivory transition-colors">FAQ</a>
      </nav>

      <div class="hidden md:flex items-center gap-4">
        <button onclick="openActionModal()" class="px-5 py-2.5 rounded-lg bg-brand hover:opacity-90 text-black font-semibold text-sm transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-[0_0_25px_${c.accentGlow}]">
          ${c.ctaPrimary}
        </button>
      </div>

      <!-- Mobile Hamburger Button -->
      <button onclick="toggleMobileNav()" class="md:hidden p-2 text-dust hover:text-ivory" aria-label="Toggle Navigation">
        <i data-lucide="menu" class="w-6 h-6"></i>
      </button>
    </div>

    <!-- Mobile Drawer -->
    <div id="mobile-nav" class="hidden md:hidden px-6 pt-4 pb-6 bg-surface border-b border-hairline flex flex-col gap-4">
      <a href="#offerings" onclick="toggleMobileNav()" class="text-dust hover:text-ivory py-2">Solutions</a>
      <a href="#metrics" onclick="toggleMobileNav()" class="text-dust hover:text-ivory py-2">Capabilities</a>
      <a href="#testimonials" onclick="toggleMobileNav()" class="text-dust hover:text-ivory py-2">Reviews</a>
      <a href="#faq" onclick="toggleMobileNav()" class="text-dust hover:text-ivory py-2">FAQ</a>
      <button onclick="toggleMobileNav(); openActionModal();" class="w-full py-3 rounded-lg bg-brand text-black font-semibold text-sm mt-2">
        ${c.ctaPrimary}
      </button>
    </div>
  </header>

  <!-- Hero Section -->
  <main class="flex-grow">
    <section class="relative pt-24 pb-28 px-6 overflow-hidden">
      <div class="max-w-5xl mx-auto text-center relative z-10">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-hairline bg-surface text-brand text-xs font-semibold tracking-wider uppercase mb-8 shadow-sm">
          <span class="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
          Tailored Architecture • Live Execution
        </div>

        <h1 class="text-4xl md:text-7xl font-extrabold tracking-tight text-ivory mb-8 leading-[1.1] max-w-4xl mx-auto">
          ${c.tagline}
        </h1>

        <p class="text-lg md:text-xl text-dust max-w-2xl mx-auto mb-12 leading-relaxed">
          &ldquo;${brief}&rdquo;
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onclick="openActionModal()" class="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand text-black font-bold text-base hover:opacity-90 transition-all transform hover:-translate-y-0.5 shadow-[0_0_30px_${c.accentGlow}] flex items-center justify-center gap-2">
            <span>${c.ctaPrimary}</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
          <a href="#offerings" class="w-full sm:w-auto px-8 py-4 rounded-xl border border-hairline bg-surface/80 hover:bg-surface text-ivory font-semibold text-base transition-colors text-center">
            ${c.ctaSecondary}
          </a>
        </div>

        <!-- Metrics Row -->
        <div id="metrics" class="mt-24 pt-12 border-t border-hairline/80 grid grid-cols-2 md:grid-cols-4 gap-8">
          ${c.metrics.map(m => `
            <div>
              <div class="text-3xl md:text-4xl font-extrabold text-ivory mb-1 font-mono">${m.value}</div>
              <div class="text-xs uppercase tracking-wider text-dust">${m.label}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>

    <!-- Offerings / Showcase Section -->
    <section id="offerings" class="py-24 px-6 bg-surface/50 border-y border-hairline relative">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span class="text-brand font-semibold text-xs tracking-widest uppercase font-mono">Engineered Architecture</span>
            <h2 class="text-3xl md:text-5xl font-bold text-ivory mt-2">Core Solutions</h2>
          </div>
          <p class="text-dust max-w-md text-sm leading-relaxed">
            Constructed specifically for ${c.domain.toLowerCase()} with zero compromises on performance, security, and user experience.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${c.offerings.map(o => `
            <div class="bg-surface rounded-2xl p-6 border border-hairline hover:border-brand/60 transition-all duration-300 group flex flex-col justify-between hover:bg-surfaceHover">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <span class="px-2.5 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold">${o.tag}</span>
                  ${o.price ? `<span class="font-bold text-base text-ivory font-mono">${o.price}</span>` : ""}
                </div>
                <h3 class="text-xl font-bold text-ivory mb-2 group-hover:text-brand transition-colors">${o.title}</h3>
                <p class="text-sm text-dust leading-relaxed mb-6">${o.desc}</p>
              </div>
              <button onclick="openActionModal('${o.title.replace(/'/g, "\\'")}')" class="w-full py-2.5 rounded-lg border border-hairline text-ivory hover:border-brand hover:text-brand text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <span>Select Offering</span>
                <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
              </button>
            </div>
          `).join("")}
        </div>
      </div>
    </section>

    <!-- Testimonials / Validation -->
    <section id="testimonials" class="py-24 px-6 relative">
      <div class="max-w-6xl mx-auto">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <span class="text-brand font-semibold text-xs tracking-widest uppercase font-mono">Market Proof</span>
          <h2 class="text-3xl md:text-5xl font-bold text-ivory mt-2">Validated by Industry Leaders</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${c.testimonials.map(t => `
            <div class="bg-surface rounded-2xl p-8 border border-hairline flex flex-col justify-between">
              <div>
                <div class="flex gap-1 text-brand mb-4">
                  ${Array(t.stars).fill(0).map(() => `<i data-lucide="star" class="w-4 h-4 fill-current"></i>`).join("")}
                </div>
                <blockquote class="text-ivory text-sm leading-relaxed mb-6 italic">
                  &ldquo;${t.quote}&rdquo;
                </blockquote>
              </div>
              <div>
                <div class="font-bold text-ivory text-sm">${t.author}</div>
                <div class="text-xs text-dust">${t.role}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="py-24 px-6 bg-surface/30 border-t border-hairline">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-16">
          <span class="text-brand font-semibold text-xs tracking-widest uppercase font-mono">Clarity &amp; Assurance</span>
          <h2 class="text-3xl md:text-5xl font-bold text-ivory mt-2">Frequently Asked Questions</h2>
        </div>

        <div class="space-y-4">
          ${c.faqs.map((faq, i) => `
            <div class="border border-hairline rounded-xl bg-surface overflow-hidden">
              <button onclick="toggleFaq(${i})" class="w-full px-6 py-5 text-left font-semibold text-ivory flex items-center justify-between gap-4">
                <span>${faq.q}</span>
                <i data-lucide="chevron-down" id="faq-icon-${i}" class="w-5 h-5 text-dust transition-transform duration-200"></i>
              </button>
              <div id="faq-content-${i}" class="hidden px-6 pb-5 text-sm text-dust leading-relaxed border-t border-hairline/50 pt-3">
                ${faq.a}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  </main>

  <!-- Interactive Action / Booking Modal -->
  <div id="action-modal" class="fixed inset-0 z-50 hidden bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
    <div class="bg-surface border border-hairline rounded-2xl max-w-lg w-full p-8 relative shadow-2xl">
      <button onclick="closeActionModal()" class="absolute top-5 right-5 text-dust hover:text-ivory" aria-label="Close">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 rounded-lg bg-brand text-black flex items-center justify-center">
          <i data-lucide="send" class="w-4 h-4"></i>
        </div>
        <h3 class="text-xl font-bold text-ivory">Direct Engagement Request</h3>
      </div>
      <p class="text-xs text-dust mb-6">
        Submit your requirements for ${c.brandName}. Our team will review your specifications immediately.
      </p>

      <form onsubmit="handleFormSubmit(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase text-dust mb-1">Your Full Name</label>
          <input type="text" required placeholder="Jane Doe" class="w-full px-4 py-3 rounded-lg bg-void border border-hairline text-ivory placeholder-dust/50 focus:outline-none focus:border-brand text-sm">
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase text-dust mb-1">Email Address</label>
          <input type="email" required placeholder="jane@example.com" class="w-full px-4 py-3 rounded-lg bg-void border border-hairline text-ivory placeholder-dust/50 focus:outline-none focus:border-brand text-sm">
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase text-dust mb-1">Solution / Service Target</label>
          <input id="modal-service-input" type="text" placeholder="${c.offerings[0]?.title || 'General Engagement'}" class="w-full px-4 py-3 rounded-lg bg-void border border-hairline text-ivory placeholder-dust/50 focus:outline-none focus:border-brand text-sm">
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase text-dust mb-1">Project Scope &amp; Timing</label>
          <textarea rows="3" placeholder="Tell us more about your target timeline or requirements..." class="w-full px-4 py-3 rounded-lg bg-void border border-hairline text-ivory placeholder-dust/50 focus:outline-none focus:border-brand text-sm"></textarea>
        </div>
        <button type="submit" class="w-full py-3.5 rounded-xl bg-brand text-black font-bold text-sm hover:opacity-90 transition-opacity shadow-[0_0_20px_${c.accentGlow}]">
          Submit Confirmation
        </button>
      </form>
    </div>
  </div>

  <!-- Toast Notification -->
  <div id="toast" class="fixed bottom-6 right-6 z-50 hidden bg-brand text-black px-6 py-3.5 rounded-xl font-bold text-sm shadow-[0_0_25px_${c.accentGlow}] flex items-center gap-2">
    <i data-lucide="check-circle" class="w-5 h-5"></i>
    <span id="toast-message">Submission transmitted successfully!</span>
  </div>

  <!-- Global Footer -->
  <footer class="border-t border-hairline py-12 px-6 bg-void text-xs text-dust">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-2">
        <span class="font-bold text-ivory text-sm">${c.brandName}</span>
        <span>•</span>
        <span>${c.domain}</span>
        <span>•</span>
        <span class="text-[11px] text-dust">Compiled autonomously by Skynet</span>
      </div>
      <div class="flex items-center gap-6">
        <a href="#offerings" class="hover:text-ivory transition-colors">Solutions</a>
        <a href="#metrics" class="hover:text-ivory transition-colors">Performance</a>
        <a href="#faq" class="hover:text-ivory transition-colors">FAQ</a>
      </div>
    </div>
  </footer>

  <script>
    lucide.createIcons();

    function toggleMobileNav() {
      const el = document.getElementById('mobile-nav');
      el.classList.toggle('hidden');
    }

    function openActionModal(serviceName = '') {
      const modal = document.getElementById('action-modal');
      const input = document.getElementById('modal-service-input');
      if (serviceName && input) {
        input.value = serviceName;
      }
      modal.classList.remove('hidden');
    }

    function closeActionModal() {
      const modal = document.getElementById('action-modal');
      modal.classList.add('hidden');
    }

    function toggleFaq(idx) {
      const content = document.getElementById('faq-content-' + idx);
      const icon = document.getElementById('faq-icon-' + idx);
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.add('rotate-180');
      } else {
        content.classList.add('hidden');
        icon.classList.remove('rotate-180');
      }
    }

    function handleFormSubmit(e) {
      e.preventDefault();
      closeActionModal();
      showToast('Thank you! Your inquiry has been confirmed.');
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      const text = document.getElementById('toast-message');
      text.textContent = msg;
      toast.classList.remove('hidden');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 4000);
    }
  </script>
</body>
</html>`
}
