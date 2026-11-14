# user-flows.md — Step-by-Step Conversion and Navigation Flows

**Project Code:** PROJECT-NEURAL-CHAT  
**Author:** Principal UX Architect, Skynet  

---

## Flow 1: New User Onboarding & First-Prompt Conversion (Sarah & Alex)
* **Goal:** Guide an unauthenticated visitor from landing/login to submitting their first prompt with sub-500ms TTFT streaming response.

```text
[Landing / Auth Gate (/auth/login)]
       │
       ▼ (User clicks "Continue with Google" or enters credentials)
[OAuth / Credential Validation] ──(Failure)──> [Error Toast / Retry Login]
       │ (Success)
       ▼
[Active Workspace Shell (/chat)]
  ├── System auto-initializes blank conversation thread
  ├── Sidebar loads chronological history from PostgreSQL/Redis
  └── Focus automatically shifts to Main Input Box (< 50ms responsiveness)
       │
       ▼ (User types prompt or selects from Prompt Library via '/' hotkey)
[Main Input Box: Prompt Submission]
       │
       ▼ (User presses Enter or clicks Send Button)
[Client Validation & Payload Dispatch]
  ├── UI instantly appends User Message node to canvas
  ├── Input box clears; "Send" transforms into "Stop Generating" button
  └── SSE / WebSocket connection opens to backend inference cluster
       │
       ▼ (Backend token bucket rate limit check & context window assembly)
[AI Inference & Real-Time Token Streaming] 
  ├── Sub-500ms: Time-to-First-Token (TTFT) achieved
  ├── Live Markdown rendering updates DOM at 60 FPS
  └── Auto-scroll locks to bottom unless user manually scrolls up
       │
       ▼ (Stream Completes)
[Background Thread Titling]
  ├── Lightweight LLM call auto-generates thread title based on initial prompt
  └── Sidebar dynamically updates, inserting new thread into "Today" group
```

---

## Flow 2: Complex Technical Debugging & Branching (Alex - Software Engineer)
* **Goal:** Enable a developer to upload a code file, inspect syntax-highlighted code output, copy code blocks instantly, edit an earlier prompt, and branch the conversational tree.

```text
[Active Chat Thread (/chat/:threadId)]
       │
       ▼ (Alex drags & drops 'script.py' onto input footer)
[File Upload & Text Extraction Pipeline]
  ├── UI displays file chip preview with extraction status
  └── Backend parses text/code content and appends to context payload
       │
       ▼ (Alex enters debugging request and submits)
[AI Streaming Response Delivery]
  ├── Assistant returns markdown stream containing code blocks
  └── Client-side syntax highlighter parses language and adds line numbers
       │
       ▼ (Alex interacts with Code Block)
[Single-Click "Copy Code" Action]
  ├── Clipboard API stores raw string
  └── Visual confirmation toast ("Copied to clipboard!") triggers for 2s
       │
       ▼ (Alex realizes an earlier prompt had a bug and wants to try a different approach)
[Prompt Editing & Branching (US-06)]
  ├── Alex hovers over an earlier User Message node
  ├── Clicks "Edit" icon (pencil)
  ├── Inline textarea opens pre-populated with original prompt text
  └── Alex modifies prompt parameters and clicks "Submit Revision"
       │
       ▼
[Conversation Branching Execution]
  ├── System truncates downstream messages from that index onward
  └── Instantly spawns Response Branch B while preserving Branch A in history
       │
       ▼ (User navigates branches)
[Branch Switcher Navigation (< 1 / 2 >)]
  ├── UI renders branch indicator pill above user message
  └── Alex clicks `<` or `>` arrows to seamlessly toggle between Branch A and Branch B contexts
```

---

## Flow 3: Academic Document Analysis & LaTeX Rendering (Marcus - Researcher)
* **Goal:** Upload a complex PDF, request mathematical derivations, view rendered KaTeX formulas, and export the resulting thread.

```text
[Active Chat Thread (/chat/:threadId)]
       │
       ▼ (Marcus uploads 'research_paper.pdf')
[OCR & Document Parsing Pipeline]
  └── Document text extracted and indexed into context window
       │
       ▼ (Marcus requests mathematical proof and citation summary)
[Token Streaming with KaTeX & Markdown]
  ├── System streams response containing inline and block LaTeX formulas
  └── Client-side KaTeX rendering engine formats mathematical notation without UI thread blocking
       │
       ▼ (Marcus decides to preserve and share findings)
[Content Export & Sharing Flow]
  ├── Option A: Clicks Header "Share" Button ──> Generates public read-only link (/share/:shareId) with privacy toggle
  └── Option B: Clicks Header "Export" Dropdown ──> Selects "Export as PDF" or "Export as Markdown (.md)"
       │
       ▼
[File Download Triggered / Public Link Copied]
```

---

## Flow 4: Custom Instructions & Model Parameter Configuration (Sarah - Content Strategist)
* **Goal:** Establish persistent system instructions to streamline marketing copy generation and switch models mid-session.

```text
[Active Workspace Shell (/chat)]
       │
       ▼ (Sarah clicks User Profile Avatar in bottom sidebar)
[Settings Modal Opens (/settings)]
       │
       ▼ (Navigates to "Custom Instructions" tab)
[Custom Instructions Configuration]
  ├── Inputs persona parameters: "What should Skynet know?" & "How should Skynet respond?"
  └── Clicks "Save Instructions" (persists to PostgreSQL user profile)
       │
       ▼ (Returns to Chat Canvas and switches models)
[Mid-Session Model Selector Dropdown]
  ├── Sarah clicks model dropdown in header
  └── Switches from "Fast/Standard Model" to "Advanced/Reasoning Model"
       │
       ▼
[Dynamic Payload Routing]
  ├── Subsequent prompt submissions automatically prepend saved Custom Instructions
  └── Routed to advanced model inference endpoint with updated token limits
```