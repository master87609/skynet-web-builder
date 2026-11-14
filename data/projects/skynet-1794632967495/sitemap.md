# sitemap.md

# Information Architecture & Sitemap: Project Chronos-Garment
**Author:** Principal UX Architect, Skynet  
**Project Designation:** Project Chronos-Garment  

---

## 1. Architecture Philosophy
Project Chronos-Garment abandons traditional multi-tiered e-commerce hierarchies in favor of an immersive, linear, spatial narrative. The primary architecture relies on a **Single-Page Application (SPA) with Scroll-Driven Contextual Zoning**. 

All primary product exploration happens within a continuous WebGL canvas. Traditional sub-pages are minimized to reduce layout shifts, preserve WebGL context state, and maintain cinematic pacing.

---

## 2. Complete Hierarchical Sitemap

```text
Root / (Home / Cinematic Runway)
│
├── 1.0 Preloader & Initialization Overlay (MVP-06)
│   ├── 1.1 Brand Intro & Asset Loading Progress Bar
│   └── 1.2 Audio/Visual Ambience Initializer Prompt (Opt-in/Mute) (MVP-05)
│
├── 2.0 Primary Cinematic Experience (SPA Canvas) (MVP-01)
│   ├── 2.1 Act I: The Awakening (Hero / Atmosphere & Volumetric Lighting) (FR-03)
│   ├── 2.2 Act II: The Runway Descent (Scroll-jacked Camera Path & Garment Timeline)
│   │   ├── 2.2.1 Look 01 (Contextual 3D Hotspot -> Triggers Quick View) (MVP-03)
│   │   ├── 2.2.2 Look 02 (Contextual 3D Hotspot -> Triggers Quick View) (MVP-03)
│   │   ├── 2.2.3 Look 03 (Contextual 3D Hotspot -> Triggers Quick View) (MVP-03)
│   │   └── 2.2.4 Look 04 (Contextual 3D Hotspot -> Triggers Quick View) (MVP-03)
│   └── 2.3 Act III: Epilogue / Brand Manifesto & Footer
│
├── 3.0 Interactive Garment Inspection Mode (Modal / Focus State) (MVP-02)
│   ├── 3.1 360-Degree Spatial Rotation & Zoom Controller
│   ├── 3.2 Material & Texture High-Resolution Detail Viewer
│   └── 3.3 Product Specification Panel (Fabric Composition, Designer Notes)
│
├── 4.0 Overlay & Utility Systems (Non-Destructive UI Layer)
│   ├── 4.1 Global Navigation Bar
│   │   ├── 4.1.1 Brand Logo (Scroll-to-Top / Reset View)
│   │   ├── 4.1.2 Soundscape Toggle (Mute / Unmute) (MVP-05)
│   │   ├── 4.1.3 Accessibility / Reduced Motion Toggle (NFR-03)
│   │   └── 4.1.4 Cart Trigger (Badge Count Indicator)
│   ├── 4.2 Express Checkout Drawer (Slide-Over Panel) (MVP-04)
│   │   ├── 4.2.1 Cart Item Review (Size, Colorway, Quantity)
│   │   ├── 4.2.2 Subtotal & Shipping Calculator
│   │   └── 4.2.3 Express Payment Gateway Integration (Apple Pay / Stripe)
│   └── 4.3 Accessibility Fallback View (NFR-03)
│       └── 4.3.1 Static High-Fashion Editorial Catalog (For Reduced Motion / Non-WebGL Users)
│
└── 5.0 Legal & Informational Modals (Footer Links)
    ├── 5.1 Privacy Policy
    ├── 5.2 Terms of Service
    └── 5.3 Customer Support & Contact
```

---

## 3. Navigation & Spatial Zoning Rules

* **Persistent Chrome:** The Global Navigation Bar (4.1) floats above the WebGL canvas with high z-index styling, ensuring critical utilities (Audio, Accessibility, Cart, Logo) remain accessible regardless of scroll position.
* **Context Preservation:** Entering the *3D Inspection Mode (3.0)* or opening the *Express Checkout Drawer (4.2)* pauses the GSAP scroll-timeline and disables background raycasting to prevent accidental camera movement, ensuring user focus is retained.
* **Graceful Degradation Route:** If WebGL initialization fails or if the user activates *Reduced Motion* (NFR-03), the site automatically bypasses the 3D Cinematic Scroll Engine (2.0) and routes the user directly to the *Accessibility Fallback View (4.3)*.

---