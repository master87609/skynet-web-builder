# sitemap.md — Information Architecture & Hierarchical Sitemap

**Project Code:** PROJECT-NEURAL-CHAT  
**Author:** Principal UX Architect, Skynet  

---

## 1. Information Architecture Principles
The Skynet Neural Chat platform architecture follows a streamlined, low-latency, app-shell model optimized for deep task focus (Alex), content generation workflows (Sarah), and data analysis (Marcus). The primary workspace utilizes a persistent split-pane design (Collapsible Sidebar + Main Conversational Canvas) to minimize navigation depth and maintain instantaneous 60 FPS state transitions.

---

## 2. Complete Hierarchical Sitemap

```text
Root /
├── 1.0 Authentication & Onboarding (Auth Shell)
│   ├── 1.1 Login (/auth/login)
│   │   ├── [Action] Email / Password Auth
│   │   ├── [Action] OAuth 2.0 / OIDC Provider (Google)
│   │   └── [Action] OAuth 2.0 / OIDC Provider (GitHub)
│   ├── 1.2 Register (/auth/register)
│   └── 1.3 Password Reset (/auth/reset)
│
├── 2.0 Main Workspace & Conversational Shell (App Shell) [Authenticated]
│   ├── 2.1 Active Chat Interface (/chat or /chat/:threadId)
│   │   ├── 2.1.1 Sidebar (Collapsible Navigation)
│   │   │   ├── [Action] "New Chat" Action Button
│   │   │   ├── [Search] History Search Input
│   │   │   ├── [List] Chronological Thread Groups
│   │   │   │   ├── "Today"
│   │   │   │   ├── "Yesterday"
│   │   │   │   ├── "Previous 7 Days"
│   │   │   │   └── "Older"
│   │   │   └── [Context Menu / Dropdown per Thread]
│   │   │       ├── Rename Thread Modal
│   │   │       ├── Pin Thread Action
│   │   │       ├── Archive Thread Action
│   │   │       └── Delete Thread Confirmation
│   │   ├── 2.1.2 Main Conversational Canvas
│   │   │   ├── Header Toolbar
│   │   │   │   ├── Model Selector Dropdown (Fast / Standard vs. Advanced / Reasoning)
│   │   │   │   ├── Share Thread Button (Generates read-only public link)
│   │   │   │   └── Export Dropdown Menu (Markdown .md, PDF, Plain Text .txt)
│   │   │   ├── Message History Stream Area
│   │   │   │   ├── User Message Nodes (with Edit / Branch Actions & `< 1 / 2 >` Branch Switcher)
│   │   │   │   └── Assistant Message Nodes (with Markdown, KaTeX, Code Blocks, Copy Button, Feedback thumbs up/down)
│   │   │   └── Persistent Input Footer
│   │   │       ├── File Attachment Drag-and-Drop Zone / Thumbnail Preview
│   │   │       ├── Quick Prompt Command Trigger (`/` hotkey template library popup)
│   │   │       ├── Multi-line Text Input Area
│   │   │       └── Action Buttons ("Stop Generating" active stream vs. "Send Message" submit)
│   │   │
│   ├── 2.2 User Settings Modal / View (`/settings`)
│   │   ├── 2.2.1 General Preferences
│   │   │   ├── Theme Toggle (System / Light / Dark)
│   │   │   └── Default Model Selection
│   │   ├── 2.2.2 Custom Instructions (System Prompt overrides)
│   │   │   ├── "What would you like Skynet Chat to know about you?"
│   │   │   └── "How would you like Skynet Chat to respond?"
│   │   ├── 2.2.3 Data Controls & Privacy
│   │   │   ├── Model Training Opt-Out Toggle (NFR-03)
│   │   │   ├── Delete All Chat History Action
│   │   │   └── Export Account Data Action
│   │   └── 2.2.4 Account & Usage Analytics (`/settings/usage`)
│   │       ├── Subscription Tier Status (e.g., Free vs. Pro)
│   │       ├── Token Consumption Meter & Rate Limit Status
│   │       └── Billing & Invoices Management
│   │
│   └── 2.3 Shared Read-Only Thread View (`/share/:shareId`)
│       ├── Public Header (Skynet Branding & "Try Skynet Free" CTA)
│       └── Non-Editable Conversation Transcript (Markdown & KaTeX rendered)
```

---

## 3. Navigation & IA Structural Notes
* **State Preservation:** The sidebar state (collapsed/expanded), active model selection, and draft prompt text are preserved in local client storage during active navigation sessions.
* **Deep Linking:** Every chat thread maintains a unique URL (`/chat/:threadId`), allowing power users (Alex) and researchers (Marcus) to bookmark or directly reference specific investigative workflows.
* **Modal Architecture:** Settings, Shared Link generation, and Custom Instructions execute inside non-blocking, accessible modal overlays (`aria-modal="true"`) to maintain the persistent conversational context in the background.

---