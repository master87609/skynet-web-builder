# Skynet Component Specifications: Apple Cinematic Experience

## 1. Document Control & Overview
*   **System:** Skynet UX Architecture Engine
*   **Project:** Apple Cinematic Experience (v1 MVP Scope)
*   **Purpose:** Provide comprehensive engineering and design specifications for core UI components supporting high-fidelity WebGL storytelling, accessible fallbacks, and seamless e-commerce conversion.

---

## 2. Global Navigation & Chrome Components

### 2.1 Dynamic Floating Header (`GlobalHeader`)
*   **Purpose:** Minimalist glassmorphic navigation bar that persists across the viewport, adjusting its chromatic profile based on background luminance (FR-04).
*   **Anatomy:**
    *   `Apple Monolith Logo` (`ROOT-01`): SVG vector, triggers smooth scroll-to-top and resets viewport state.
    *   `Cinematic Nav Links`: Flagship (`/`), 3D Inspector (`/inspector`), Ecosystem (`/story`).
    *   `Utility Cluster`: Spatial Audio toggle, Reduced Motion indicator (`/accessibility`), Search command center.
    *   `Bag Gateway Trigger` (`BAG-03`): Minimalist icon with real-time item counter badge.
*   **States:**
    *   *Default/Idle:* Translucent surface (`rgba(255,255,255,0.05)`), blur 20px, thin border (`rgba(255,255,255,0.1)`).
    *   *Scrolled:* Solidifies background to `rgba(10,10,12,0.85)` with enhanced drop shadow.
    *   *Hover/Focus:* Scale transform `1.02`, text color shifts from `#86868B` to `#F5F5F7`.

### 2.2 Slide-Over Transactional Modal (`BagModal`)
*   **Purpose:** Non-disruptive configuration and checkout gateway (`BAG-03`) maintaining spatial continuity with the 3D viewport.
*   **Anatomy:**
    *   Backdrop scrim (`rgba(0,0,0,0.6)` with backdrop blur).
    *   Slide-over container (anchored right, width 480px on desktop, 100% on mobile).
    *   Docked 3D Model Miniature view (`BAG-03.1`).
    *   Interactive Configuration Matrix (Storage, Finish selector pills).
    *   Express Checkout Apple Pay primary CTA (`BAG-03.3`).
*   **States:**
    *   *Entering:* Spring physics animation (`stiffness: 300, damping: 30`), sliding from right.
    *   *Updating Price:* Subtle pulse animation (`scale: 1.02`) on currency readout during configuration changes.

---

## 3. Cinematic & WebGL Storytelling Components

### 3.1 WebGL Hero Canvas (`HeroCanvas`)
*   **Purpose:** Initial viewport capture (`ROOT-01.1`) displaying the flagship product with real-time PBR lighting and gyroscope reactivity.
*   **Anatomy:**
    *   Three.js WebGL context container.
    *   Progressive loading skeleton with Lottie asset fallback.
    *   Dynamic lighting rig (Key light, Rim light, Ambient bounce).
*   **States:**
    *   *Loading:* Circular progress indicator with Apple minimalist typography ("Loading Experience...").
    *   *Active:* Responsive to mouse/touch coordinates (max tilt angle ±5 degrees).
    *   *Fallback Mode (`ACC-04.1`):* Suppresses WebGL canvas; renders high-res parallax photo stack with editorial typography.

### 3.2 Macro-Detail Hotspot Badge (`InspectionHotspot`)
*   **Purpose:** Spatial marker (`ROOT-01.3`, `FR-05`) overlaying the 3D model to trigger cinematic camera dollies.
*   **Anatomy:**
    *   Pulsing outer ring (`accent` color, animate scale `1.0 -> 1.5`, opacity `1 -> 0`).
    *   Solid center anchor point.
    *   Glassmorphic detail tooltip (displays on hover/click).
*   **States:**
    *   *Idle:* Subtle pulse at 1.5s interval.
    *   *Hover:* Expands tooltip card showing architectural specifications (e.g., "Grade 5 Titanium Alloy").
    *   *Active:* Triggers camera tween event, locking perspective onto micro-texture.

---

## 4. Interactive Sandbox Components

### 4.1 Finish & Material Matrix (`FinishSelector`)
*   **Purpose:** Real-time PBR surface reflection and colorway switcher (`INSP-02.1`).
*   **Anatomy:**
    *   Horizontal stack of circular color/material swatches (Natural Titanium, Blue Titanium, White Titanium, Black Titanium).
    *   Active indicator ring.
*   **States:**
    *   *Selected:* Ring scales to 1.1x, border highlights in `accent` color `#2997FF`.
    *   *Transition:* Cross-fade material shader uniform update over 400ms duration.

### 4.2 Exploded View Slider (`ExplodedViewSlider`)
*   **Purpose:** Manual control (`INSP-02.2`) for mechanical separation of internal hardware components.
*   **Anatomy:**
    *   Minimalist vertical/horizontal track with thumb indicator.
    *   Dynamic metric readout (e.g., "Component Separation: 45%").
*   **States:**
    *   *Dragging:* Thumb scales up 1.2x; timeline interpolates between assembled state ($t=0.0$) and fully exploded state ($t=1.0$).

---

## 5. Accessibility & System Preferences Components

### 5.1 Motion & Performance Profiler Drawer (`AccessibilityModal`)
*   **Purpose:** Dedicated user override panel (`ACC-04`) for motion sensitivity and performance scaling.
*   **Anatomy:**
    *   Toggle Switch: Cinematic Motion Engine vs. Reduced Motion Editorial Layout (`ACC-04.1`).
    *   Segmented Control: Performance Tier Override (`ACC-04.2`) — High Fidelity (60fps) vs. Power Saver (30fps).
*   **States:**
    *   *Toggled:* Immediate DOM re-hydration and WebGL context destruction/preservation based on user preference.