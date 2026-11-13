"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Zap, Check, Sparkles, Rocket, Pencil, ArrowRight } from "lucide-react"
import { me, createProject } from "@/lib/api"

const EXAMPLE_PROMPTS = [
  "Artisan Sourdough Bakery with daily fresh loaves, pastry catalog, and online preorder pickup",
  "High-performance SaaS developer telemetry platform with interactive feature cards and pricing tiers",
  "Minimalist Architecture & Interior Design Studio with project portfolio and consultation booking",
  "Boutique Japanese Roastery with single-origin beans, tasting notes, and coffee subscription club",
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
        // not logged in — stay on landing
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
        `Project "${id}" created. Launching 13 specialist AI departments...`,
      )
      setBrief("")
      setTimeout(() => {
        if (id) {
          router.push(`/projects/${id}`)
        } else {
          router.push(`/dashboard`)
        }
      }, 1000)
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

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-skynet-border bg-skynet-surface text-skynet-amber text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent Autonomous Web Creator</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-skynet-ivory text-balance tracking-[-0.03em] leading-[1.05] mb-8">
              Build your website by describing it.
            </h1>
            <p className="text-lg text-skynet-dust max-w-2xl leading-relaxed mb-10">
              Type your idea in plain language. A team of 13 specialist AI agents researches, plans, designs, codes, tests, secures, and deploys a production website for you.
            </p>

            {user ? (
              <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                <label className="field-label" htmlFor="brief">
                  What kind of website do you want?
                </label>
                <textarea
                  id="brief"
                  className="block w-full px-4 py-3 rounded-md bg-transparent border border-skynet-border text-skynet-ivory placeholder-skynet-dust-sm focus:border-skynet-amber focus:ring-1 focus:ring-skynet-amber transition-colors"
                  rows={3}
                  placeholder="e.g. A bakery website with online ordering and a photo gallery"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  disabled={submitting}
                />

                {/* Example prompt pills */}
                <div className="space-y-1.5">
                  <div className="text-[11px] text-skynet-dust uppercase tracking-wider">Try an idea:</div>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLE_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setBrief(prompt)}
                        className="text-left text-xs px-2.5 py-1 rounded-md bg-skynet-surface hover:bg-skynet-surface-hover border border-skynet-border text-skynet-dust hover:text-skynet-ivory transition-colors line-clamp-1"
                      >
                        {prompt.split(" with ")[0]}...
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !brief.trim()}
                  className="btn-primary mt-4 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                >
                  <span>{submitting ? "Deploying Agents…" : "Build my website"}</span>
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

                {/* Example prompt preview pills */}
                <div className="pt-4 border-t border-skynet-border/50">
                  <div className="text-[11px] text-skynet-dust uppercase tracking-wider mb-2">Example prompts:</div>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLE_PROMPTS.map((prompt, i) => (
                      <Link
                        key={i}
                        href="/login"
                        className="text-xs px-3 py-1 rounded-md bg-skynet-surface hover:border-skynet-amber border border-skynet-border text-skynet-dust hover:text-skynet-ivory transition-colors"
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
      <div className="relative max-w-5xl mx-auto px-4 pt-10 pb-24 md:pt-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-skynet-ivory tracking-[-0.03em]">
          How Skynet works
        </h2>
        <ol className="mt-14 space-y-14">
          <Step
            n="01"
            icon={<Sparkles className="w-4 h-4" />}
            title="Describe your vision"
            description="Type what you want in ordinary language. No wireframes, coding, or technical jargon needed."
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

      {/* Trust Row */}
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
            <span>Multi-agent website generation engine</span>
          </div>
          <div className="flex items-center gap-4 text-skynet-dust">
            <span>Built with Next.js 14 &amp; Google Gemini</span>
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
