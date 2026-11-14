# Component Specifications: Skynet Neural Chat Platform

**Project Code:** PROJECT-NEURAL-CHAT  
**Author:** Design System Lead, Skynet  

---

## 1. Global Component Principles
* **State Performance:** All interactive UI controls must respond within < 50ms. Animations and structural transformations (sidebar collapse/expand, branch switches) execute via hardware-accelerated CSS transforms targeting 60 FPS.
* **Accessibility:** Full WCAG 2.1 Level AA compliance. Interactive elements require explicit `aria-*` attributes, visible focus rings (`ring-2 ring-primary`), and `aria-live="polite"` regions for real-time streaming tokens.
* **Theme Adaptability:** Components utilize semantic design tokens, guaranteeing seamless contrast ratios across dark operational surfaces (`#0E0E10` / `#1E1E24`).

---

## 2. Core UI Components

### 2.1 Navigation & Workspace Shell (`AppShell` & `Sidebar`)

#### `Sidebar`
* **Description:** A collapsible left-hand navigation pane housing the "New Chat" trigger, history search, and chronological conversation groupings.
* **Anatomy & States:**
  * **Expanded Width:** `280px` (Desktop); **Collapsed Width:** `0px` / Icon-rail (`64px`).
  * **Header:** Houses the "New Chat" action button (`bg-primary text-text-inverse rounded-md py-2 px-4 hover:bg-primary-hover`) and Sidebar Toggle icon.
  * **Search Input:** Persistent text input with magnifying glass icon and `/` keyboard shortcut indicator.
  * **Thread Groupings:** Chronological sections ("Today", "Yesterday", "Previous 7 Days", "Older") rendered with interactive thread rows.
* **Interactions & Behavior:**
  * Hovering a thread row reveals a context menu trigger (`...`) exposing Rename, Pin, Archive, and Delete actions.
  * State (collapsed/expanded) is preserved in local client storage.

#### `HeaderToolbar`
* **Description:** Top bar fixed above the conversational canvas managing global thread utilities.
* **Anatomy:**
  * **Model Selector Dropdown:** Pill component displaying active model (e.g., "Skynet-4 Advanced" vs "Skynet-3.5 Fast") with chevron indicator. Clicking opens a dropdown menu outlining token limits and reasoning tiers.
  * **Share Thread Button:** Secondary action button triggering public read-only link generation modal.
  * **Export Dropdown:** Triggers selection menu for Markdown (.md), PDF, and Plain Text (.txt) downloads.

---

### 2.2 Conversational Canvas & Message Stream

#### `MessageNode` (User & Assistant)
* **Description:** Individual conversational turns within the streaming message stream.
* **User Message Node:**
  * Rendered as a distinct chat bubble (`bg-surface rounded-lg p-4 ml-auto max-w-[80%]`).
  * Includes an inline "Edit" action button (pencil icon) that transforms the static text into an active textarea for conversation branching (US-06).
  * Renders branch navigation pills (`< 1 / 2 >`) when multiple prompt forks exist.
* **Assistant Message Node:**
  * Full-width fluid container (`bg-background-subtle py-6 px-4`).
  * Incorporates real-time streaming markdown renderer (headings, bullet points, blockquotes).
  * **Code Block Integration:** Automatically parses code fences, injects language title, line numbers, and a single-click "Copy Code" button with temporary "Copied!" checkmark feedback.
  * **KaTeX Mathematics:** Inline (`$...$`) and block (`$$...$$`) LaTeX formulas rendered synchronously without blocking the UI thread.
  * **Feedback Footer:** Thumbs Up / Thumbs Down evaluation buttons and a Regenerate Response trigger.

#### `PersistentInputFooter`
* **Description:** Fixed bottom anchoring container for prompt composition, file attachments, and stream control.
* **Anatomy & States:**
  * **Dropzone Overlay:** Activated when dragging files (PDF, CSV, TXT, PY, PNG) over the canvas, showing thumbnail previews with deletion tags.
  * **Command Trigger:** `/` hotkey popup menu for quick prompt templates.
  * **Textarea:** Auto-expanding multi-line text input (max-height: 200px) supporting `Shift + Enter` for line breaks and `Enter` for submission.
  * **Action Button (Dynamic State):**
    * *Idle State:* Primary "Send Message" arrow icon button (`bg-primary text-text-inverse rounded-full p-2`).
    * *Streaming State:* Transforms into a red/amber "Stop Generating" square icon button (`bg-status-error text-text-inverse`) to abort active SSE streams instantly.

---

### 2.3 Modals & Overlays

#### `SettingsModal` (`/settings`)
* **Description:** Non-blocking accessible modal overlay (`aria-modal="true"`) managing user preferences, custom instructions, and billing.
* **Tabs:**
  * *General:* Theme selector (System / Light / Dark) and Default Model selector.
  * *Custom Instructions:* Two-part textareas ("What would you like Skynet Chat to know about you?" / "How would you like Skynet Chat to respond?").
  * *Data Controls:* Model training opt-out toggle (NFR-03) and history deletion triggers.
  * *Usage Analytics:* Token consumption progress meters and subscription tier status.

#### `ShareModal`
* **Description:** Popover modal generated when clicking the header Share button.
* **Anatomy:** Read-only URL display input with a "Copy Link" action button and privacy badge confirming public accessibility settings.