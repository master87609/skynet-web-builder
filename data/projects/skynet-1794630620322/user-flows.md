# User Flows & Conversion Paths: Professional Portfolio Website
**Principal UX Architect, Skynet**

This document maps out the core user journeys for our two primary personas: **The Technical Recruiter / Hiring Manager (Persona A)** and **The Potential Client / Collaborator (Persona B)**.

---

## Flow 1: The Fast-Track Recruiter Journey (Persona A)
*Goal: Locate skills, review a project, grab the resume, and reach out within 60 seconds.*

```text
[Landing: User arrives at Home / #hero]
       │
       ├─► [Action 1: Scan Hero] ──► Reads headline & tech stack tags.
       │
       ├─► [Action 2: Jump to Experience / Skills]
       │         │
       │         └──► Clicks "Experience" in Header ──► Smooth scrolls to #experience.
       │                   │
       │                   └──► Scans Skills Matrix & Work Timeline to verify tech match.
       │
       ├─► [Action 3: Inspect Project Proof]
       │         │
       │         └──► Clicks "Projects" in Header (or scrolls to #projects).
       │                   │
       │                   └──► Evaluates Project Card ──► Clicks "Live Demo" or "GitHub".
       │
       ├─► [Action 4: Access Resume (Critical Conversion Point)]
       │         │
       │         └──► Clicks "Resume" in Header or CV Section.
       │                   │
       │                   ├──► Option A: Previews PDF in-browser.
       │                   └──► Option B: Clicks "Download PDF" ──► Saves file locally.
       │
       └─► [Action 5: Direct Outreach]
                 │
                 └──► Clicks "Contact Me" ──► Scrolls to #contact.
                           │
                           └──► Fills out Contact Form ──► Success State Triggered.
```

---

## Flow 2: The Client / Collaborator Journey (Persona B)
*Goal: Evaluate past deliverables, review depth of expertise, and submit a project inquiry.*

```text
[Landing: User arrives at Home / #hero]
       │
       ├─► [Action 1: Explore Project Showcase (#projects)]
       │         │
       │         ├──► Filters projects by category (e.g., "Web App").
       │         └──► Clicks project thumbnail/links to examine technical execution.
       │
       ├─► [Action 2: Validate Authority & Background (#about)]
       │         │
       │         └──► Scrolls to About & Experience section.
       │                   │
       │                   └──► Reviews past professional history and domain expertise.
       │
       ├─► [Action 3: Initiate Project Inquiry (#contact)]
       │         │
       │         └──► Scrolls to Contact Section (#contact).
       │                   │
       │                   ├──► Fills Name, Business Email, Subject, and Project Details.
       │                   ├──► Client-side validation runs (checks email format, required fields).
       │                   └──► Passes Honeypot spam check.
       │
       └─► [Action 4: Form Submission & Confirmation]
                 │
                 ├──► Clicks "Send Message" ──► Loading state activates.
                 ├──► API successfully transmits data.
                 └──► Success Banner renders: *"Thank you! Your message has been sent. I will get back to you within 24 hours."*
```

---

## Flow 3: Theme Toggle Interaction Flow (NFR / FR-06)
*Goal: Seamlessly switch between light and dark visual presentation.*

```text
[User views site in default state (matches system preference via localStorage)]
       │
       └─► [User clicks Theme Switcher Icon in Header]
                 │
                 ├──► System toggles root CSS class (e.g., `dark` class added/removed).
                 ├──► UI transitions colors with smooth CSS transition ($\le 200\text{ms}$).
                 └──► Preference is saved to browser `localStorage` for future visits.
```