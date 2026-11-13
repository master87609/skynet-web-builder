import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { z } from "zod"
import dotenv from "dotenv"
import { resolve } from "node:path"
import { writeFile } from "node:fs/promises"

dotenv.config()
dotenv.config({ path: resolve(process.cwd(), ".env") })
dotenv.config({ path: resolve(process.cwd(), "../.env") })

import * as archiverModule from "archiver"
const archiver: any = (archiverModule as any).default || archiverModule
import { projectStore } from "./project-store.js"
import {
  authenticateUser,
  registerUser,
  createToken,
  setAuthCookie,
  clearAuthCookie,
} from "./auth.js"
import { gatekeeper } from "./gatekeeper.js"
import { delegator } from "./delegator.js"
import { parseDepartmentId, DEPENDENCY_ORDER } from "./orchestrator.js"
import { pipeline } from "./pipeline.js"
import { hasApiKey, setApiKey, getApiKey } from "./ai-agent.js"

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())
app.use(express.json())

/* -------------------- Auth middleware -------------------- */

async function requireAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const token = req.cookies?.skynet_session
  if (!token) {
    return res.status(401).json({ error: "Not logged in" })
  }
  const { userId } = (await projectStore.getSession(token)) ?? {}
  if (!userId) {
    return res.status(401).json({ error: "Session expired" })
  }
  ;(req as any).userId = userId
  next()
}

/* -------------------- Health & Settings -------------------- */

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "skynet-engine",
    aiConfigured: hasApiKey(),
    timestamp: new Date().toISOString(),
  })
})

app.get("/settings/status", (_req, res) => {
  const configured = hasApiKey()
  const key = getApiKey()
  res.json({
    configured,
    keyMasked: configured ? `${key.slice(0, 4)}••••${key.slice(-4)}` : null,
  })
})

const ApiKeySchema = z.object({
  apiKey: z.string().min(1, "API key cannot be empty"),
})

app.post("/settings/api-key", async (req, res) => {
  try {
    const { apiKey } = ApiKeySchema.parse(req.body)
    setApiKey(apiKey)
    try {
      const envPath = resolve(process.cwd(), ".env")
      const rootEnvPath = resolve(process.cwd(), "../.env")
      const content = `GEMINI_API_KEY=${apiKey}\nPORT=3001\n`
      await writeFile(envPath, content, "utf8").catch(() => {})
      await writeFile(rootEnvPath, content, "utf8").catch(() => {})
    } catch {}
    res.json({
      success: true,
      configured: true,
      message: "Gemini API key updated and persisted successfully.",
    })
  } catch (err) {
    res.status(400).json({ error: "Invalid API key provided" })
  }
})

/* -------------------- Auth routes -------------------- */

const RegisterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
})

app.post("/auth/register", async (req, res) => {
  try {
    const { email, password, name } = RegisterSchema.parse(req.body)
    const user = await registerUser(email, password, name)
    if (!user) {
      return res.status(409).json({ error: "An account with this email already exists" })
    }
    const token = createToken({ userId: user.userId, email: user.email })
    await projectStore.createSession(user.userId, token)
    setAuthCookie(res, token)
    return res.status(201).json({
      user: { userId: user.userId, name: user.name, email: user.email },
      message: "Account created. You are now logged in.",
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request", issues: err.issues })
    }
    return res.status(500).json({ error: "Registration failed", detail: String(err) })
  }
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = LoginSchema.parse(req.body)
    const user = await authenticateUser(email, password)
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" })
    }
    const token = createToken({ userId: user.userId, email: user.email })
    await projectStore.createSession(user.userId, token)
    setAuthCookie(res, token)
    return res.json({
      user: { userId: user.userId, name: user.name, email: user.email },
      message: "Welcome back to Skynet.",
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request", issues: err.issues })
    }
    return res.status(500).json({ error: "Login failed", detail: String(err) })
  }
})

app.post("/auth/logout", async (req, res) => {
  const token = req.cookies?.skynet_session
  if (token) {
    await projectStore.deleteSession(token)
  }
  clearAuthCookie(res)
  return res.json({ message: "Logged out." })
})

app.get("/auth/me", requireAuth, async (req, res) => {
  const user = await projectStore.getUserById((req as any).userId)
  if (!user) {
    return res.status(404).json({ error: "User not found" })
  }
  return res.json({ user })
})

/* -------------------- Project routes -------------------- */

const CreateProjectSchema = z.object({
  brief: z.string().min(10, "Brief must be at least 10 characters"),
  projectId: z.string().min(1).optional(),
})

// Create a project from a brief and kick off the autonomous pipeline!
app.post("/projects", requireAuth, async (req, res) => {
  try {
    const { brief, projectId } = CreateProjectSchema.parse(req.body)
    const ownerId = (req as any).userId
    const id = projectId || `skynet-${Date.now()}`
    const state = await projectStore.init({ brief, ownerId, projectId: id })

    // Trigger multi-agent build pipeline asynchronously
    pipeline.run(id).catch((err) => {
      console.error(`Pipeline run error for ${id}:`, err)
    })

    return res.status(201).json({
      projectId: id,
      status: "in_progress",
      currentPhase: state.currentPhase,
      createdAt: state.createdAt,
      message: "Project created. Skynet's agents will now build your site.",
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request", issues: err.issues })
    }
    return res.status(409).json({ error: String(err) })
  }
})

// Trigger rebuild for an existing project
app.post("/projects/:id/build", requireAuth, async (req, res) => {
  try {
    const state = await projectStore.getState(req.params.id)
    if (!state) {
      return res.status(404).json({ error: "Project not found" })
    }
    if (state.ownerId !== (req as any).userId) {
      return res.status(403).json({ error: "Not authorized" })
    }

    pipeline.run(req.params.id).catch((err) => {
      console.error(`Rebuild error for ${req.params.id}:`, err)
    })

    return res.json({
      projectId: req.params.id,
      status: "in_progress",
      message: "Rebuild triggered across all 13 departments.",
    })
  } catch (err) {
    return res.status(500).json({ error: "Failed to trigger build", detail: String(err) })
  }
})

// List all projects for the logged-in user
app.get("/projects", requireAuth, async (_req, res) => {
  try {
    const ownerId = (_req as any).userId
    const ids = await projectStore.listProjects(ownerId)
    const projects = []
    for (const id of ids) {
      const state = await projectStore.getState(id)
      if (state) {
        projects.push({
          id: state.id,
          brief: state.brief,
          status: state.status,
          currentPhase: state.currentPhase,
          updatedAt: state.updatedAt,
        })
      }
    }
    return res.json({ projects, count: projects.length })
  } catch (err) {
    return res.status(500).json({ error: "Failed to list projects", detail: String(err) })
  }
})

// Get project status
app.get("/projects/:id/status", requireAuth, async (req, res) => {
  try {
    const state = await projectStore.getState(req.params.id)
    if (!state) {
      return res.status(404).json({ error: "Project not found" })
    }
    if (state.ownerId !== (req as any).userId) {
      return res.status(403).json({ error: "Not authorized to view this project" })
    }
    return res.json({
      projectId: state.id,
      brief: state.brief,
      status: state.status,
      currentPhase: state.currentPhase,
      completedPhases: state.completedPhases,
      artifactCount: state.artifacts.length,
      updatedAt: state.updatedAt,
    })
  } catch (err) {
    return res.status(500).json({ error: "Failed to get status", detail: String(err) })
  }
})

// List artifacts for a project
app.get("/projects/:id/artifacts", requireAuth, async (req, res) => {
  try {
    const state = await projectStore.getState(req.params.id)
    if (!state) {
      return res.status(404).json({ error: "Project not found" })
    }
    if (state.ownerId !== (req as any).userId) {
      return res.status(403).json({ error: "Not authorized to view this project" })
    }
    const artifacts = await projectStore.listArtifacts(req.params.id)
    return res.json({ projectId: req.params.id, artifacts })
  } catch (err) {
    return res.status(500).json({ error: "Failed to list artifacts", detail: String(err) })
  }
})

// Server-Sent Events (SSE) stream for live build updates
app.get("/projects/:id/stream", async (req, res) => {
  const projectId = req.params.id

  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*")
  res.setHeader("Access-Control-Allow-Credentials", "true")

  res.write(`data: ${JSON.stringify({ type: "connected", projectId })}\n\n`)

  // Send historical events first
  const history = pipeline.getHistory(projectId)
  for (const ev of history) {
    res.write(`data: ${JSON.stringify(ev)}\n\n`)
  }

  // If already done, emit completion if not already sent
  const state = await projectStore.getState(projectId)
  if (state?.status === "done" && !history.some((h) => h.type === "build_complete")) {
    res.write(
      `data: ${JSON.stringify({
        type: "build_complete",
        projectId,
        previewUrl: `/projects/${projectId}/preview`,
        timestamp: new Date().toISOString(),
      })}\n\n`,
    )
  }

  const listener = (event: any) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`)
  }

  pipeline.on(`event:${projectId}`, listener)

  req.on("close", () => {
    pipeline.off(`event:${projectId}`, listener)
  })
})

// Live Preview endpoint for iframe rendering
app.get("/projects/:id/preview", async (req, res) => {
  try {
    const html = await projectStore.readFile(req.params.id, "code/index.html")
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    return res.send(html)
  } catch {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Building Website...</title></head>
        <body style="background:#0A0A0A;color:#9A9A9A;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;text-align:center;">
          <div>
            <h2 style="color:#FFB900;">Skynet Agents Are Assembling Your Site</h2>
            <p>The code is currently being synthesized. Please check back in a few moments.</p>
          </div>
        </body>
      </html>
    `)
  }
})

// Serve assets under code/
app.get("/projects/:id/preview/:file(*)", async (req, res) => {
  try {
    const content = await projectStore.readFile(req.params.id, `code/${req.params.file}`)
    if (req.params.file.endsWith(".css")) {
      res.setHeader("Content-Type", "text/css")
    } else if (req.params.file.endsWith(".js")) {
      res.setHeader("Content-Type", "application/javascript")
    }
    return res.send(content)
  } catch {
    return res.status(404).send("File not found")
  }
})

// Download complete project files as ZIP
app.get("/projects/:id/download", async (req, res) => {
  try {
    const projectId = req.params.id
    const state = await projectStore.getState(projectId)
    if (!state) {
      return res.status(404).json({ error: "Project not found" })
    }

    res.setHeader("Content-Type", "application/zip")
    res.setHeader("Content-Disposition", `attachment; filename="${projectId}.zip"`)

    const archive = archiver("zip", { zlib: { level: 9 } })
    archive.pipe(res)

    // Add code/ files if they exist
    try {
      const html = await projectStore.readFile(projectId, "code/index.html")
      archive.append(html, { name: "index.html" })
    } catch {}

    try {
      const appJs = await projectStore.readFile(projectId, "code/app.js")
      archive.append(appJs, { name: "app.js" })
    } catch {}

    try {
      const brief = await projectStore.readFile(projectId, "brief.md")
      archive.append(brief, { name: "README.md" })
    } catch {}

    try {
      const statusJson = await projectStore.readFile(projectId, "status.json")
      archive.append(statusJson, { name: "skynet-spec.json" })
    } catch {}

    await archive.finalize()
  } catch (err) {
    return res.status(500).json({ error: "Download packaging failed", detail: String(err) })
  }
})

// Delegate a workstream to a department
const DelegateBodySchema = z.object({
  brief: z.string().min(1),
})

app.post("/projects/:id/delegate/:department", requireAuth, async (req, res) => {
  try {
    const { department } = req.params
    const { brief } = DelegateBodySchema.parse(req.body)
    const state = await projectStore.getState(req.params.id)
    if (!state) {
      return res.status(404).json({ error: "Project not found" })
    }
    if (state.ownerId !== (req as any).userId) {
      return res.status(403).json({ error: "Not authorized to modify this project" })
    }

    const deptId = parseDepartmentId(department)
    if (!deptId) {
      return res.status(400).json({ error: `Unknown department: ${department}` })
    }

    const briefMarkdown = delegator.buildDelegationBrief({
      projectId: state.id,
      department,
      objective: brief,
      context: `Project brief: ${state.brief}`,
    })

    await delegator.recordDelegation(state.id, department, briefMarkdown)

    return res.json({
      projectId: req.params.id,
      department,
      status: "delegated",
      message: `Delegated ${department} workstream.`,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request", issues: err.issues })
    }
    return res.status(500).json({ error: "Delegation failed", detail: String(err) })
  }
})

// Deploy gate check
app.get("/projects/:id/deploy-gate", requireAuth, async (req, res) => {
  try {
    const state = await projectStore.getState(req.params.id)
    if (!state) {
      return res.status(404).json({ error: "Project not found" })
    }
    if (state.ownerId !== (req as any).userId) {
      return res.status(403).json({ error: "Not authorized to view this project" })
    }

    const result = await gatekeeper.checkDeployGate(req.params.id)
    return res.json({
      projectId: req.params.id,
      ...result,
    })
  } catch (err) {
    return res.status(500).json({ error: "Deploy gate check failed", detail: String(err) })
  }
})

// Deploy (gate enforced)
app.post("/projects/:id/deploy", requireAuth, async (req, res) => {
  try {
    const state = await projectStore.getState(req.params.id)
    if (!state) {
      return res.status(404).json({ error: "Project not found" })
    }
    if (state.ownerId !== (req as any).userId) {
      return res.status(403).json({ error: "Not authorized to deploy this project" })
    }

    const result = await gatekeeper.checkDeployGate(req.params.id)
    if (!result.allowed) {
      return res.status(400).json({
        deployAllowed: false,
        reason: result.reason,
        gates: result.gates,
      })
    }

    await projectStore.updateState(req.params.id, { status: "done" })
    return res.json({
      projectId: req.params.id,
      deployAllowed: true,
      url: `http://localhost:${PORT}/projects/${req.params.id}/preview`,
      previewUrl: `/projects/${req.params.id}/preview`,
      message: "Deployed successfully to live preview.",
    })
  } catch (err) {
    return res.status(500).json({ error: "Deploy failed", detail: String(err) })
  }
})

app.listen(PORT, () => {
  console.log(`Skynet engine listening on http://localhost:${PORT}`)
})

export default app
