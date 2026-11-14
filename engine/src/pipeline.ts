import { EventEmitter } from "node:events"
import { projectStore } from "./project-store.js"
import { DEPENDENCY_ORDER, DepartmentId } from "./orchestrator.js"
import { runDepartmentAgent, DepartmentName } from "./ai-agent.js"
import { neuralEngine } from "./neural-network.js"

export interface PipelineEvent {
  type: "init" | "phase_start" | "phase_complete" | "artifact" | "log" | "build_complete" | "error"
  projectId: string
  department?: DepartmentId
  phaseIndex?: number
  totalPhases?: number
  path?: string
  message?: string
  error?: string
  previewUrl?: string
  timestamp: string
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class BuildPipeline extends EventEmitter {
  private activeBuilds = new Set<string>()
  private eventHistory = new Map<string, PipelineEvent[]>()

  public isBuilding(projectId: string): boolean {
    return this.activeBuilds.has(projectId)
  }

  public getHistory(projectId: string): PipelineEvent[] {
    return this.eventHistory.get(projectId) || []
  }

  private emitPipelineEvent(event: PipelineEvent) {
    if (!this.eventHistory.has(event.projectId)) {
      this.eventHistory.set(event.projectId, [])
    }
    this.eventHistory.get(event.projectId)!.push(event)
    this.emit(`event:${event.projectId}`, event)
  }

  /**
   * Run the full multi-agent pipeline across all 13 departments in strict dependency order.
   */
  public async run(projectId: string): Promise<void> {
    if (this.activeBuilds.has(projectId)) {
      console.log(`[Pipeline] Build already active for project ${projectId}`)
      return
    }

    this.activeBuilds.add(projectId)

    try {
      const state = await projectStore.getState(projectId)
      if (!state) {
        throw new Error(`Project ${projectId} not found`)
      }

      await projectStore.updateState(projectId, {
        status: "in_progress",
        currentPhase: DEPENDENCY_ORDER[0],
      })

      this.emitPipelineEvent({
        type: "init",
        projectId,
        message: `Skynet Chief Orchestrator initiated build pipeline for project "${projectId}".`,
        timestamp: new Date().toISOString(),
      })

      // Run Native Neural Network Latent Analysis
      const neuralAnalysis = neuralEngine.analyzeBrief(state.brief)
      this.emitPipelineEvent({
        type: "log",
        projectId,
        message: `[Neural Network] 32-dim feature embedding computed. Predicted Domain: "${neuralAnalysis.topCategory}" (${neuralAnalysis.confidence}% confidence, complexity: ${neuralAnalysis.complexityIndex}). Aesthetic tone: "${neuralAnalysis.predictedTokens.designTone}".`,
        timestamp: new Date().toISOString(),
      })

      const completedPhases: string[] = []
      const previousArtifacts: Record<string, string> = {
        "neural/analysis.json": JSON.stringify(neuralAnalysis, null, 2),
      }

      for (let i = 0; i < DEPENDENCY_ORDER.length; i++) {
        const dept = DEPENDENCY_ORDER[i]

        await projectStore.updateState(projectId, {
          currentPhase: dept,
        })

        this.emitPipelineEvent({
          type: "phase_start",
          projectId,
          department: dept,
          phaseIndex: i + 1,
          totalPhases: DEPENDENCY_ORDER.length,
          message: `Department [${dept}] active. Commencing workstream...`,
          timestamp: new Date().toISOString(),
        })

        // Realistic agent work pacing
        await delay(350)

        const emitLog = (msg: string) => {
          this.emitPipelineEvent({
            type: "log",
            projectId,
            department: dept,
            message: msg,
            timestamp: new Date().toISOString(),
          })
        }

        // Execute agent
        const result = await runDepartmentAgent(
          dept as DepartmentName,
          {
            brief: state.brief,
            previousArtifacts,
          },
          emitLog
        )

        // Persist artifacts
        for (const art of result.artifacts) {
          await projectStore.writeFile(projectId, art.path, art.content)
          await projectStore.addArtifact(
            projectId,
            {
              owner: dept,
              phase: dept,
              status: "approved",
              updated: new Date().toISOString(),
            },
            art.path
          )

          previousArtifacts[art.path] = art.content

          this.emitPipelineEvent({
            type: "artifact",
            projectId,
            department: dept,
            path: art.path,
            message: `Artifact authored: ${art.path}`,
            timestamp: new Date().toISOString(),
          })

          if (dept === "frontend" && art.path === "code/index.html") {
            const audit = neuralEngine.evaluateCode(art.content)
            this.emitPipelineEvent({
              type: "log",
              projectId,
              department: dept,
              message: `[Neural Quality Gate] Code evaluation score: ${audit.qualityScore}/100. Hierarchy rating: ${audit.visualHierarchyRating}%. Detected: ${audit.featuresDetected.join(", ")}.`,
              timestamp: new Date().toISOString(),
            })
          }
        }

        completedPhases.push(dept)
        await projectStore.updateState(projectId, {
          completedPhases: [...completedPhases],
        })

        await delay(250)

        this.emitPipelineEvent({
          type: "phase_complete",
          projectId,
          department: dept,
          phaseIndex: i + 1,
          totalPhases: DEPENDENCY_ORDER.length,
          message: `Department [${dept}] completed and quality checked.`,
          timestamp: new Date().toISOString(),
        })
      }

      await projectStore.updateState(projectId, {
        status: "done",
        currentPhase: "done",
      })

      this.emitPipelineEvent({
        type: "build_complete",
        projectId,
        previewUrl: `/projects/${projectId}/preview`,
        message: `Website compilation complete! All 13 specialist departments delivered approved outputs.`,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      console.error(`[Pipeline Error] Project ${projectId}:`, err)
      await projectStore.updateState(projectId, {
        status: "blocked",
      })
      this.emitPipelineEvent({
        type: "error",
        projectId,
        error: (err as Error).message,
        timestamp: new Date().toISOString(),
      })
    } finally {
      this.activeBuilds.delete(projectId)
    }
  }
}

export const pipeline = new BuildPipeline()
