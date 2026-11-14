# sitemap.md

# Skynet Information Architecture & Sitemap: Project Sole-Motion
**Author:** Principal UX Architect, Skynet  
**Project:** Cinematic Shoe Web Experience (v1 MVP)

---

## 1. Structural Overview
Project Sole-Motion is designed as a high-end, single-page immersive web application (SPA) built around a continuous vertical scrollytelling timeline. While navigation appears multi-page or chapter-based to the user, the architecture utilizes a single primary viewport shell that dynamically swaps 3D scenes, lighting states, and UI overlays in response to GSAP ScrollTrigger position.

---

## 2. Complete Sitemap Hierarchy

```text
Root: / (Index - Cinematic Experience)
│
├── 1.0 Global Header & Persistent Navigation
│   ├── 1.1 Brand Logo / Home Trigger (Scroll to Top)
│   ├── 1.2 Chapter Navigation Indicators (Progression Dots / Sticky Labels)
│   ├── 1.3 Audio Toggle (Mute / Unmute Ambient Soundscape - Post-v1 prep)
│   ├── 1.4 Accessibility / "Reduce Motion" Toggle (NFR-04)
│   └── 1.5 Cart Drawer Trigger (Badge with item count)
│
├── 2.0 Main Scrollytelling Narrative Flow (Single-Page Chapters)
│   ├── 2.1 Chapter 01: Hero / Introduction (The Awakening)
│   │   ├── 2.1.1 Cinematic Title & Subtitle ("Apex-01: Engineered for Motion")
│   │   ├── 2.1.2 Primary CTA ("Scroll to Discover" / "Enter Experience")
│   │   └── 2.1.3 Initial 3D Canvas Load (Default Cyberpunk Neon Colorway)
│   │
│   ├── 2.2 Chapter 02: Material Anatomy (The Core)
│   │   ├── 2.2.1 Exploded View Transition (3-Stage Disassembly)
│   │   ├── 2.2.2 Hotspot 01 Modal: Knit Upper Technology
│   │   ├── 2.2.3 Hotspot 02 Modal: Carbon Fiber Plate Architecture
│   │   └── 2.2.4 Hotspot 03 Modal: Proprietary Air Cushion System
│   │
│   ├── 2.3 Chapter 03: Performance & Lighting (The Environment)
│   │   ├── 2.3.1 Dynamic Lighting Shift (Urban Dark to Clean Studio)
│   │   └── 2.3.2 Kinetic Typography Performance Metrics Callouts ("Weight: 210g", "Energy Return: 89%")
│   │
│   ├── 2.4 Chapter 04: Colorway Customizer (The Studio)
│   │   ├── 2.4.1 Real-Time Swatch Selector UI
│   │   │   ├── 2.4.1.1 Cyberpunk Neon (Default)
│   │   │   ├── 2.4.1.2 Stealth Black
│   │   │   └── 2.4.1.3 Minimalist White
│   │   └── 2.4.2 3D Material Shader Update Handler
│   │
│   └── 2.5 Chapter 05: Conversion / Checkout Hub (The Finale)
│       ├── 2.5.1 Product Summary Card (Selected Colorway, Size Selector)
│       └── 2.5.2 Direct Purchase Trigger ("Pre-Order Now - $280")
│
├── 3.0 Slide-Out E-Commerce Drawer (Overlay)
│   ├── 3.1 Cart Summary & Selected Configuration Review
│   ├── 3.2 Size & Fit Selector (US / EU sizing)
│   ├── 3.3 Express Checkout Integration (Apple Pay / Google Pay / Stripe)
│   └── 3.4 Order Confirmation / Success State View
│
├── 4.0 Modal Overlays (Utility & Legal)
│   ├── 4.1 Size Guide Modal
│   ├── 4.2 Shipping & Returns Information Modal
│   ├── 4.3 Terms of Service / Privacy Policy
│   └── 4.4 Fallback / Static Experience Modal (Triggered via "Reduce Motion")
│
└── 5.0 Future Expansion Placeholders (v2 Architecture - Hidden in v1)
    ├── 5.1 Multi-Model Catalog View (/catalog)
    └── 5.2 Augmented Reality ("View in Your Room") Mobile WebXR Launcher
```

---

## 3. Navigation & Layout Architecture Notes
* **State Management:** The URL remains at `/` during standard scrolling, updating with hash fragments (`/#anatomy`, `/#customizer`, `/#checkout`) on chapter snaps to support deep-linking and browser history.
* **Scroll-Jacking vs. Natural Momentum:** To balance cinematic pacing with usability, GSAP ScrollTrigger pins the viewport during complex 3D transitions (Exploded View, Chapter 2), then releases normal vertical scrolling between chapters.

---