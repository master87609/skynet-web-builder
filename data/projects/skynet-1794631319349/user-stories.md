# User Stories

## US-01: Real-Time Streaming Interface
**As a** Casual User,  
**I want** to see the AI's response stream token-by-token in real time,  
**So that** I receive immediate feedback and don't have to wait for the entire completion to finish generating before reading.

### Acceptance Criteria:
* Response generation begins within 500ms of clicking submit.
* User can click a "Stop Generating" button at any point to halt token generation.
* Interface auto-scrolls down as new lines stream in, unless user manually scrolls up.

---

## US-02: Code Syntax Highlighting & Copy Capability
**As a** Software Engineer,  
**I want** code blocks within AI responses to automatically format with proper syntax highlighting and provide a copy button,  
**So that** I can easily inspect, read, and paste valid code into my IDE.

### Acceptance Criteria:
* Programming language is auto-detected and visually labeled on the code block header.
* A "Copy" button appears in the upper right of every code box.
* Clicking "Copy" updates the button state to "Copied!" and copies raw un-formatted code to the clipboard.

---

## US-03: Chat Thread History Management
**As a** Content Strategist,  
**I want** my past chat conversations to automatically save in a sidebar organized chronologically,  
**So that** I can resume previous brainstorming sessions without losing context.

### Acceptance Criteria:
* Active conversation is automatically given a short relevant title after the first prompt turn.
* Sidebar groups threads into "Today", "Yesterday", "Previous 7 Days", and "Older".
* Hovering over a thread exposes options to rename or delete the conversation.

---

## US-04: Model Switching Capabilities
**As a** Power User,  
**I want** to select between different underlying AI models (e.g., speed-optimized vs. advanced-reasoning),  
**So that** I can optimize performance and accuracy based on the difficulty of my task.

### Acceptance Criteria:
* Model selector dropdown is present at the top of the workspace interface.
* Changing models mid-session applies the new model to subsequent prompts in that thread.
* Clear visual badges indicate model capabilities (e.g., "Fast", "Reasoning", "Vision").

---

## US-05: Document & Image File Uploads
**As an** Academic Researcher,  
**I want** to attach PDFs, text documents, or images to my prompt input,  
**So that** the AI model can analyze, summarize, or translate content from my external files.

### Acceptance Criteria:
* Drag-and-drop target covers the input chat container.
* Uploaded files appear as chip previews inside the text box prior to sending.
* Error toast alerts user if file exceeds max size limit (e.g., >20MB) or unparseable file format.

---

## US-06: Editing and Branching Prompts
**As a** General User,  
**I want** to edit a previously submitted prompt in an active conversation,  
**So that** I can correct my request or explore an alternative direction without restarting the chat.

### Acceptance Criteria:
* Hovering over any user message displays an "Edit" icon.
* Submitting an edited prompt truncates subsequent messages and generates a new completion response.
* Navigation arrows ("< 2 / 2 >") allow the user to toggle back and forth between different response branches.

---

## US-07: Custom System Instructions
**As a** Power User,  
**I want** to set custom system instructions for my account profile,  
**So that** the AI consistently adopts my preferred output format and tone without repeating prompts.

### Acceptance Criteria:
* User settings modal provides text fields for "What would you like the AI to know about you?" and "How would you like the AI to respond?".
* Custom instructions are prepended to the system prompt context on all new conversation threads.
* Toggle switch allows temporary disablement of custom instructions without clearing text.