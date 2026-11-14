# user-flows.md

# User Navigation & Conversion Flows: Project Chronos-Garment
**Author:** Principal UX Architect, Skynet  
**Project Designation:** Project Chronos-Garment  

---

## 1. Flow Overview
These step-by-step flows outline how the primary user (The Trendsetting Consumer) transitions from initial site arrival through immersive cinematic exploration, detailed 3D inspection, and frictionless express checkout, all without breaking the WebGL context.

---

## Flow 1: The Immersive Discovery & Purchase Flow (Primary Conversion Path)
* **Goal:** Guide the user from initial load to completed purchase within the cinematic 3D environment.
* **Personas:** The Trendsetting Consumer (Primary End-User)

```text
[1. Site Arrival]
       │
       ▼
[2. Preloader & Asset Hydration (MVP-06)]
  - Displays animated brand logo and streaming progress bar.
  - Asynchronously loads core GLTF bundles (<5MB) and textures.
       │
       ▼
[3. Audio-Visual Ambience Prompt (MVP-05)]
  - User is presented with a subtle prompt: "Enable Cinematic Soundscape?"
  - Options: [Enable Audio & Enter] | [Mute & Enter]
       │
       ▼
[4. Cinematic Scroll Experience (MVP-01)]
  - User lands on Act I (Hero Atmosphere).
  - User scrolls down; GSAP ScrollTrigger drives camera along the runway path.
  - Volumetric lighting and particle effects shift dynamically (FR-03).
       │
       ▼
[5. Hotspot Encounter (MVP-03)]
  - Camera pauses at Look 02.
  - Contextual UI overlay pulses gently over the garment, displaying Title and Price ($480).
  - User clicks/taps the hotspot.
       │
       ▼
[6. Garment Inspection Mode (MVP-02)]
  - Cinematic scroll locks. Canvas shifts focus to the selected garment.
  - User drags cursor/finger to rotate the model 360 degrees.
  - User pinch-zooms to examine high-res fabric micro-textures.
  - User reviews sizing dropdown and selects "Medium".
       │
       ▼
[7. Add to Express Cart]
  - User clicks [Add to Collection].
  - Visual particle animation flies the item icon into the top-right cart counter.
  - Inspection mode closes; cinematic scroll timeline unlocks.
       │
       ▼
[8. Express Checkout Drawer (MVP-04)]
  - User clicks the Cart Icon in the Global Navigation bar.
  - Slide-over drawer opens from the right, maintaining WebGL context underneath.
  - User reviews order summary.
  - User clicks [Apple Pay] or enters payment details via embedded Stripe form.
       │
       ▼
[9. Order Confirmation State]
  - Inline success state displays Order ID and animated completion checkmark.
  - User clicks [Continue Exploring] to return to the cinematic runway.
```

---

## Flow 2: Accessibility & Reduced Motion Fallback Flow
* **Goal:** Ensure compliance with NFR-03 by providing an uncompromised static experience for users with vestibular disorders, screen readers, or low-end hardware.

```text
[1. Site Arrival]
       │
       ▼
[2. Preloader / System Check]
  - WebGL capability detection runs in the background.
  - OR User explicitly clicks "Reduced Motion / Accessible View" in the preloader or footer.
       │
       ▼
[3. Fallback Layout Activation (NFR-03)]
  - WebGL context initialization is aborted to save CPU/GPU overhead.
  - System renders the *Accessibility Fallback View (4.3)*:
    - High-fashion editorial editorial grid layout.
    - High-contrast typography and static high-res photography of the capsule collection.
       │
       ▼
[4. Static Browsing & Selection]
  - User scrolls normally using standard document scrolling.
  - User clicks product cards to open standard modal image galleries and sizing specifications.
       │
       ▼
[5. Standard Checkout]
  - User adds item to cart and proceeds to standard secure checkout page.
```

---

## Flow 3: Audio & Environmental Control Flow
* **Goal:** Give the user complete agency over the audio-visual atmosphere without disrupting immersion.

```text
[1. Active Cinematic State (Flow 1, Step 4)]
       │
       ▼
[2. User Interacts with Audio Toggle (MVP-05)]
  - User clicks the persistent Speaker Icon in the Global Navigation Bar.
       │
       ├── IF Audio was MUTED:
       │     - Icon transitions to active wave animation.
       │     - Ambient soundtrack fades in over 1.5 seconds.
       │     - Soundtrack synchronizes tempo with current scroll velocity.
       │
       └── IF Audio was PLAYING:
             - Icon transitions to muted slash state.
             - Soundtrack fades out cleanly.
       │
       ▼
[3. Return to Immersion]
  - UI control fades back to semi-transparent state, keeping focus on the 3D scene.
```