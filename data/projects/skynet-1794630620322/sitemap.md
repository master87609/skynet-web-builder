# Sitemap & Information Architecture: Professional Portfolio Website
**Principal UX Architect, Skynet**

## 1. Architectural Overview & Principles
The site is structured as a high-conversion, single-page application (SPA) with smooth anchor-link scrolling for frictionless exploration, complemented by auxiliary modals and dedicated views where required (e.g., Resume Preview). 

* **Depth Level:** Maximum 2 levels deep (Home -> Project Detail / Resume Viewer).
* **Scanability:** Designed specifically for Technical Recruiters (Persona A) to find key attributes—Skills, Projects, Resume, and Contact—within 30 seconds.
* **Global Elements:** Persistent Header (Navigation + Theme Toggle) and Persistent Footer (Social links, Copyright, Back-to-Top).

---

## 2. Hierarchical Sitemap (`sitemap.md`)

```text
Root (Home /)
│
├── 1. Header (Global Navigation Bar)
│   ├── Logo / Brand (Anchor: #hero)
│   ├── Nav Links
│   │   ├── About (Anchor: #about)
│   │   ├── Projects (Anchor: #projects)
│   │   ├── Experience & Skills (Anchor: #experience)
│   │   └── Contact (Anchor: #contact)
│   ├── Resume Quick CTA (Triggers /resume-modal or direct download)
│   └── Theme Switcher (Light / Dark Mode Toggle)
│
├── 2. Hero Section (#hero) [FR-01]
│   ├── Professional Avatar / Photo
│   ├── Dynamic Headline & Short Bio
│   ├── Primary CTA: "View Projects" (Scrolls to #projects)
│   └── Secondary CTA: "Contact Me" (Scrolls to #contact)
│
├── 3. About & Skills Matrix Section (#about / #experience) [FR-03]
│   ├── Professional Summary / Background
│   ├── Categorized Skills Matrix
│   │   ├── Languages (e.g., TypeScript, Python, SQL)
│   │   ├── Frameworks & Libraries (e.g., React, Next.js, Tailwind)
│   │   └── Tools & Infrastructure (e.g., Git, Docker, AWS)
│   └── Professional Experience Timeline (Work History)
│
├── 4. Interactive Project Showcase (#projects) [FR-02]
│   ├── Category Filter Tabs (All, Web App, Mobile, Open Source)
│   ├── Project Card Grid
│   │   ├── Project Card 1 (Title, Thumbnail, Description, Tech Tags, Live Demo Link, GitHub Link)
│   │   ├── Project Card 2 (...)
│   │   └── Project Card n (...)
│   └── [v2 Roadmap] Project Deep-Dive Modal / Sub-page (/projects/[slug])
│
├── 5. Resume / CV Section (#resume) [FR-05]
│   ├── In-Browser PDF Preview Container
│   └── One-Click Secure Download Button (PDF)
│
├── 6. Functional Contact Section (#contact) [FR-04]
│   ├── Section Intro / Direct Email Link
│   ├── Interactive Contact Form
│   │   ├── Name Input
│   │   ├── Email Input
│   │   ├── Subject Input
│   │   ├── Message Textarea
│   │   ├── Spam Prevention (Honeypot / CAPTCHA)
│   │   └── Submit Button ("Send Message")
│   └── Form Feedback States (Validation Errors, Success State, Loading Spinner)
│
└── 7. Footer (Global)
    ├── Social Media Links (GitHub, LinkedIn, Twitter/X, etc.)
    ├── Copyright & Built with Skynet Attribution
    └── Back-to-Top Anchor Link
```