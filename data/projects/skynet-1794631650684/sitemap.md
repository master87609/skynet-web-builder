# Skynet Information Architecture: Apple Cinematic Experience

## 1. Document Control & Overview
*   **System:** Skynet UX Architecture Engine
*   **Project:** Apple Cinematic Experience (v1 MVP Scope)
*   **Purpose:** Establish a rigorous hierarchical sitemap supporting high-fidelity WebGL storytelling, interactive 3D inspection, accessible fallbacks, and seamless transactional conversion.

---

## 2. Global Navigation Framework

```
[Global Header / Floating Dynamic Chrome]
 ├── Logo (Apple Monolith - Home Trigger)
 ├── Core Cinematic Navigation (Flagship Narrative, 3D Inspector, Ecosystem)
 ├── Utility Cluster (Spatial Audio Toggle [Post-v1], Reduced Motion Indicator, Search/Command Center)
 └── Bag / Transactional Gateway (Minimalist Slide-over Modal Trigger)
```

---

## 3. Complete Hierarchical Sitemap (v1 MVP + Roadmap Context)

### Level 1: `/` (Root / Cinematic Flagship Experience)
*   **Purpose:** The primary scroll-driven narrative canvas showcasing the flagship product (v1: iPhone Pro / Apple Silicon).
*   **Sitemap ID:** `ROOT-01`
*   **Level 2 Nodes:**
    *   `ROOT-01.1` **Hero Sequence (`/hero`)**
        *   *Description:* Initial view-port capture. Full-screen 3D model emergence with dynamic PBR lighting.
        *   *States:* Active WebGL 3D Model | Reduced Motion Photo/Typography Stack (`/hero?mode=static`).
    *   `ROOT-01.2` **Cinematic Scroll Engine (`/story`)**
        *   *Description:* Scrubbable timeline orchestrating hardware component disassembly and assembly.
        *   *Sub-sections:*
            *   `ROOT-01.2.1` Silicon Core Architecture (`/story/silicon`)
            *   `ROOT-01.2.2` Thermal & Structural Engineering (`/story/structure`)
            *   `ROOT-01.2.3` Optical Matrix & Sensor Array (`/story/optics`)
    *   `ROOT-01.3` **Macro-Detail Hotspots (`/inspect`)**
        *   *Description:* Interactive spatial markers triggering camera dollies into specific architectural finishes (e.g., Titanium frame grain).
    *   `ROOT-01.4` **Climax & Transactional Gateway (`/configure`)**
        *   *Description:* Seamless transition from narrative conclusion to configuration/purchase modal.

### Level 2: `/inspector` (Dedicated 3D Product Inspector)
*   **Purpose:** Sandbox environment for freeform rotation, zoom, material inspection, and color variant switching.
*   **Sitemap ID:** `INSP-02`
*   **Level 2 Nodes:**
    *   `INSP-02.1` **Material & Finish Matrix (`/inspector/finishes`)**
        *   *Description:* Real-time switching of PBR surface reflections and colorways (Natural, Blue, White, Black Titanium).
    *   `INSP-02.2` **Exploded View Toggle (`/inspector/exploded`)**
        *   *Description:* Manual slider controlling mechanical separation of internal components.

### Level 3: `/bag` (Transactional Gateway / Slide-Over Modal)
*   **Purpose:** Non-disruptive, minimalist configuration and checkout flow maintaining spatial continuity.
*   **Sitemap ID:** `BAG-03`
*   **Level 3 Nodes:**
    *   `BAG-03.1` **Product Configurator (`/bag/configure`)**
        *   *Description:* Selection of storage capacity, finish, and connectivity options with dynamic pricing updates.
    *   `BAG-03.2` **Order Summary (`/bag/summary`)**
        *   *Description:* Review of selected configuration, trade-in options, and delivery estimates.
    *   `BAG-03.3` **Express Checkout (`/bag/checkout`)**
        *   *Description:* Apple Pay and secure payment gateway integration.

### Level 4: `/accessibility` (System Preferences & Fallback Control)
*   **Purpose:** Explicit user overrides for motion, high-contrast, and performance scaling.
*   **Sitemap ID:** `ACC-04`
*   **Level 4 Nodes:**
    *   `ACC-04.1` **Motion Settings (`/accessibility/motion`)**
        *   *Description:* Toggle between Cinematic Motion Engine and Reduced Motion Editorial Layout.
    *   `ACC-04.2` **Performance Profiler (`/accessibility/performance`)**
        *   *Description:* Manual LOD (Level of Detail) tier override (High Fidelity 60fps vs. Power Saver 30fps).

---

## 4. Edge & Utility Routes

*   `/sitemap` — Structural directory for search indexers and accessibility navigation.
*   `/legal` — Regulatory, privacy, and compliance documentation (minimalist typographic layout).