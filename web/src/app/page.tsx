"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Zap, Check, Sparkles, Rocket, Pencil, ArrowRight } from "lucide-react"
import { me, createProject } from "@/lib/api"

const EXAMPLE_PROMPTS = [
  "Boutique Japanese Roastery in Kyoto with single-origin beans, tasting notes, and coffee subscription club",
  "High-performance developer telemetry platform with interactive incident metrics and pricing tiers",
  "Minimalist Architecture Studio in Zurich with residential project portfolio and consultation booking",
  "Cybersecurity Threat Defense firm specializing in cloud infrastructure audits and incident response",
]

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [brief, setBrief] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle")
  const [message, setMessage] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        const res = await me()
        if (res.ok && res.data?.user) {
          setUser(res.data.user)
        }
      } catch {
        // not logged in
      }
    })()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!brief.trim()) return
    setSubmitting(true)
    setStatus("idle")
    try {
      const res = await createProject(brief)
      if (!res.ok) throw new Error(res.error || "Failed to create project")
      setStatus("ok")
      const id = res.data?.projectId
      setMessage(
        `Project created. 13 specialist AI departments are now building your site.`,
      )
      setBrief("")
      setTimeout(() => {
        if (id) {
          router.push(`/projects/${id}`)
        } else {
          router.push(`/dashboard`)
        }
      }, 900)
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-skynet-void">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="dust-field" aria-hidden="true">
          <div className="dust-layer dust-far" />
          <div className="dust-layer dust-mid" />
          <div className="dust-layer dust-near" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-skynet-ivory text-balance tracking-[-0.03em] leading-[1.05] mb-8">
              Build your website by describing it.
            </h1>
            <p className="text-lg md:text-xl text-skynet-dust max-w-2xl leading-relaxed mb-10">
              Type your idea in plain language. A team of 13 specialist AI agents researches, plans, designs, codes, tests, secures, and deploys a production website for you.
            </p>

            {user ? (
              <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                <label className="field-label" htmlFor="brief">
                  What kind of website do you want?
                </label>
                <textarea
                  id="brief"
                  className="block w-full px-4 py-3 rounded-md bg-transparent border border-skynet-border text-skynet-ivory placeholder-skynet-dust-sm focus:border-skynet-amber focus:ring-1 focus:ring-skynet-amber transition-colors text-base"
                  rows={3}
                  placeholder="e.g. A boutique hotel in Kyoto with room showcase, guest reviews, and online booking inquiry"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  disabled={submitting}
                />

                {/* Example prompt pills */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] text-skynet-dust uppercase tracking-wider">Example concepts:</div>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLE_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setBrief(prompt)}
                        className="text-left text-xs px-2.5 py-1 rounded-md bg-skynet-surface hover:bg-skynet-surface-hover border border-skynet-border text-skynet-dust hover:text-skynet-ivory transition-colors line-clamp-1"
                      >
                        {prompt.split(" with ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !brief.trim()}
                  className="btn-primary mt-4 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                >
                  <span>{submitting ? "Launching Agents…" : "Build my website"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="space-y-6 max-w-2xl">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <Link href="/login" className="btn-primary">
                    Build my website
                  </Link>
                  <Link
                    href="/login"
                    className="px-2 py-3 text-sm font-medium text-skynet-dust hover:text-skynet-amber transition-colors"
                  >
                    Already have an account? Log in
                  </Link>
                </div>

                <div className="pt-4 border-t border-skynet-border/50">
                  <div className="text-[11px] text-skynet-dust uppercase tracking-wider mb-2">Example concepts:</div>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLE_PROMPTS.map((prompt, i) => (
                      <Link
                        key={i}
                        href="/login"
                        className="text-xs px-3 py-1.5 rounded-md bg-skynet-surface hover:border-skynet-amber border border-skynet-border text-skynet-dust hover:text-skynet-ivory transition-colors"
                      >
                        {prompt.split(" with ")[0]}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {status === "ok" && (
              <div className="mt-8 p-4 rounded-md bg-skynet-surface text-skynet-amber text-sm flex items-center gap-3 border border-skynet-amber/30">
                <Pencil className="w-4 h-4" />
                <span>{message}</span>
              </div>
            )}
            {status === "error" && (
              <div className="mt-8 p-4 rounded-md bg-skynet-surface text-skynet-error text-sm flex items-center gap-3 border border-skynet-error/30">
                <Pencil className="w-4 h-4 text-skynet-error" />
                <span>{message}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-24">
        <h2 className="text-3xl md:text-4xl font-semibold text-skynet-ivory tracking-[-0.03em]">
          How Skynet works
        </h2>
        <ol className="mt-14 space-y-14">
          <Step
            n="01"
            icon={<Sparkles className="w-4 h-4" />}
            title="Describe your vision"
            description="Type what you want in plain words. No wireframes, design tools, or server setup needed."
          />
          <Step
            n="02"
            icon={<Zap className="w-4 h-4" />}
            title="13 Specialist agents execute"
            description="Requirements, UX, UI, database, backend, frontend, QA, security, and SEO agents build your project with rigorous dependency ordering."
          />
          <Step
            n="03"
            icon={<Rocket className="w-4 h-4" />}
            title="Inspect, download, or launch"
            description="Interact with the live website in the embedded responsive preview, download the complete source code, or deploy with verified quality gates."
          />
        </ol>
      </div>

      {/* Pricing Section */}
      <div className="relative max-w-5xl mx-auto px-4 py-16 border-t border-skynet-border/50">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skynet-amber/10 border border-skynet-amber/30 text-skynet-amber text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Simple Transparent Plans
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-skynet-ivory tracking-tight mb-3">
            Pick Your Premium Pack
          </h2>
          <p className="text-sm md:text-base text-skynet-dust">
            Start free, upgrade to use your website, or deploy with your own host and custom domain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-8">
          {/* Free Tier */}
          <div className="rounded-xl p-6 bg-skynet-surface border border-skynet-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-semibold text-skynet-dust tracking-wider">
                  Basic Plan
                </span>
                <span className="text-[10px] uppercase font-bold bg-skynet-void px-2 py-0.5 rounded text-skynet-dust border border-skynet-border">
                  Free
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-4xl font-extrabold text-skynet-ivory font-mono">$0</span>
                <span className="text-xs text-skynet-dust">/ forever</span>
              </div>
              <p className="text-xs text-skynet-dust leading-relaxed mb-4">
                Explore AI synthesis, interactive responsive preview, and 13 agent telemetry.
              </p>
              <ul className="space-y-2 border-t border-skynet-border/50 pt-4 text-xs text-skynet-dust">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-skynet-amber" /> 13-Department Agent Swarm</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-skynet-amber" /> Live Multi-device Preview</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-skynet-amber" /> Full HTML/CSS/JS Viewer</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="mt-6 block text-center w-full py-2.5 px-3 rounded-lg text-xs font-semibold bg-skynet-void border border-skynet-border text-skynet-ivory hover:border-skynet-amber transition-colors"
            >
              Start for Free
            </Link>
          </div>

          {/* Advance Tier */}
          <div className="rounded-xl p-6 bg-skynet-surface border border-skynet-amber/70 ring-1 ring-skynet-amber/40 shadow-[0_0_25px_rgba(255,185,0,0.15)] flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-skynet-amber text-skynet-void text-[10px] font-bold uppercase tracking-wider py-0.5 px-3 rounded-full">
              Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between mb-2 mt-1">
                <span className="text-xs uppercase font-semibold text-skynet-amber tracking-wider">
                  Advance Plan
                </span>
                <span className="text-[10px] uppercase font-bold bg-skynet-amber/20 px-2 py-0.5 rounded text-skynet-amber border border-skynet-amber/40">
                  Full Use
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-4xl font-extrabold text-skynet-ivory font-mono">$19</span>
                <span className="text-xs text-skynet-dust">/ month</span>
              </div>
              <p className="text-xs text-skynet-dust leading-relaxed mb-4">
                Full use of your website with 1-click clean production code download and cloud hosting.
              </p>
              <ul className="space-y-2 border-t border-skynet-border/50 pt-4 text-xs text-skynet-ivory">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-skynet-amber" /> Full Use &amp; Commercial Rights</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-skynet-amber" /> 1-Click .zip Code Export</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-skynet-amber" /> Skynet Cloud Hosting</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-skynet-amber" /> No Watermarks or Branding</li>
              </ul>
            </div>
            <Link
              href="/pricing"
              className="mt-6 block text-center w-full py-2.5 px-3 rounded-lg text-xs font-bold bg-skynet-amber text-skynet-void hover:bg-skynet-amber-bright transition-colors"
            >
              Get Advance Plan ($19)
            </Link>
          </div>

          {/* Host Tier */}
          <div className="rounded-xl p-6 bg-skynet-surface border border-skynet-success/50 hover:border-skynet-success shadow-[0_0_25px_rgba(16,185,129,0.1)] flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-skynet-success text-skynet-void text-[10px] font-bold uppercase tracking-wider py-0.5 px-3 rounded-full">
              Production Host
            </div>
            <div>
              <div className="flex items-center justify-between mb-2 mt-1">
                <span className="text-xs uppercase font-semibold text-skynet-success tracking-wider">
                  Deploy with Own Host
                </span>
                <span className="text-[10px] uppercase font-bold bg-skynet-success/20 px-2 py-0.5 rounded text-skynet-success border border-skynet-success/40">
                  Custom Domain
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-4xl font-extrabold text-skynet-ivory font-mono">$29</span>
                <span className="text-xs text-skynet-dust">/ month</span>
              </div>
              <p className="text-xs text-skynet-dust leading-relaxed mb-4">
                Deploy with your own host and connect custom domains with free automated SSL.
              </p>
              <ul className="space-y-2 border-t border-skynet-border/50 pt-4 text-xs text-skynet-ivory">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-skynet-success" /> Deploy to Your Own Host &amp; Server</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-skynet-success" /> Custom Domain (e.g. brand.com)</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-skynet-success" /> Free Automated SSL/TLS</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-skynet-success" /> 1-Click Vercel, Netlify &amp; VPS</li>
              </ul>
            </div>
            <Link
              href="/pricing"
              className="mt-6 block text-center w-full py-2.5 px-3 rounded-lg text-xs font-bold bg-skynet-success text-skynet-void hover:bg-emerald-400 transition-colors"
            >
              Deploy with Own Host ($29)
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-xs font-semibold text-skynet-dust hover:text-skynet-amber transition-colors"
          >
            <span>Compare all features in detail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Trust row */}
      <div className="relative py-16 border-t border-skynet-border/50">
        <div className="max-w-5xl mx-auto px-4">
          <ul className="flex flex-col sm:flex-row gap-6 sm:gap-12 justify-center">
            <TrustItem label="Zero coding required" />
            <TrustItem label="Responsive across all devices" />
            <TrustItem label="Automated QA & Security Gate" />
            <TrustItem label="One-click Code Export & Download" />
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-skynet-border/40 py-10 px-4 text-center text-xs text-skynet-dust">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-skynet-ivory text-sm">Skynet</span>
            <span>•</span>
            <span>Multi-agent autonomous website platform</span>
          </div>
          <div className="flex items-center gap-4 text-skynet-dust">
            <span>Powered by Next.js 14 &amp; Google Gemini</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Step({
  n,
  icon,
  title,
  description,
}: {
  n: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <li className="grid md:grid-cols-12 gap-5 md:gap-10 items-start">
      <span className="md:col-span-2 text-5xl md:text-6xl font-bold text-skynet-amber/60 tracking-[-0.03em] tabular-nums leading-none select-none">
        {n}
      </span>
      <div className="md:col-span-10">
        <h3 className="flex items-center gap-3 text-xl md:text-2xl font-medium text-skynet-ivory tracking-[-0.02em] mb-3">
          <span className="text-skynet-amber">{icon}</span>
          {title}
        </h3>
        <p className="text-base text-skynet-dust leading-relaxed max-w-[65ch]">
          {description}
        </p>
      </div>
    </li>
  )
}

function TrustItem({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-2 text-skynet-dust-sm text-sm">
      <Check className="w-4 h-4 text-skynet-amber" />
      {label}
    </li>
  )
}
