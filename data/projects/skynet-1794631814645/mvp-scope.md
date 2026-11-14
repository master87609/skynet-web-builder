# mvp-scope.md

# Skynet MVP Scope: Project Sole-Motion

This document defines the strict feature boundaries for the Version 1 (v1) release versus future expansion phases, ensuring alignment with the performance budget and timeline constraints.

---

## 1. Version 1 (v1) Release Scope (The MVP)
The v1 release focuses entirely on delivering a flawless, high-performance cinematic scrollytelling experience for a **single flagship shoe model** with core e-commerce capabilities.

### Functional Requirements (v1)
*   **FR-01 (Cinematic 3D Scroll):** GSAP ScrollTrigger integration driving a single Three.js / R3F shoe model through rotation, scaling, and a 3-stage exploded parts view.
*   **FR-02 (Ambient Lighting):** Static, pre-baked environment maps and smooth programmatic lighting shifts across scroll chapters (urban dark to clean studio).
*   **FR-03 (Interactive Hotspots):** Up to 3 clickable HTML-anchored hotspots on the 3D model opening modal text overlays for material inspection (Knit Upper, Cushion Tech, Carbon Plate).
*   **FR-04 (Kinetic Typography):** CSS/GSAP-driven text scaling, fading, and tracking synchronized to the vertical scroll timeline.
*   **FR-05 (Colorway Customizer):** Real-time switching between 3 curated colorways (e.g., Cyberpunk Neon, Stealth Black, Minimalist White) updating material shaders instantly.
*   **FR-06 (Express Checkout):** Slide-out checkout drawer with Stripe and Apple Pay integration for instant 1-click purchasing.
*   **NFR-04 (Accessibility Fallback):** "Reduce Motion" toggle that swaps the 3D scroll-canvas for a static, accessible high-res WebP image sequence presentation.

---

## 2. Future Expansion (Post-v1 Roadmap)
Features deferred to v2 or later iterations to protect initial performance budgets and time-to-market.

### Phase 2: Enhanced Interactivity & Audio
*   **FR-04 Extension (Soundscape):** Fully reactive web-audio synthesizer and spatial sound effects tied directly to scroll velocity and click events.
*   **Advanced AR (Augmented Reality):** "View in Your Room" / WebXR mobile AR placement allowing users to project the 3D shoe onto their physical environment via phone camera.

### Phase 3: Catalog & Personalization
*   **Multi-Model Catalog:** Expanding the engine to support an entire seasonal collection of multiple shoe silhouettes.
*   **Advanced Customizer:** Deep customization suite allowing users to mix and match individual panel colors, laces, and outsole materials independently.
*   **User Accounts & Wishlists:** Persistent user profiles for saving custom colorway builds, tracking pre-orders, and loyalty reward integration.