"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Check,
  X,
  Sparkles,
  Zap,
  Server,
  Globe,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
} from "lucide-react"
import { me, SubscriptionPlan, updateUserPlan } from "@/lib/api"

export default function PricingPage() {
  const [user, setUser] = useState<{ email: string; name: string; plan?: SubscriptionPlan } | null>(null)
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>("free")
  const [loading, setLoading] = useState(true)
  const [upgradingPlan, setUpgradingPlan] = useState<SubscriptionPlan | null>(null)
  const [bannerMsg, setBannerMsg] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        const res = await me()
        if (res.ok && res.data?.user) {
          setUser(res.data.user)
          setCurrentPlan(res.data.user.plan || "free")
        }
      } catch {
        // guest
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    if (!user) {
      window.location.href = "/login"
      return
    }
    if (plan === currentPlan) return

    setUpgradingPlan(plan)
    try {
      const res = await updateUserPlan(plan)
      if (res.ok) {
        setCurrentPlan(plan)
        setBannerMsg(
          plan === "host"
            ? "Congratulations! You are now on the Custom Host Plan ($29/mo). Deploy with your own host is activated."
            : plan === "advance"
            ? "Congratulations! You are now on the Advance Plan ($19/mo). Full website use and code export are activated."
            : "Switched to Basic Free Plan.",
        )
        setTimeout(() => setBannerMsg(""), 5000)
      }
    } catch {
      // handled
    } finally {
      setUpgradingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-skynet-void">
      {/* Background dust */}
      <div className="dust-field" aria-hidden="true">
        <div className="dust-layer dust-far" />
        <div className="dust-layer dust-mid" />
        <div className="dust-layer dust-near" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-24 pb-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skynet-amber/10 border border-skynet-amber/30 text-skynet-amber text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent, Simple Pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-skynet-ivory tracking-tight mb-4 text-balance">
            Premium Packs for Every Stage
          </h1>
          <p className="text-base md:text-lg text-skynet-dust leading-relaxed text-balance">
            Generate and preview websites for free. Upgrade to Advance ($19) to own and use your site, or choose Custom Host ($29) to deploy directly to your own servers and custom domains.
          </p>
        </div>

        {/* Banner Alert */}
        {bannerMsg && (
          <div className="max-w-2xl mx-auto mb-10 p-4 rounded-xl bg-skynet-success/10 border border-skynet-success/40 text-skynet-success text-sm flex items-center gap-3 justify-center shadow-lg animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{bannerMsg}</span>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-24">
          {/* Card 1: Basic (Free) */}
          <div
            className={`rounded-2xl p-7 flex flex-col justify-between border transition-all ${
              currentPlan === "free" && user
                ? "bg-skynet-surface border-skynet-dust/40 ring-1 ring-skynet-dust/30"
                : "bg-skynet-surface/70 border-skynet-border hover:border-skynet-border/80"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-semibold text-skynet-dust tracking-wider">
                  Basic Plan
                </span>
                {user && currentPlan === "free" && (
                  <span className="text-[10px] uppercase font-bold bg-skynet-void px-2 py-0.5 rounded text-skynet-dust border border-skynet-border">
                    Current Plan
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-5xl font-extrabold text-skynet-ivory font-mono">$0</span>
                <span className="text-sm text-skynet-dust font-medium">/ forever</span>
              </div>
              <p className="text-xs text-skynet-dust leading-relaxed mb-6">
                Test ideas, run 13-agent generation pipelines, and preview full websites in interactive viewports.
              </p>

              <div className="border-t border-skynet-border/60 pt-5 space-y-3">
                <div className="text-[11px] font-semibold text-skynet-ivory uppercase tracking-wider mb-2">
                  What's included:
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span>13-Department Autonomous AI Swarm</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span>Desktop, Tablet &amp; Mobile Live Previews</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span>Real-time Agent Telemetry &amp; Logs</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span>HTML5, CSS &amp; JavaScript Code Viewer</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-dust opacity-40 line-through">
                  <X className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Export &amp; Download code</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-dust opacity-40 line-through">
                  <X className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Deploy to your own host / domain</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {user ? (
                <button
                  onClick={() => handleUpgrade("free")}
                  disabled={currentPlan === "free" || upgradingPlan !== null}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-semibold transition-all ${
                    currentPlan === "free"
                      ? "bg-skynet-void border border-skynet-border text-skynet-dust cursor-default"
                      : "bg-skynet-surface border border-skynet-border text-skynet-ivory hover:border-skynet-amber"
                  }`}
                >
                  {currentPlan === "free" ? "Active Free Plan" : "Downgrade to Free"}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block text-center w-full py-3 px-4 rounded-xl text-xs font-semibold bg-skynet-surface border border-skynet-border text-skynet-ivory hover:border-skynet-amber transition-all"
                >
                  Get Started Free
                </Link>
              )}
            </div>
          </div>

          {/* Card 2: Advance ($19) */}
          <div
            className={`rounded-2xl p-7 flex flex-col justify-between border relative transition-all ${
              currentPlan === "advance" && user
                ? "bg-skynet-surface border-skynet-amber ring-2 ring-skynet-amber/50 shadow-[0_0_40px_rgba(255,185,0,0.25)]"
                : "bg-skynet-surface border-skynet-amber/50 hover:border-skynet-amber shadow-[0_0_30px_rgba(255,185,0,0.12)]"
            }`}
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-skynet-amber text-skynet-void text-[10px] font-extrabold uppercase tracking-widest py-1 px-4 rounded-full shadow-lg">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 mt-1">
                <span className="text-xs uppercase font-semibold text-skynet-amber tracking-wider">
                  Advance Plan
                </span>
                {user && currentPlan === "advance" && (
                  <span className="text-[10px] uppercase font-bold bg-skynet-amber/20 px-2 py-0.5 rounded text-skynet-amber border border-skynet-amber/40">
                    Current Plan
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-5xl font-extrabold text-skynet-ivory font-mono">$19</span>
                <span className="text-sm text-skynet-dust font-medium">/ month</span>
              </div>
              <p className="text-xs text-skynet-dust leading-relaxed mb-6">
                Full use of your website. Download production-ready code bundles and host directly on Skynet Cloud.
              </p>

              <div className="border-t border-skynet-border/60 pt-5 space-y-3">
                <div className="text-[11px] font-semibold text-skynet-amber uppercase tracking-wider mb-2">
                  Full Website Use:
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-ivory">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span className="font-semibold">Full Use &amp; Commercial Rights of Website</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-ivory">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span className="font-semibold">1-Click .zip Production Download</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span>Live hosting on Skynet Global Cloud</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span>High-speed Gemini AI neural inference queue</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span>Unlimited prompt refinements &amp; rebuilds</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span>Zero Skynet branding or watermarks</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {user ? (
                <button
                  onClick={() => handleUpgrade("advance")}
                  disabled={currentPlan === "advance" || upgradingPlan !== null}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md ${
                    currentPlan === "advance"
                      ? "bg-skynet-amber/20 border border-skynet-amber text-skynet-amber cursor-default"
                      : "bg-skynet-amber text-skynet-void hover:bg-skynet-amber-bright hover:shadow-[0_0_20px_rgba(255,185,0,0.5)]"
                  }`}
                >
                  {upgradingPlan === "advance"
                    ? "Activating..."
                    : currentPlan === "advance"
                    ? "Active Plan"
                    : "Upgrade to Advance ($19)"}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block text-center w-full py-3 px-4 rounded-xl text-xs font-bold bg-skynet-amber text-skynet-void hover:bg-skynet-amber-bright transition-all shadow-md"
                >
                  Choose Advance ($19)
                </Link>
              )}
            </div>
          </div>

          {/* Card 3: Custom Host ($29) */}
          <div
            className={`rounded-2xl p-7 flex flex-col justify-between border relative transition-all ${
              currentPlan === "host" && user
                ? "bg-skynet-surface border-skynet-success ring-2 ring-skynet-success/50 shadow-[0_0_40px_rgba(16,185,129,0.25)]"
                : "bg-skynet-surface border-skynet-border hover:border-skynet-success/70 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
            }`}
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-skynet-success text-skynet-void text-[10px] font-extrabold uppercase tracking-widest py-1 px-4 rounded-full shadow-lg">
              Own Host Deployment
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 mt-1">
                <span className="text-xs uppercase font-semibold text-skynet-success tracking-wider">
                  Deploy with Own Host
                </span>
                {user && currentPlan === "host" && (
                  <span className="text-[10px] uppercase font-bold bg-skynet-success/20 px-2 py-0.5 rounded text-skynet-success border border-skynet-success/40">
                    Current Plan
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-5xl font-extrabold text-skynet-ivory font-mono">$29</span>
                <span className="text-sm text-skynet-dust font-medium">/ month</span>
              </div>
              <p className="text-xs text-skynet-dust leading-relaxed mb-6">
                Deploy with your own host and connect custom domains with automated SSL and multi-server syncing.
              </p>

              <div className="border-t border-skynet-border/60 pt-5 space-y-3">
                <div className="text-[11px] font-semibold text-skynet-success uppercase tracking-wider mb-2">
                  Own Host &amp; Infrastructure:
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-ivory">
                  <Check className="w-4 h-4 text-skynet-success shrink-0 mt-0.5" />
                  <span className="font-semibold">Deploy to Your Own Host &amp; Servers</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-ivory">
                  <Check className="w-4 h-4 text-skynet-success shrink-0 mt-0.5" />
                  <span>Custom Domain Connection (e.g. www.brand.com)</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-success shrink-0 mt-0.5" />
                  <span>Free Automated SSL/TLS Certificate Provisioning</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-success shrink-0 mt-0.5" />
                  <span>1-Click Deploy to Vercel, Netlify, VPS &amp; FTP</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-success shrink-0 mt-0.5" />
                  <span>Automated CNAME &amp; A-Record DNS Engine</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-success shrink-0 mt-0.5" />
                  <span>Dedicated DevOps Autonomous Agent</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {user ? (
                <button
                  onClick={() => handleUpgrade("host")}
                  disabled={currentPlan === "host" || upgradingPlan !== null}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md ${
                    currentPlan === "host"
                      ? "bg-skynet-success/20 border border-skynet-success text-skynet-success cursor-default"
                      : "bg-skynet-success text-skynet-void hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                  }`}
                >
                  {upgradingPlan === "host"
                    ? "Activating..."
                    : currentPlan === "host"
                    ? "Active Plan"
                    : "Deploy with Own Host ($29)"}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block text-center w-full py-3 px-4 rounded-xl text-xs font-bold bg-skynet-success text-skynet-void hover:bg-emerald-400 transition-all shadow-md"
                >
                  Choose Custom Host ($29)
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="mb-24">
          <h2 className="text-2xl md:text-3xl font-bold text-skynet-ivory text-center mb-8">
            Plan Feature Comparison
          </h2>
          <div className="rounded-xl bg-skynet-surface border border-skynet-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-skynet-border bg-skynet-void/60 text-skynet-dust uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">Features</th>
                    <th className="py-4 px-6 font-semibold text-center">Basic (Free)</th>
                    <th className="py-4 px-6 font-semibold text-center text-skynet-amber">Advance ($19)</th>
                    <th className="py-4 px-6 font-semibold text-center text-skynet-success">Own Host ($29)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-skynet-border/50 text-skynet-ivory">
                  <tr>
                    <td className="py-3.5 px-6 font-medium">Autonomous 13-Department Agent Swarm</td>
                    <td className="py-3.5 px-6 text-center text-skynet-amber"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3.5 px-6 text-center text-skynet-amber"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3.5 px-6 text-center text-skynet-success"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-6 font-medium">Interactive Multi-Device Live Preview</td>
                    <td className="py-3.5 px-6 text-center text-skynet-amber"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3.5 px-6 text-center text-skynet-amber"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3.5 px-6 text-center text-skynet-success"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-6 font-medium">Use of the Website &amp; Commercial Ownership</td>
                    <td className="py-3.5 px-6 text-center text-skynet-dust opacity-40"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3.5 px-6 text-center text-skynet-amber font-semibold"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3.5 px-6 text-center text-skynet-success font-semibold"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-6 font-medium">1-Click Production Code Download (.zip)</td>
                    <td className="py-3.5 px-6 text-center text-skynet-dust opacity-40"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3.5 px-6 text-center text-skynet-amber"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3.5 px-6 text-center text-skynet-success"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-6 font-medium">Deploy to Your Own Host / Server (VPS, FTP)</td>
                    <td className="py-3.5 px-6 text-center text-skynet-dust opacity-40"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3.5 px-6 text-center text-skynet-dust opacity-40"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3.5 px-6 text-center text-skynet-success font-semibold"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-6 font-medium">Custom Domain Connection &amp; Free SSL</td>
                    <td className="py-3.5 px-6 text-center text-skynet-dust opacity-40"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3.5 px-6 text-center text-skynet-dust opacity-40"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3.5 px-6 text-center text-skynet-success"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-6 font-medium">1-Click Vercel, Netlify &amp; GitHub Pages Deploy</td>
                    <td className="py-3.5 px-6 text-center text-skynet-dust opacity-40"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3.5 px-6 text-center text-skynet-dust opacity-40"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3.5 px-6 text-center text-skynet-success"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-skynet-ivory text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FaqItem
              question="What is included in the Basic Free Plan?"
              answer="The Basic plan is 100% free forever. It allows you to create projects, generate full websites using our 13-agent autonomous swarm, inspect the generated HTML/CSS/JS code, and interact with the responsive live preview across desktop, tablet, and mobile devices."
            />
            <FaqItem
              question="What does the Advance Plan ($19) unlock?"
              answer="The Advance plan gives you full rights to use your website. You can download the production code bundle (.zip with clean HTML5, Tailwind CSS, Lucide icons, and JS), host it live on Skynet Cloud, enjoy priority AI generation speeds, and utilize the website for your business with zero watermarks."
            />
            <FaqItem
              question="How does deploying with my own host ($29) work?"
              answer="The Custom Host Plan allows you to connect your own domain (e.g. www.yourcompany.com) with automated SSL/TLS certificates. You can also deploy directly to your own servers via custom FTP/SFTP, Webhooks, or 1-click cloud connectors for Vercel, Netlify, and GitHub Pages."
            />
            <FaqItem
              question="Can I upgrade or switch plans at any time?"
              answer="Yes! You can upgrade, downgrade, or cancel anytime directly from your dashboard or this pricing page. Upgrades take effect immediately."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl bg-skynet-surface border border-skynet-border p-4 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left text-sm font-semibold text-skynet-ivory gap-4"
      >
        <span>{question}</span>
        <span className={`text-skynet-amber transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <p className="mt-3 text-xs text-skynet-dust leading-relaxed border-t border-skynet-border/50 pt-3">{answer}</p>}
    </div>
  )
}
