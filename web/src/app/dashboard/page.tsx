"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Sparkles,
  Plus,
  Folder,
  ChevronRight,
  Pencil,
  ArrowRight,
  ExternalLink,
  Key,
  Shield,
  Server,
  Download,
} from "lucide-react"
import { listProjects, createProject, getSettingsStatus, me, ProjectSummary, SubscriptionPlan } from "@/lib/api"
import PlanUpgradeModal from "@/components/PlanUpgradeModal"

export default function DashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [brief, setBrief] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle")
  const [message, setMessage] = useState("")
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null)
  const [userPlan, setUserPlan] = useState<SubscriptionPlan>("free")
  const [showPlanModal, setShowPlanModal] = useState(false)

  useEffect(() => {
    loadProjects()
    checkAiStatus()
    checkUserPlan()
  }, [])

  async function checkUserPlan() {
    try {
      const res = await me()
      if (res.ok && res.data?.user) {
        setUserPlan(res.data.user.plan || "free")
      }
    } catch {}
  }

  async function checkAiStatus() {
    try {
      const res = await getSettingsStatus()
      if (res.ok && res.data) {
        setAiConfigured(res.data.configured)
      }
    } catch {}
  }

  async function loadProjects() {
    setLoading(true)
    try {
      const data = await listProjects()
      setProjects(data)
    } catch {
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!brief.trim()) return
    setSubmitting(true)
    setStatus("idle")
    try {
      const res = await createProject(brief)
      if (!res.ok) throw new Error(res.error || "Failed to create project")
      setStatus("ok")
      const newId = res.data?.projectId
      setMessage(`Project "${newId}" created. Launching autonomous agents...`)
      setBrief("")
      setTimeout(() => {
        if (newId) {
          router.push(`/projects/${newId}`)
        } else {
          loadProjects()
        }
      }, 1000)
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "Something went wrong")
      setSubmitting(false)
    }
  }

  const phaseLabel = (p: string) =>
    p
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-skynet-ivory tracking-[-0.02em]">
            Dashboard
          </h1>
          <p className="text-skynet-dust text-sm mt-1">
            Manage your websites and observe specialist AI departments building your projects.
          </p>
        </div>
        <Link
          href="/"
          className="btn-ghost self-start hover:bg-skynet-surface hover:border-skynet-amber hover:text-skynet-amber text-xs py-2.5 px-4"
        >
          <Plus className="w-3.5 h-3.5" />
          Describe new idea
        </Link>
      </div>

      {/* Plan Status Banner */}
      <div className="rounded-xl border border-skynet-border bg-skynet-surface/80 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              userPlan === "host"
                ? "bg-skynet-success/20 text-skynet-success"
                : userPlan === "advance"
                ? "bg-skynet-amber/20 text-skynet-amber"
                : "bg-skynet-void border border-skynet-border text-skynet-dust"
            }`}
          >
            {userPlan === "host" ? (
              <Server className="w-4 h-4" />
            ) : userPlan === "advance" ? (
              <Download className="w-4 h-4" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-skynet-ivory">
                {userPlan === "host"
                  ? "Custom Host Plan ($29/mo)"
                  : userPlan === "advance"
                  ? "Advance Plan ($19/mo)"
                  : "Basic Plan (Free $0)"}
              </span>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                  userPlan === "host"
                    ? "bg-skynet-success/15 border-skynet-success/40 text-skynet-success"
                    : userPlan === "advance"
                    ? "bg-skynet-amber/15 border-skynet-amber/40 text-skynet-amber"
                    : "bg-skynet-void border-skynet-border text-skynet-dust"
                }`}
              >
                Active
              </span>
            </div>
            <p className="text-xs text-skynet-dust mt-0.5">
              {userPlan === "host"
                ? "Deploy to your own host & custom domain with automated SSL active."
                : userPlan === "advance"
                ? "Full website use & 1-click production .zip code downloads active."
                : "Free preview active. Upgrade to Advance ($19) to use site or Custom Host ($29) for your own domain."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/pricing"
            className="text-xs text-skynet-dust hover:text-skynet-ivory px-3 py-1.5 transition-colors"
          >
            View Plans
          </Link>
          <button
            onClick={() => setShowPlanModal(true)}
            className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{userPlan === "free" ? "Upgrade Plan" : "Change Plan"}</span>
          </button>
        </div>
      </div>

      {/* AI Key Status Notice */}
      {aiConfigured === false && (
        <div className="rounded-xl border border-skynet-amber/30 bg-skynet-amber/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-skynet-ivory">
            <Key className="w-4 h-4 text-skynet-amber shrink-0" />
            <span>
              <strong>Gemini API Key:</strong> Not configured in environment. Skynet will operate using the high-fidelity <em>Autonomous Synthesis Engine</em>.
            </span>
          </div>
          <span className="text-skynet-dust text-[11px]">
            Add <code className="text-skynet-amber font-mono">GEMINI_API_KEY</code> in Settings to enable frontier models.
          </span>
        </div>
      )}

      {/* Create project card */}
      <div className="card">
        <h2 className="text-lg font-medium text-skynet-ivory mb-2 tracking-[-0.01em] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-skynet-amber" />
          Describe your website idea
        </h2>
        <p className="text-xs text-skynet-dust mb-5">
          Type what you want in plain words (e.g. &quot;Artisanal bakery with sourdough catalog and preorder modal&quot;).
        </p>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="relative">
            <textarea
              rows={2}
              required
              aria-label="Describe the website you want"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              className="block w-full px-4 py-3 rounded-md bg-transparent border border-skynet-border text-skynet-ivory placeholder-skynet-dust-sm text-sm focus:border-skynet-amber focus:ring-1 focus:ring-skynet-amber transition-colors"
              placeholder="e.g. Modern boutique hotel in Kyoto with room showcase, guest reviews, and online booking inquiry"
              disabled={submitting}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={submitting || !brief.trim()}
              className="btn-primary text-xs py-2.5 px-5 disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? "Deploying Agents…" : "Build my website"}
              {!submitting && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
            <span className="text-xs text-skynet-dust">
              13 specialist AI departments will work in parallel
            </span>
          </div>

          {status === "ok" && (
            <div className="p-3 rounded-md bg-skynet-void border border-skynet-amber/30 text-skynet-amber text-xs flex items-center gap-2.5">
              <Pencil className="w-3.5 h-3.5" />
              <span>{message}</span>
            </div>
          )}
          {status === "error" && (
            <div className="p-3 rounded-md bg-skynet-void border border-skynet-error/30 text-skynet-error text-xs flex items-center gap-2.5">
              <Pencil className="w-3.5 h-3.5" />
              <span>{message}</span>
            </div>
          )}
        </form>
      </div>

      {/* Projects list */}
      <div>
        <h2 className="text-lg font-medium text-skynet-ivory mb-4 tracking-[-0.01em] flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4 text-skynet-dust" />
          Your Websites
        </h2>

        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-skynet-amber/20 border-t-skynet-amber animate-spin" />
            <p className="text-skynet-dust text-xs tracking-wider uppercase">
              Loading your websites
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center gap-4 text-center rounded-xl bg-skynet-surface border border-skynet-border/50 p-6">
            <div className="w-12 h-12 rounded-xl bg-skynet-void flex items-center justify-center text-skynet-dust">
              <Folder className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-medium text-skynet-ivory">
                No websites created yet
              </p>
              <p className="text-xs text-skynet-dust mt-1">
                Describe your first website concept in the box above to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-skynet-surface-hover transition-colors group"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-skynet-void border border-skynet-border flex items-center justify-center text-skynet-amber shrink-0 group-hover:border-skynet-amber/40 transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-skynet-ivory text-sm tracking-[-0.01em] flex items-center gap-2">
                      <span>{p.id}</span>
                      <ExternalLink className="w-3 h-3 text-skynet-dust opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {p.brief && (
                      <p className="text-xs text-skynet-dust line-clamp-1 mt-0.5 max-w-lg">
                        &quot;{p.brief}&quot;
                      </p>
                    )}
                    <div className="text-[11px] text-skynet-dust-sm mt-1">
                      Phase: <span className="text-skynet-ivory">{phaseLabel(p.currentPhase)}</span> • Updated{" "}
                      {new Date(p.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-skynet-border bg-skynet-void">
                    {p.status === "done" ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-skynet-success" />
                        <span className="text-skynet-success font-semibold">Live / Ready</span>
                      </>
                    ) : p.status === "in_progress" ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-skynet-amber animate-ping" />
                        <span className="text-skynet-amber font-semibold">Agents Building</span>
                      </>
                    ) : p.status === "todo" ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-skynet-dust" />
                        <span className="text-skynet-dust">Queued</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-skynet-warning" />
                        <span className="text-skynet-warning">{p.status}</span>
                      </>
                    )}
                  </span>
                  <ChevronRight className="w-4 h-4 text-skynet-dust group-hover:text-skynet-amber transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="text-center text-skynet-dust text-xs tracking-wider uppercase pt-6">
        Skynet AI · Multi-Agent Autonomous Web Platform
      </div>

      <PlanUpgradeModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        currentPlan={userPlan}
        onPlanUpdated={(newPlan) => setUserPlan(newPlan)}
      />
    </div>
  )
}
