const ENGINE_URL =
  process.env.NEXT_PUBLIC_ENGINE_URL || "http://localhost:3001"

export async function apiRequest(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const res = await fetch(`${ENGINE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })
  return res
}

export async function apiJson<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<{ ok: boolean; data?: T; error?: any; status: number }> {
  try {
    const res = await apiRequest(path, options)
    let data: any = null
    const contentType = res.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      data = await res.json().catch(() => null)
    }
    return {
      ok: res.ok,
      status: res.status,
      data,
      error: res.ok ? null : data?.error || `Request failed (${res.status})`,
    }
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: undefined,
      error: (err as Error).message || "Network request failed",
    }
  }
}

/* Auth helpers */

export async function register(email: string, password: string, name: string) {
  return apiJson("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  })
}

export async function login(email: string, password: string) {
  return apiJson("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function logout() {
  return apiJson("/auth/logout", { method: "POST" })
}

export async function me() {
  return apiJson("/auth/me")
}

/* Project helpers */

export interface ProjectSummary {
  id: string
  brief?: string
  status: string
  currentPhase: string
  updatedAt: string
}

export async function listProjects(): Promise<ProjectSummary[]> {
  const result = await apiJson<{ projects: ProjectSummary[] }>("/projects")
  return result.ok ? (result.data?.projects ?? []) : []
}

export async function createProject(brief: string) {
  return apiJson("/projects", {
    method: "POST",
    body: JSON.stringify({ brief }),
  })
}

export async function triggerBuild(projectId: string) {
  return apiJson(`/projects/${projectId}/build`, {
    method: "POST",
  })
}

export async function getProjectStatus(projectId: string) {
  return apiJson<{
    projectId: string
    brief?: string
    status: string
    currentPhase: string
    completedPhases: string[]
    artifactCount: number
    updatedAt: string
  }>(`/projects/${projectId}/status`)
}

export async function getProjectArtifacts(projectId: string) {
  return apiJson<{ projectId: string; artifacts: any[] }>(`/projects/${projectId}/artifacts`)
}

export async function checkDeployGate(projectId: string) {
  return apiJson<{
    projectId: string
    allowed: boolean
    gates: { qa: string; security: string; seo: string; p0Blockers: string }
    reason: string
  }>(`/projects/${projectId}/deploy-gate`)
}

export async function deployProject(projectId: string) {
  return apiJson(`/projects/${projectId}/deploy`, { method: "POST" })
}

export function getProjectStreamUrl(projectId: string): string {
  return `${ENGINE_URL}/projects/${projectId}/stream`
}

export function getProjectPreviewUrl(projectId: string): string {
  return `${ENGINE_URL}/projects/${projectId}/preview`
}

export function getProjectDownloadUrl(projectId: string): string {
  return `${ENGINE_URL}/projects/${projectId}/download`
}

/* Settings helpers */

export async function getSettingsStatus() {
  return apiJson<{ configured: boolean; keyMasked: string | null }>("/settings/status")
}

export async function updateApiKey(apiKey: string) {
  return apiJson("/settings/api-key", {
    method: "POST",
    body: JSON.stringify({ apiKey }),
  })
}
