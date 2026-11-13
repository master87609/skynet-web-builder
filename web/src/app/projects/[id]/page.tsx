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
} from "@/lib/api"

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

  // Live preview state
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [iframeKey, setIframeKey] = useState(Date.now())
  const [agentLogs, setAgentLogs] = useState<{ time: string; msg: string; type?: string }[]>([])
  const logsEndRef = useRef<HTMLDivElement>(null)

  // Connect to SSE stream
  useEffect(() => {
    loadProject()
    checkGate()

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
            <a
              href={getProjectDownloadUrl(projectId)}
              download
              className="btn-ghost py-2 px-3 text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-skynet-amber" />
              Download ZIP
            </a>
            <button
              onClick={handleDeploy}
              disabled={deploying || !deploy?.allowed}
              className={`py-2 px-4 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                deploy?.allowed
                  ? "btn-primary"
                  : "bg-skynet-surface text-skynet-dust border border-skynet-border cursor-not-allowed opacity-60"
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              {deploying ? "Deploying…" : deploy?.allowed ? "Deploy to Live" : "Deploy (Gate Check)"}
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
    </div>
  )
}
