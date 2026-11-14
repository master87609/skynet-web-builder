# mvp-scope.md

**Project Code:** PROJECT-NEURAL-CHAT  
**Author:** Lead Product Strategist, Skynet  

---

## 1. Feature Breakdown: Version 1 (v1) vs. Future Expansion

To capture market share rapidly while maintaining our performance budgets (<500ms TTFT, 60 FPS client rendering), the feature set is strictly triaged between the v1 Minimum Viable Product and subsequent roadmap releases.

| Feature Category | v1 MVP Release (Immediate Build) | Future Expansion (v2 / v3 Roadmap) |
| :--- | :--- | :--- |
| **Core AI Interface** | • Real-time SSE token streaming<br>• "Stop Generating" abort button<br>• Basic Markdown & auto-scrolling UI | • Voice-to-text / Text-to-speech audio streaming<br>• Canvas-style side-by-side editing workspace |
| **Code & Math** | • Syntax highlighting with language labels<br>• Single-click "Copy Code" button<br>• KaTeX mathematical formula rendering | • In-browser secure sandbox code execution (Python/JS REPL) |
| **Chat Management** | • Auto-generated titles via lightweight LLM<br>• Chronological sidebar (Today, Yesterday, etc.)<br>• Manual rename, pin, archive, and delete | • Folder/Project categorization for threads<br>• Full-text semantic search across historical messages |
| **Model & Prompts** | • Dropdown model selector (Fast vs. Advanced)<br>• Custom system instructions profile settings<br>• Message editing & response branching | • Multi-model split view (compare two models side-by-side)<br>• Public prompt marketplace and community templates |
| **Multimodal & Files** | • Drag-and-drop file uploads (PDF, TXT, CSV, Images)<br>• OCR & text extraction parsing pipeline | • Audio file transcription and analysis pipelines<br>• Video frame-by-frame analysis |
| **Auth & Workspace** | • OAuth 2.0 / OIDC (Google, GitHub, Email)<br>• Basic usage analytics & tier status | • Team workspace sharing & collaborative threads<br>• Advanced RBAC (Role-Based Access Control) |

---

## 2. v1 MVP Detailed Specifications

The v1 release directly maps to the functional requirements and user stories defined in upstream documentation to ensure a world-class user experience out of the gate:

* **US-01 (Streaming Interface):** Fully operational SSE or WebSocket connection handling token streams with sub-500ms TTFT, auto-scroll behavior, and an instantaneous abort mechanism.
* **US-02 (Code & Syntax):** Client-side rendering supporting dynamic code block formatting, auto-detection, and copy clipboard states.
* **US-03 (History Management):** Persistent PostgreSQL storage coupled with Redis caching, managing sidebar threads grouped chronologically with CRUD actions.
* **US-04 (Model Switching):** Dynamic API payload routing allowing mid-session model toggling between speed-optimized and advanced reasoning configurations.
* **US-05 (File Uploads):** Drag-and-drop ingestion supporting document parsing and image OCR extraction to feed contextual data into upstream LLM prompts.
* **US-06 (Editing & Branching):** User message mutation handling thread truncation, re-submission, and navigation arrows (`< 1 / 2 >`) to toggle between prompt branches.
* **US-07 (Custom Instructions):** Account settings persistence injecting custom system prompt pre-fixes into all newly instantiated conversation threads.