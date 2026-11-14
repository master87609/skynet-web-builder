"use client"

import { useState } from "react"
import { Check, Sparkles, X, Shield, Globe, ArrowRight, Server, Zap, CheckCircle2 } from "lucide-react"
import { SubscriptionPlan, updateUserPlan } from "@/lib/api"

interface PlanUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan?: SubscriptionPlan
  requiredPlan?: SubscriptionPlan
  featureRequested?: string
  onPlanUpdated?: (newPlan: SubscriptionPlan) => void
}

export default function PlanUpgradeModal({
  isOpen,
  onClose,
  currentPlan = "free",
  requiredPlan,
  featureRequested,
  onPlanUpdated,
}: PlanUpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(requiredPlan || "advance")
  const [processing, setProcessing] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  if (!isOpen) return null

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    if (plan === currentPlan) return

    setProcessing(true)
    try {
      const res = await updateUserPlan(plan)
      if (res.ok) {
        setSuccessMsg(
          plan === "host"
            ? "Upgraded to Custom Host Plan ($29/mo). Deploy with your own host and custom domain is now active!"
            : plan === "advance"
            ? "Upgraded to Advance Plan ($19/mo). Full website use and production export unlocked!"
            : "Switched to Basic Free Plan.",
        )
        if (onPlanUpdated) {
          onPlanUpdated(plan)
        }
        setTimeout(() => {
          setSuccessMsg("")
          onClose()
        }, 1600)
      }
    } catch {
      // error handled in apiJson
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-skynet-void border border-skynet-border rounded-2xl max-w-4xl w-full p-6 md:p-8 relative shadow-[0_0_50px_rgba(0,0,0,0.8)] my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-skynet-dust hover:text-skynet-ivory p-1.5 rounded-lg bg-skynet-surface border border-skynet-border hover:border-skynet-amber transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skynet-amber/10 border border-skynet-amber/30 text-skynet-amber text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Skynet Premium Packs
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-skynet-ivory tracking-tight">
            Choose the Right Plan for Your Website
          </h2>
          {featureRequested ? (
            <p className="text-sm text-skynet-amber mt-2">
              <span className="font-semibold">{featureRequested}</span> is available on the{" "}
              {requiredPlan === "host" ? "Custom Host Plan ($29)" : "Advance Plan ($19)"}.
            </p>
          ) : (
            <p className="text-sm text-skynet-dust mt-2">
              Start free with AI generation &amp; preview, upgrade to Advance to use your site, or choose Custom Host to deploy on your own domain &amp; servers.
            </p>
          )}
        </div>

        {/* Success banner */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-skynet-success/10 border border-skynet-success/30 text-skynet-success text-sm flex items-center gap-3 justify-center animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Basic Plan (Free) */}
          <div
            className={`rounded-xl p-6 flex flex-col justify-between border transition-all ${
              currentPlan === "free"
                ? "bg-skynet-surface border-skynet-dust/40 ring-1 ring-skynet-dust/30"
                : "bg-skynet-surface/60 border-skynet-border hover:border-skynet-border/80"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-semibold text-skynet-dust tracking-wider">
                  Basic Plan
                </span>
                {currentPlan === "free" && (
                  <span className="text-[10px] uppercase font-bold bg-skynet-void px-2 py-0.5 rounded text-skynet-dust border border-skynet-border">
                    Active
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-4xl font-extrabold text-skynet-ivory font-mono">$0</span>
                <span className="text-xs text-skynet-dust font-medium">/ forever</span>
              </div>
              <p className="text-xs text-skynet-dust leading-relaxed mb-5">
                Explore AI site synthesis, interactive responsive preview, and 13 agent telemetry.
              </p>

              <div className="border-t border-skynet-border/60 pt-4 space-y-2.5">
                <div className="text-[11px] font-semibold text-skynet-ivory uppercase tracking-wider mb-2">
                  What's included:
                </div>
                <div className="flex items-start gap-2 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span>13 Autonomous AI Departments</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span>Live Desktop, Tablet &amp; Mobile Preview</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span>Full HTML5, CSS &amp; JS Code Viewer</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-skynet-dust opacity-50 line-through">
                  <X className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Export &amp; Download code</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-skynet-dust opacity-50 line-through">
                  <X className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Deploy to your own host / domain</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan("free")}
              disabled={processing || currentPlan === "free"}
              className={`w-full mt-6 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
                currentPlan === "free"
                  ? "bg-skynet-void border border-skynet-border text-skynet-dust cursor-default"
                  : "bg-skynet-void hover:bg-skynet-surface border border-skynet-border text-skynet-ivory"
              }`}
            >
              {currentPlan === "free" ? "Current Tier" : "Switch to Free"}
            </button>
          </div>

          {/* 2. Advance Plan ($19) */}
          <div
            className={`rounded-xl p-6 flex flex-col justify-between border relative transition-all ${
              currentPlan === "advance"
                ? "bg-skynet-surface border-skynet-amber ring-2 ring-skynet-amber/40 shadow-[0_0_30px_rgba(255,185,0,0.2)]"
                : "bg-skynet-surface border-skynet-amber/40 hover:border-skynet-amber/80 shadow-[0_0_20px_rgba(255,185,0,0.1)]"
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-skynet-amber text-skynet-void text-[10px] font-bold uppercase tracking-wider py-0.5 px-3 rounded-full shadow-md">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 mt-1">
                <span className="text-xs uppercase font-semibold text-skynet-amber tracking-wider">
                  Advance Plan
                </span>
                {currentPlan === "advance" && (
                  <span className="text-[10px] uppercase font-bold bg-skynet-amber/20 px-2 py-0.5 rounded text-skynet-amber border border-skynet-amber/40">
                    Active
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-4xl font-extrabold text-skynet-ivory font-mono">$19</span>
                <span className="text-xs text-skynet-dust font-medium">/ month</span>
              </div>
              <p className="text-xs text-skynet-dust leading-relaxed mb-5">
                Full use of your website: 1-click clean code export, live cloud hosting, and commercial rights.
              </p>

              <div className="border-t border-skynet-border/60 pt-4 space-y-2.5">
                <div className="text-[11px] font-semibold text-skynet-amber uppercase tracking-wider mb-2">
                  Full Website Use:
                </div>
                <div className="flex items-start gap-2 text-xs text-skynet-ivory">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span className="font-medium">1-Click .zip Production Download</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-skynet-ivory">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span>Full Commercial Ownership &amp; Rights</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span>Live hosting on Skynet Cloud</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span>High-speed Gemini AI neural inference</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-amber shrink-0 mt-0.5" />
                  <span>No Skynet watermarks or branding</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan("advance")}
              disabled={processing || currentPlan === "advance"}
              className={`w-full mt-6 py-2.5 px-4 rounded-lg text-xs font-bold transition-all shadow-md ${
                currentPlan === "advance"
                  ? "bg-skynet-amber/20 border border-skynet-amber text-skynet-amber cursor-default"
                  : "bg-skynet-amber text-skynet-void hover:bg-skynet-amber-bright"
              }`}
            >
              {processing && selectedPlan === "advance"
                ? "Activating..."
                : currentPlan === "advance"
                ? "Current Active Plan"
                : "Upgrade to Advance — $19"}
            </button>
          </div>

          {/* 3. Custom Host Plan ($29) */}
          <div
            className={`rounded-xl p-6 flex flex-col justify-between border relative transition-all ${
              currentPlan === "host"
                ? "bg-skynet-surface border-skynet-success ring-2 ring-skynet-success/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                : "bg-skynet-surface border-skynet-border hover:border-skynet-success/60 shadow-[0_0_20px_rgba(16,185,129,0.08)]"
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-skynet-success text-skynet-void text-[10px] font-bold uppercase tracking-wider py-0.5 px-3 rounded-full shadow-md">
              Production Host
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 mt-1">
                <span className="text-xs uppercase font-semibold text-skynet-success tracking-wider">
                  Deploy with Own Host
                </span>
                {currentPlan === "host" && (
                  <span className="text-[10px] uppercase font-bold bg-skynet-success/20 px-2 py-0.5 rounded text-skynet-success border border-skynet-success/40">
                    Active
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-4xl font-extrabold text-skynet-ivory font-mono">$29</span>
                <span className="text-xs text-skynet-dust font-medium">/ month</span>
              </div>
              <p className="text-xs text-skynet-dust leading-relaxed mb-5">
                Deploy with your own host, connect custom domains with free automated SSL, and sync to your servers.
              </p>

              <div className="border-t border-skynet-border/60 pt-4 space-y-2.5">
                <div className="text-[11px] font-semibold text-skynet-success uppercase tracking-wider mb-2">
                  Own Host Deployment:
                </div>
                <div className="flex items-start gap-2 text-xs text-skynet-ivory">
                  <Check className="w-4 h-4 text-skynet-success shrink-0 mt-0.5" />
                  <span className="font-medium">Deploy to Your Own Host &amp; Servers</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-skynet-ivory">
                  <Check className="w-4 h-4 text-skynet-success shrink-0 mt-0.5" />
                  <span>Custom Domain Connection (e.g. yoursite.com)</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-success shrink-0 mt-0.5" />
                  <span>Free Automated SSL/TLS Certificates</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-success shrink-0 mt-0.5" />
                  <span>1-Click Deploy to Vercel, Netlify &amp; VPS</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-success shrink-0 mt-0.5" />
                  <span>Automated CNAME &amp; A-Record DNS Engine</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-skynet-dust">
                  <Check className="w-4 h-4 text-skynet-success shrink-0 mt-0.5" />
                  <span>Dedicated DevOps Autonomous Agent</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan("host")}
              disabled={processing || currentPlan === "host"}
              className={`w-full mt-6 py-2.5 px-4 rounded-lg text-xs font-bold transition-all shadow-md ${
                currentPlan === "host"
                  ? "bg-skynet-success/20 border border-skynet-success text-skynet-success cursor-default"
                  : "bg-skynet-success text-skynet-void hover:bg-emerald-400"
              }`}
            >
              {processing && selectedPlan === "host"
                ? "Activating..."
                : currentPlan === "host"
                ? "Current Active Plan"
                : "Upgrade to Custom Host — $29"}
            </button>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="mt-8 pt-5 border-t border-skynet-border/50 flex flex-col sm:flex-row items-center justify-between text-xs text-skynet-dust gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-skynet-amber" />
            <span>Instant activation • Cancel anytime • 14-day satisfaction guarantee</span>
          </div>
          <button onClick={onClose} className="hover:text-skynet-ivory underline">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
