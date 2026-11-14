import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises"
import { join } from "node:path"
import { existsSync } from "node:fs"
import { z } from "zod"

export const ProjectStatusSchema = z.enum([
  "todo",
  "in_progress",
  "review",
  "blocked",
  "done",
  "approved",
])

export type ProjectStatus = z.infer<typeof ProjectStatusSchema>

export interface ProjectArtifact {
  path: string
  owner: string
  phase: string
  status: ProjectStatus
  updated: string
}

export type SubscriptionPlan = "free" | "advance" | "host"

export interface UserSession {
  id: string
  email: string
  name: string
  plan?: SubscriptionPlan
  createdAt: string
}

export interface DeployedHostConfig {
  domain: string
  target: string
  url: string
  deployedAt: string
  status: "active" | "pending"
  ssl: "active" | "provisioning"
}

export interface ProjectState {
  id: string
  ownerId: string
  brief: string
  assumptions?: string
  status: ProjectStatus
  currentPhase: string
  completedPhases: string[]
  artifacts: ProjectArtifact[]
  deployedHost?: DeployedHostConfig
  createdAt: string
  updatedAt: string
}

export interface CreateProjectInput {
  brief: string
  ownerId: string
  projectId?: string
}

/**
 * ProjectStore persists all project artifacts and users under the data dir.
 * This is the single source of truth — no hidden state: if it is not in the
 * store, it did not happen.
 */
export class ProjectStore {
  private readonly baseDir: string
  private readonly usersDir: string
  private readonly sessionsDir: string

  constructor(baseDir = "../data") {
    // Resolve relative to the engine package directory so it works regardless
    // of the current working directory.
    this.baseDir = join(process.cwd(), baseDir)
    this.usersDir = join(this.baseDir, "users")
    this.sessionsDir = join(this.baseDir, "sessions")
  }

  private projectDir(id: string): string {
    return join(this.baseDir, "projects", id)
  }

  private artifactPath(id: string, relativePath: string): string {
    return join(this.projectDir(id), relativePath)
  }

  private async ensureDirs(): Promise<void> {
    await mkdir(this.baseDir, { recursive: true })
    await mkdir(this.usersDir, { recursive: true })
    await mkdir(this.sessionsDir, { recursive: true })
  }

  /* ---------------- Users ---------------- */

  async userExists(email: string): Promise<boolean> {
    await this.ensureDirs()
    return existsSync(join(this.usersDir, `${email}.json`))
  }

  async createUser(input: {
    email: string
    passwordHash: string
    name: string
  }): Promise<UserSession> {
    await this.ensureDirs()
    if (await this.userExists(input.email)) {
      throw new Error(`User ${input.email} already exists`)
    }
    const now = new Date().toISOString()
    const user: UserSession = {
      id: `user-${Date.now()}`,
      email: input.email,
      name: input.name,
      plan: "free",
      createdAt: now,
    }
    await writeFile(
      join(this.usersDir, `${input.email}.json`),
      JSON.stringify({ ...user, passwordHash: input.passwordHash }, null, 2),
      "utf8",
    )
    return user
  }

  async getUserByEmail(email: string): Promise<
    | (UserSession & { passwordHash: string })
    | null
  > {
    await this.ensureDirs()
    try {
      const raw = await readFile(join(this.usersDir, `${email}.json`), "utf8")
      return JSON.parse(raw) as UserSession & { passwordHash: string }
    } catch {
      return null
    }
  }

  async getUserById(id: string): Promise<UserSession | null> {
    await this.ensureDirs()
    const entries = await readdir(this.usersDir)
    for (const entry of entries) {
      if (!entry.endsWith(".json")) continue
      try {
        const raw = await readFile(join(this.usersDir, entry), "utf8")
        const user = JSON.parse(raw) as UserSession & { passwordHash: string }
        if (user.id === id) {
          const { passwordHash, ...rest } = user
          return {
            ...rest,
            plan: rest.plan || "free",
          }
        }
      } catch {
        continue
      }
    }
    return null
  }

  async updateUser(
    id: string,
    patch: Partial<UserSession>,
  ): Promise<UserSession | null> {
    await this.ensureDirs()
    const entries = await readdir(this.usersDir)
    for (const entry of entries) {
      if (!entry.endsWith(".json")) continue
      try {
        const filePath = join(this.usersDir, entry)
        const raw = await readFile(filePath, "utf8")
        const user = JSON.parse(raw) as UserSession & { passwordHash: string }
        if (user.id === id) {
          const updated = {
            ...user,
            ...patch,
            plan: patch.plan || user.plan || "free",
          }
          await writeFile(filePath, JSON.stringify(updated, null, 2), "utf8")
          const { passwordHash, ...rest } = updated
          return rest
        }
      } catch {
        continue
      }
    }
    return null
  }

  /* ---------------- Sessions ---------------- */

  async createSession(userId: string, token: string): Promise<void> {
    await this.ensureDirs()
    await writeFile(
      join(this.sessionsDir, `${token}.json`),
      JSON.stringify({ userId, token, createdAt: new Date().toISOString() }),
      "utf8",
    )
  }

  async getSession(token: string): Promise<{ userId: string } | null> {
    await this.ensureDirs()
    try {
      const raw = await readFile(join(this.sessionsDir, `${token}.json`), "utf8")
      return JSON.parse(raw) as { userId: string }
    } catch {
      return null
    }
  }

  async deleteSession(token: string): Promise<void> {
    await this.ensureDirs()
    try {
      await stat(join(this.sessionsDir, `${token}.json`))
      await writeFile(join(this.sessionsDir, `${token}.json`), "", "utf8")
    } catch {
      // ignore
    }
  }

  /* ---------------- Projects ---------------- */

  async init(input: CreateProjectInput): Promise<ProjectState> {
    await this.ensureDirs()
    const id = input.projectId || `skynet-${Date.now()}`
    const dir = this.projectDir(id)
    if (existsSync(dir)) {
      throw new Error(`Project ${id} already exists`)
    }
    await mkdir(dir, { recursive: true })

    const now = new Date().toISOString()
    const state: ProjectState = {
      id,
      ownerId: input.ownerId,
      brief: input.brief,
      status: "todo",
      currentPhase: "intake",
      completedPhases: [],
      artifacts: [],
      createdAt: now,
      updatedAt: now,
    }

    await this.writeFile(id, "brief.md", input.brief)
    await this.writeState(id, state)
    return state
  }

  async getState(id: string): Promise<ProjectState | null> {
    await this.ensureDirs()
    try {
      const raw = await readFile(this.artifactPath(id, "status.json"), "utf8")
      return JSON.parse(raw) as ProjectState
    } catch {
      return null
    }
  }

  async updateState(
    id: string,
    patch: Partial<Omit<ProjectState, "id">>,
  ): Promise<ProjectState> {
    const existing = await this.getState(id)
    if (!existing) {
      throw new Error(`Project ${id} not found`)
    }
    const updated: ProjectState = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    }
    await this.writeState(id, updated)
    return updated
  }

  async writeFile(
    id: string,
    relativePath: string,
    content: string,
  ): Promise<void> {
    const fullPath = this.artifactPath(id, relativePath)
    await mkdir(join(fullPath, ".."), { recursive: true })
    await writeFile(fullPath, content, "utf8")
  }

  async readFile(id: string, relativePath: string): Promise<string> {
    return readFile(this.artifactPath(id, relativePath), "utf8")
  }

  async listArtifacts(id: string): Promise<ProjectArtifact[]> {
    const state = await this.getState(id)
    if (!state) return []
    return state.artifacts
  }

  async addArtifact(
    id: string,
    artifact: { owner: string; phase: string; status: ProjectStatus; updated: string },
    relativePath: string,
  ): Promise<void> {
    const state = await this.getState(id)
    if (!state) {
      throw new Error(`Project ${id} not found`)
    }
    const entry: ProjectArtifact = {
      ...artifact,
      path: join(this.baseDir, "projects", id, relativePath.replace(/^\//, "")),
    }
    const existingIndex = state.artifacts.findIndex((a) => a.path === entry.path)
    if (existingIndex >= 0) {
      state.artifacts[existingIndex] = entry
    } else {
      state.artifacts.push(entry)
    }
    await this.writeState(id, {
      ...state,
      artifacts: state.artifacts,
      updatedAt: new Date().toISOString(),
    })
  }

  private async writeState(id: string, state: ProjectState): Promise<void> {
    await this.writeFile(id, "status.json", JSON.stringify(state, null, 2))
  }

  async projectExists(id: string): Promise<boolean> {
    const state = await this.getState(id)
    return state !== null
  }

  async listProjects(ownerId?: string): Promise<string[]> {
    await this.ensureDirs()
    const projectsDir = join(this.baseDir, "projects")
    if (!existsSync(projectsDir)) return []
    const entries = await readdir(projectsDir, { withFileTypes: true })
    const ids = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort()
    if (!ownerId) return ids
    // Filter to projects owned by the given user
    const owned: string[] = []
    for (const id of ids) {
      try {
        const state = await this.getState(id)
        if (state && state.ownerId === ownerId) owned.push(id)
      } catch {
        continue
      }
    }
    return owned
  }
}

export const projectStore = new ProjectStore()
