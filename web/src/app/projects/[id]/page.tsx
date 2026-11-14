"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Rocket,
  RefreshCw,
  Folder,
  Code2,
  ExternalLink,
  Download,
  Smartphone,
  Tablet,
  Monitor,
  Terminal,
  Sparkles,
  ShieldCheck,
  Search,
  Check,
  Server,
  Globe,
  Lock,
  X,
} from "lucide-react"
import {
  getProjectStatus,
  getProjectArtifacts,
  checkDeployGate,
  deployProject,
  triggerBuild,
  getProjectStreamUrl,
  getProjectPreviewUrl,
  getProjectDownloadUrl,
  deployToHost,
  me,
  SubscriptionPlan,
  DeployedHostConfig,
} from "@/lib/api"
import PlanUpgradeModal from "@/components/PlanUpgradeModal"

interface Artifact {
  path: string
  owner: string
  phase: string
  status: string
  updated: string
}

const DEPARTMENTS = [
  { id: "requirements-analysis", name: "Requirements", role: "Extracts scope & specifications" },
  { id: "product-strategist", name: "Product Strategy", role: "Defines value proposition & MVP" },
  { id: "ux-architect", name: "UX Architecture", role: "Builds sitemap & user flows" },
  { id: "ui-design", name: "UI Design", role: "Tokens, color palettes & component specs" },
  { id: "database-architect", name: "Database", role: "Data models & schemas" },
  { id: "backend", name: "Backend API", role: "Contracts & endpoint definitions" },
  { id: "frontend", name: "Frontend Compiler", role: "Generates HTML5, Tailwind & JavaScript" },
  { id: "content-writer", name: "Content & Copy", role: "Brand voice & conversion microcopy" },
  { id: "qa-tester", name: "QA Tester", role: "W3C validation, mobile matrix & accessibility" },
  { id: "security-auditor", name: "Security Auditor", role: "OWASP compliance & sanitization" },
  { id: "seo-specialist", name: "SEO Specialist", role: "Meta tags, schema.org & OpenGraph" },
  { id: "project-manager", name: "Project Manager", role: "Status report & deployment sign-off" },
  { id: "devops", name: "DevOps", role: "Edge hosting manifest & preview rollout" },
]

export default function ProjectPage({
  params,
}: {
  params: { id: string }
}) {
  const projectId = params.id
  const [status, setStatus] = useState<{
    projectId: string
    brief?: string
    status: string
    currentPhase: string
    completedPhases: string[]
    artifactCount: number
    deployedHost?: DeployedHostConfig
    updatedAt: string
  } | null>(null)
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [loading, setLoading] = useState(true)
  const [deploy, setDeploy] = useState<{
    allowed: boolean
    gates: { qa: string; security: string; seo: string; p0Blockers: string }
    reason: string
  } | null>(null)
  const [deploying, setDeploying] = useState(false)
  const [rebuilding, setRebuilding] = useState(false)
  const [notice, setNotice] = useState<{
    tone: "ok" | "error"
    text: string
  } | null>(null)

  // Plan & Host states
  const [userPlan, setUserPlan] = useState<SubscriptionPlan>("free")
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [planModalConfig, setPlanModalConfig] = useState<{
    requiredPlan: SubscriptionPlan
    featureRequested: string
  }>({ requiredPlan: "advance", featureRequested: "" })

  const [showHostDeployModal, setShowHostDeployModal] = useState(false)
  const [customDomain, setCustomDomain] = useState("")
  const [hostTarget, setHostTarget] = useState<"custom-host" | "vercel" | "netlify" | "github-pages" | "ftp">("custom-host")
  const [ftpHost, setFtpHost] = useState("")
  const [serverIp, setServerIp] = useState("")
  const [deployingToHost, setDeployingToHost] = useState(false)
  const [deployedHostResult, setDeployedHostResult] = useState<{
    url: string
    dns: { type: string; name: string; target: string; ttl: number; sslStatus: string }
  } | null>(null)

  // Live preview state
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [iframeKey, setIframeKey] = useState(Date.now())
  const [agentLogs, setAgentLogs] = useState<{ time: string; msg: string; type?: string }[]>([])
  const logsEndRef = useRef<HTMLDivElement>(null)

  // Connect to SSE stream
  useEffect(() => {
    loadProject()
    checkGate()
    loadUser()

    let eventSource: EventSource | null = null

    try {
      eventSource = new EventSource(getProjectStreamUrl(projectId), {
        withCredentials: true,
      })

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.message) {
            setAgentLogs((prev) => [
              ...prev.slice(-30),
              {
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
                msg: data.message,
                type: data.type,
              },
            ])
          }

          if (data.type === "phase_complete" || data.type === "artifact") {
            loadProject()
          }

          if (data.type === "build_complete") {
            loadProject()
            checkGate()
            setIframeKey(Date.now())
            setNotice({ tone: "ok", text: "Autonomous build complete! Live preview refreshed." })
          }
        } catch {}
      }

      eventSource.onerror = () => {
        // SSE disconnected or closed
      }
    } catch {}

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [projectId])

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [agentLogs])

  async function loadProject() {
    try {
      const [sRes, aRes] = await Promise.all([
        getProjectStatus(projectId),
        getProjectArtifacts(projectId),
      ])
      if (sRes.ok && sRes.data) setStatus(sRes.data)
      if (aRes.ok && aRes.data) setArtifacts(aRes.data.artifacts ?? [])
    } catch {} finally {
      setLoading(false)
    }
  }

  async function checkGate() {
    const res = await checkDeployGate(projectId)
    if (res.ok && res.data) setDeploy(res.data)
  }

  async function handleRebuild() {
    setRebuilding(true)
    setNotice({ tone: "ok", text: "Rebuild initiated across all 13 AI departments..." })
    try {
      await triggerBuild(projectId)
      setTimeout(loadProject, 800)
    } catch (err) {
      setNotice({ tone: "error", text: (err as Error).message })
    } finally {
      setRebuilding(false)
    }
  }

  async function handleDeploy() {
    setDeploying(true)
    setNotice(null)
    try {
      const res = await deployProject(projectId)
      if (!res.ok) throw new Error(res.error || "Deploy failed")
      setNotice({
        tone: "ok",
        text: `Deployed successfully! Live preview active at: ${res.data?.url || "Preview URL"}`,
      })
      loadProject()
      checkGate()
      setIframeKey(Date.now())
    } catch (err) {
      setNotice({
        tone: "error",
        text: err instanceof Error ? err.message : "Deploy failed",
      })
    } finally {
      setDeploying(false)
    }
  }

  async function loadUser() {
    try {
      const res = await me()
      if (res.ok && res.data?.user) {
        setUserPlan(res.data.user.plan || "free")
      }
    } catch {}
  }

  const handleDownloadClick = (e: React.MouseEvent) => {
    if (userPlan === "free") {
      e.preventDefault()
      setPlanModalConfig({
        requiredPlan: "advance",
        featureRequested: "Using this website and downloading production code",
      })
      setShowPlanModal(true)
    }
  }

  const handleHostDeployClick = () => {
    if (userPlan !== "host") {
      setPlanModalConfig({
        requiredPlan: "host",
        featureRequested: "Deploying with your own host and custom domain",
      })
      setShowPlanModal(true)
    } else {
      setShowHostDeployModal(true)
    }
  }

  const handleHostDeploySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customDomain.trim()) return
    setDeployingToHost(true)
    try {
      const res = await deployToHost(projectId, {
        domain: customDomain.trim(),
        target: hostTarget,
        ftpHost: ftpHost.trim() || undefined,
        serverIp: serverIp.trim() || undefined,
      })
      if (res.ok && res.data) {
        setDeployedHostResult({
          url: res.data.deployedHost.url,
          dns: res.data.dns,
        })
        setNotice({
          tone: "ok",
          text: `Successfully linked and deployed to your own host: ${res.data.deployedHost.url}`,
        })
        loadProject()
      } else {
        setNotice({
          tone: "error",
          text: res.error || "Host deployment failed",
        })
      }
    } catch (err) {
      setNotice({
        tone: "error",
        text: (err as Error).message || "Host deployment failed",
      })
    } finally {
      setDeployingToHost(false)
    }
  }

  const completedSet = new Set(status?.completedPhases || [])
  const isFinished = status?.status === "done"
  const isBuilding = status?.status === "in_progress"

  const previewWidthClass =
    previewDevice === "mobile"
      ? "max-w-[375px]"
      : previewDevice === "tablet"
      ? "max-w-[768px]"
      : "w-full"

  if (loading) {
    return (
      <div className="min-h-screen bg-skynet-void py-24 px-4 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-skynet-amber/20 border-t-skynet-amber animate-spin" />
        <p className="text-skynet-dust text-xs tracking-wider uppercase">
          Loading Project Workspace
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-skynet-void">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="text-xs text-skynet-amber hover:text-skynet-amber-bright flex items-center gap-1.5 mb-2 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Back to dashboard
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-skynet-ivory tracking-tight font-mono">
                {projectId}
              </h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  isFinished
                    ? "bg-skynet-success/10 border-skynet-success/40 text-skynet-success"
                    : isBuilding
                    ? "bg-skynet-amber/10 border-skynet-amber/40 text-skynet-amber animate-pulse"
                    : "bg-skynet-void border-skynet-border text-skynet-dust"
                }`}
              >
                {isFinished ? "Ready / Deployed" : isBuilding ? "Agents Building" : status?.status || "Queued"}
              </span>
            </div>
            {status?.brief && (
              <p className="text-xs text-skynet-dust mt-1.5 max-w-2xl leading-relaxed">
                &quot;{status.brief}&quot;
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRebuild}
              disabled={rebuilding || isBuilding}
              className="btn-ghost py-2 px-3 text-xs flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${rebuilding ? "animate-spin" : ""}`} />
              Re-run Build
            </button>

            {/* Download ZIP button (Advance $19 pack) */}
            <a
              href={userPlan === "free" ? "#" : getProjectDownloadUrl(projectId)}
              onClick={handleDownloadClick}
              download={userPlan === "free" ? undefined : `${projectId}.zip`}
              className={`py-2 px-3 text-xs flex items-center gap-1.5 rounded-md border transition-all ${
                userPlan === "free"
                  ? "bg-skynet-surface border-skynet-border text-skynet-dust hover:border-skynet-amber hover:text-skynet-amber"
                  : "btn-ghost"
              }`}
              title={userPlan === "free" ? "Upgrade to Advance Plan ($19) to download and use website" : "Download production code (.zip)"}
            >
              <Download className="w-3.5 h-3.5 text-skynet-amber" />
              <span>Download ZIP</span>
              {userPlan === "free" && (
                <span className="text-[10px] uppercase font-bold text-skynet-amber bg-skynet-amber/15 px-1.5 py-0.2 rounded border border-skynet-amber/30">
                  $19
                </span>
              )}
            </a>

            {/* Standard Preview Deploy */}
            <button
              onClick={handleDeploy}
              disabled={deploying || !deploy?.allowed}
              className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                deploy?.allowed
                  ? "bg-skynet-surface hover:bg-skynet-surface-hover text-skynet-ivory border border-skynet-border"
                  : "bg-skynet-surface text-skynet-dust border border-skynet-border cursor-not-allowed opacity-60"
              }`}
            >
              <Rocket className="w-3.5 h-3.5 text-skynet-amber" />
              {deploying ? "Deploying…" : "Deploy to Preview"}
            </button>

            {/* Deploy with Own Host button (Custom Host $29 pack) */}
            <button
              onClick={handleHostDeployClick}
              className={`py-2 px-3.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                userPlan === "host"
                  ? "bg-skynet-success text-skynet-void hover:bg-emerald-400"
                  : "bg-skynet-surface border border-skynet-success/50 text-skynet-success hover:bg-skynet-success/10"
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Deploy with Own Host</span>
              {userPlan !== "host" && (
                <span className="text-[10px] uppercase font-bold bg-skynet-success/20 px-1.5 py-0.2 rounded border border-skynet-success/40">
                  $29
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Notice alert */}
        {notice && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-3 border ${
              notice.tone === "ok"
                ? "bg-skynet-success/10 border-skynet-success/30 text-skynet-success"
                : "bg-skynet-error/10 border-skynet-error/30 text-skynet-error"
            }`}
          >
            <span>{notice.text}</span>
            <button onClick={() => setNotice(null)} className="opacity-70 hover:opacity-100">
              ✕
            </button>
          </div>
        )}

        {/* LIVE PREVIEW IFRAME SECTION */}
        <div className="card p-0 overflow-hidden border border-skynet-border/70 shadow-2xl">
          {/* Mock Browser Header */}
          <div className="bg-skynet-void px-4 py-3 border-b border-skynet-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              <div className="ml-3 px-3 py-1 rounded-md bg-skynet-surface border border-skynet-border text-xs text-skynet-dust font-mono flex items-center gap-2">
                <span className="text-skynet-amber font-bold">https://</span>
                <span>{projectId}.skynet.app</span>
              </div>
            </div>

            {/* Viewport switcher */}
            <div className="flex items-center gap-1 bg-skynet-surface p-1 rounded-lg border border-skynet-border">
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1.5 rounded text-xs transition-colors ${
                  previewDevice === "desktop"
                    ? "bg-skynet-amber text-black"
                    : "text-skynet-dust hover:text-white"
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice("tablet")}
                className={`p-1.5 rounded text-xs transition-colors ${
                  previewDevice === "tablet"
                    ? "bg-skynet-amber text-black"
                    : "text-skynet-dust hover:text-white"
                }`}
                title="Tablet View"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1.5 rounded text-xs transition-colors ${
                  previewDevice === "mobile"
                    ? "bg-skynet-amber text-black"
                    : "text-skynet-dust hover:text-white"
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIframeKey(Date.now())}
                className="p-1.5 rounded bg-skynet-surface border border-skynet-border text-skynet-dust hover:text-white text-xs"
                title="Refresh preview"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <a
                href={getProjectPreviewUrl(projectId)}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded bg-skynet-surface hover:bg-skynet-surface-hover border border-skynet-border text-xs text-skynet-dust hover:text-skynet-ivory flex items-center gap-1 transition-colors"
              >
                <span>Open in Tab</span>
                <ExternalLink className="w-3 h-3 text-skynet-amber" />
              </a>
            </div>
          </div>

          {/* Iframe container */}
          <div className="bg-[#050505] min-h-[560px] flex items-center justify-center p-2 sm:p-4 overflow-x-auto">
            <div
              className={`transition-all duration-300 ease-out border border-skynet-border/50 shadow-2xl rounded-lg overflow-hidden bg-black ${previewWidthClass}`}
            >
              <iframe
                key={iframeKey}
                src={getProjectPreviewUrl(projectId)}
                title="Generated Website Preview"
                className="w-full h-[620px] border-0"
              />
            </div>
          </div>
        </div>

        {/* 13 DEPARTMENTS MULTI-AGENT PIPELINE & ACTIVITY LOG */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Pipeline Column */}
          <div className="card lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-skynet-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-skynet-amber" />
                <h3 className="font-semibold text-sm text-skynet-ivory">
                  Multi-Agent Department Pipeline (13 Specialists)
                </h3>
              </div>
              <span className="text-xs text-skynet-dust">
                {completedSet.size} of 13 Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {DEPARTMENTS.map((dept, idx) => {
                const isDone = completedSet.has(dept.id)
                const isActive = status?.currentPhase === dept.id && !isFinished
                return (
                  <div
                    key={dept.id}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                      isDone
                        ? "bg-skynet-void/60 border-skynet-success/30"
                        : isActive
                        ? "bg-skynet-amber/10 border-skynet-amber shadow-[0_0_15px_rgba(255,185,0,0.15)]"
                        : "bg-skynet-void/30 border-skynet-border/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                          isDone
                            ? "bg-skynet-success text-black"
                            : isActive
                            ? "bg-skynet-amber text-black animate-pulse"
                            : "bg-skynet-surface text-skynet-dust"
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-skynet-ivory flex items-center gap-1.5">
                          <span>{dept.name}</span>
                          {isActive && (
                            <span className="text-[10px] text-skynet-amber uppercase tracking-wider font-mono">
                              (active)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-skynet-dust line-clamp-1">{dept.role}</div>
                      </div>
                    </div>
                    <div>
                      {isDone ? (
                        <span className="text-[10px] uppercase font-semibold text-skynet-success bg-skynet-success/10 px-2 py-0.5 rounded">
                          Done
                        </span>
                      ) : isActive ? (
                        <span className="text-[10px] uppercase font-semibold text-skynet-amber bg-skynet-amber/10 px-2 py-0.5 rounded animate-pulse">
                          Working
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase text-skynet-dust">Queued</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Live Activity & Deploy Gate Column */}
          <div className="space-y-6">
            {/* Deploy Gate Status Card */}
            <div className="card space-y-3">
              <div className="flex items-center gap-2 border-b border-skynet-border pb-2.5">
                <ShieldCheck className="w-4 h-4 text-skynet-amber" />
                <h3 className="font-semibold text-sm text-skynet-ivory">Deploy Quality Gate</h3>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2">
                <div className="p-2 rounded-lg bg-skynet-void border border-skynet-border">
                  <div className="text-[10px] text-skynet-dust uppercase tracking-wider">QA Report</div>
                  <div className={`font-bold mt-1 ${deploy?.gates.qa === "approved" ? "text-skynet-success" : "text-skynet-warning"}`}>
                    {deploy?.gates.qa || "—"}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-skynet-void border border-skynet-border">
                  <div className="text-[10px] text-skynet-dust uppercase tracking-wider">Security</div>
                  <div className={`font-bold mt-1 ${deploy?.gates.security === "approved" ? "text-skynet-success" : "text-skynet-warning"}`}>
                    {deploy?.gates.security || "—"}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-skynet-void border border-skynet-border">
                  <div className="text-[10px] text-skynet-dust uppercase tracking-wider">SEO Audit</div>
                  <div className={`font-bold mt-1 ${deploy?.gates.seo === "approved" ? "text-skynet-success" : "text-skynet-warning"}`}>
                    {deploy?.gates.seo || "—"}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-skynet-dust leading-relaxed">
                {deploy?.reason || "Deploy gate checks automated QA, security posture, and SEO benchmarks."}
              </div>
            </div>

            {/* Deploy with Own Host Card ($29) */}
            <div className="card space-y-3 border-skynet-success/40 bg-skynet-surface/80">
              <div className="flex items-center justify-between border-b border-skynet-border pb-2.5">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-skynet-success" />
                  <h3 className="font-semibold text-sm text-skynet-ivory">Deploy with Own Host</h3>
                </div>
                <span className="text-[10px] font-bold text-skynet-success bg-skynet-success/15 px-2 py-0.5 rounded border border-skynet-success/30">
                  $29 Pack
                </span>
              </div>

              {status?.deployedHost || deployedHostResult ? (
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-skynet-void border border-skynet-success/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-skynet-dust uppercase">Connected Domain</span>
                      <span className="text-[10px] text-skynet-success font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-skynet-success animate-pulse" />
                        SSL Active (TLS 1.3)
                      </span>
                    </div>
                    <a
                      href={deployedHostResult?.url || status?.deployedHost?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-skynet-success font-bold font-mono text-sm hover:underline flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{deployedHostResult?.url || status?.deployedHost?.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <button
                    onClick={() => setShowHostDeployModal(true)}
                    className="w-full py-1.5 text-xs text-skynet-dust hover:text-skynet-ivory border border-skynet-border rounded-md hover:bg-skynet-surface"
                  >
                    Update DNS &amp; Host Settings
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <p className="text-skynet-dust text-[11px] leading-relaxed">
                    Deploy this website directly to your own hosting server, VPS, or connect your custom domain (e.g. <code className="text-skynet-success font-mono">mybrand.com</code>) with free automated SSL.
                  </p>
                  <button
                    onClick={handleHostDeployClick}
                    className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-skynet-success text-skynet-void hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Server className="w-3.5 h-3.5" />
                    <span>{userPlan === "host" ? "Configure Host & Custom Domain" : "Unlock Own Host Deploy ($29)"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Agent Terminal Feed */}
            <div className="card space-y-2">
              <div className="flex items-center gap-2 border-b border-skynet-border pb-2">
                <Terminal className="w-4 h-4 text-skynet-amber" />
                <h3 className="font-semibold text-xs text-skynet-ivory">Agent Telemetry Feed</h3>
              </div>

              <div className="bg-skynet-void border border-skynet-border/70 rounded-lg p-3 h-64 overflow-y-auto font-mono text-[11px] text-skynet-dust space-y-2">
                {agentLogs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-skynet-dust-sm">
                    {isBuilding ? "Listening to specialist agents..." : "Build finished. Telemetry logged."}
                  </div>
                ) : (
                  agentLogs.map((log, idx) => (
                    <div key={idx} className="leading-snug">
                      <span className="text-skynet-amber/70 font-bold">[{log.time}]</span>{" "}
                      <span className="text-skynet-ivory">{log.msg}</span>
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>
        </div>

        {/* Artifacts List */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-skynet-amber" />
              <h3 className="font-semibold text-sm text-skynet-ivory">Generated Deliverables &amp; Artifacts</h3>
            </div>
            <span className="text-xs text-skynet-dust">{artifacts.length} files produced</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {artifacts.map((a) => (
              <div
                key={a.path}
                className="p-3 rounded-lg bg-skynet-void border border-skynet-border flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Code2 className="w-4 h-4 text-skynet-amber shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-mono font-medium text-skynet-ivory truncate">{a.path}</div>
                    <div className="text-[10px] text-skynet-dust">{a.owner}</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-skynet-success bg-skynet-success/10 px-2 py-0.5 rounded">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Own Host Deployment Configuration Modal */}
      {showHostDeployModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-skynet-surface border border-skynet-border rounded-2xl max-w-lg w-full p-6 relative shadow-2xl space-y-5">
            <button
              onClick={() => setShowHostDeployModal(false)}
              className="absolute top-4 right-4 text-skynet-dust hover:text-skynet-ivory p-1.5 rounded-lg bg-skynet-void"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-skynet-success/20 text-skynet-success flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-skynet-ivory">Deploy with Your Own Host</h3>
                <p className="text-xs text-skynet-dust">Custom Host Pack ($29) Active</p>
              </div>
            </div>

            <form onSubmit={handleHostDeploySubmit} className="space-y-4 text-xs">
              <div>
                <label className="field-label">Custom Domain or Subdomain</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-skynet-dust absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. www.mybakeryparis.com or app.mybrand.org"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="input-field pl-9 text-xs"
                  />
                </div>
                <p className="text-[10px] text-skynet-dust mt-1">
                  Point this domain's CNAME record to <code className="text-skynet-amber font-mono">host.skynet.app</code>
                </p>
              </div>

              <div>
                <label className="field-label">Hosting Target</label>
                <select
                  value={hostTarget}
                  onChange={(e) => setHostTarget(e.target.value as any)}
                  className="input-field text-xs bg-skynet-void cursor-pointer"
                >
                  <option value="custom-host">Custom Host / VPS (FTP / Webhook)</option>
                  <option value="vercel">Vercel Cloud Integration</option>
                  <option value="netlify">Netlify Edge Deploy</option>
                  <option value="github-pages">GitHub Pages Repository</option>
                  <option value="ftp">Direct FTP / SFTP Server</option>
                </select>
              </div>

              {(hostTarget === "ftp" || hostTarget === "custom-host") && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="field-label">Server IP / Host (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 192.168.1.100"
                      value={serverIp}
                      onChange={(e) => setServerIp(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="field-label">FTP Host / Port (Optional)</label>
                    <input
                      type="text"
                      placeholder="ftp.myhost.com:21"
                      value={ftpHost}
                      onChange={(e) => setFtpHost(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                </div>
              )}

              {/* DNS Guidance Box */}
              <div className="p-3 rounded-lg bg-skynet-void border border-skynet-border/70 space-y-1">
                <div className="text-[10px] uppercase font-bold text-skynet-ivory">DNS Records Required:</div>
                <div className="font-mono text-[11px] text-skynet-amber flex justify-between">
                  <span>Type: CNAME</span>
                  <span>Host: @ or www</span>
                  <span>Value: host.skynet.app</span>
                </div>
                <div className="text-[10px] text-skynet-success mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Free automated Let's Encrypt SSL provisioned automatically</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHostDeployModal(false)}
                  className="px-3 py-2 text-xs text-skynet-dust hover:text-skynet-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deployingToHost || !customDomain.trim()}
                  className="btn-primary py-2 px-4 text-xs font-bold bg-skynet-success text-skynet-void hover:bg-emerald-400 flex items-center gap-1.5"
                >
                  <Server className="w-3.5 h-3.5" />
                  <span>{deployingToHost ? "Deploying to Host..." : "Deploy to My Host"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan Upgrade Modal */}
      <PlanUpgradeModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        currentPlan={userPlan}
        requiredPlan={planModalConfig.requiredPlan}
        featureRequested={planModalConfig.featureRequested}
        onPlanUpdated={(newPlan) => setUserPlan(newPlan)}
      />
    </div>
  )
}
