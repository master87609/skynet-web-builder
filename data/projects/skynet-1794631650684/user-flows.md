# Skynet User Flows: Apple Cinematic Experience

## 1. Document Control & Overview
*   **System:** Skynet UX Architecture Engine
*   **Project:** Apple Cinematic Experience (v1 MVP Scope)
*   **Purpose:** Detail step-by-step navigation, conversion, and fallback flows for the two core personas: Alex (The Design Aficionado) and Sarah (The Enterprise Decision Maker).

---

## 2. Flow A: The Cinematic Immersion & Direct Conversion Flow
*   **Persona:** Alex (Design Aficionado) / Primary Consumer
*   **Objective:** Experience the 3D scroll-driven narrative, inspect material mastery, and transition seamlessly into the purchase gateway.

```
[1. Landing (/)] 
      │
      ▼ (Auto-detect WebGL & High-Performance GPU)
[2. Hero Sequence (/hero)] 
      │
      ├─► [User scrolls downward] ──► [3. Cinematic Scroll Engine (/story)]
      │                                       │
      │                                       ├─► [Triggers component disassembly animation (FR-01)]
      │                                       │
      │                                       ▼
      │                               [4. Macro Hotspots Encountered (/inspect)]
      │                                       │
      │                                       ├─► [User clicks spatial marker (FR-05)] 
      │                                       │       │
      │                                       │       ▼
      │                                       │   [Camera Dollies to Macro Detail View]
      │                                       │       │
      │                                       │       └─► [Returns to Scroll Timeline]
      │                                       │
      │                                       ▼
      │                               [5. Narrative Climax Reached]
      │                                       │
      ▼ (Alternative: Direct Tab Click)       ▼
[Free Inspector (/inspector)] ──────► [6. Transactional Gateway Trigger (/configure)]
                                              │
                                              ▼ (Slide-over modal opens without spatial break)
                                      [7. Product Configurator (/bag/configure)]
                                              │
                                              ▼
                                      [8. Express Checkout Completion (/bag/checkout)]
```

### Step-by-Step Breakdown:
1.  **Landing (`/`):** User arrives. Edge CDN delivers compressed glTF asset. WebGL context initializes within 300ms.
2.  **Hero Sequence (`/hero`):** 3D flagship model floats in zero-gravity PBR lighting, responding smoothly to cursor gyroscope movement.
3.  **Cinematic Scroll Engine (`/story`):** As the user scrolls, custom physics controllers normalize momentum. The phone chassis seamlessly disassembles, revealing the silicon die and titanium frame.
4.  **Macro Hotspots (`/inspect`):** User clicks the titanium frame marker. The camera executes a cinematic dolly into the micro-texture, displaying architectural specs in a featherlight glassmorphism badge.
5.  **Narrative Climax & Gateway (`/configure`):** Scroll timeline concludes. A minimalist "Experience the Power" CTA dissolves into the purchase gateway.
6.  **Transactional Modal (`/bag/configure`):** The 3D model docks into a compact configurator tray on the side of the screen. User selects finish and storage; pricing updates instantly.
7.  **Checkout (`/bag/checkout`):** Apple Pay authentication completes the conversion funnel in under 3 clicks.

---

## 3. Flow B: Enterprise Evaluation & Performance Fallback Flow
*   **Persona:** Sarah (Enterprise Decision Maker / CTO)
*   **Objective:** Rapidly evaluate high-level hardware/software integration and architecture specifications under a strict performance or accessibility constraint.

```
[1. Landing (/)] 
      │
      ▼ (System detects prefers-reduced-motion: reduce OR Low-Power Device)
[2. Fallback Mode Activation (/hero?mode=static)]
      │
      ├─► [Bypasses WebGL Scroll-Jacking / 3D Assembly]
      │
      ▼
[3. Editorial Typography & High-Res Photography Layout]
      │
      ├─► [User scans high-level enterprise metrics & silicon efficiency]
      │
      ▼
[4. Direct Navigation to Technical Specifications (/story/silicon)]
      │
      ▼
[5. Enterprise Bulk Configuration & Deployment Gateway (/bag/configure)]
```

### Step-by-Step Breakdown:
1.  **Landing (`/`):** System evaluates client-side rendering capabilities and OS accessibility flags (`prefers-reduced-motion`).
2.  **Fallback Mode Activation:** WebGL heavy rendering is suppressed. The system instantiates NFR-02 compliance mode: high-resolution parallax photography and editorial typography.
3.  **Editorial Scanning:** Sarah scrolls through crisp, static architectural breakdowns, immediately absorbing processing power, thermal efficiency, and security enclave data without visual motion fatigue.
4.  **Technical Deep Dive (`/story/silicon`):** Direct jump to Apple Silicon architecture specs via anchor navigation.
5.  **Enterprise Gateway (`/bag/configure`):** Sarah accesses the minimalist configuration modal to evaluate volume deployment options and enterprise support tiers.