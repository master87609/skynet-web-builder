# Skynet Component Specifications: Project Sole-Motion
**Author:** Design System Lead, Skynet  
**Project:** Cinematic Shoe Web Experience (v1 MVP)

---

## 1. Global Navigation & Header (`GlobalHeader.tsx`)
*   **Purpose:** Persistent top-level navigation providing brand orientation, chapter cues, accessibility controls, and quick access to cart state.
*   **Anatomy:**
    *   `1.1 Brand Logo`: SVG text/icon anchored top-left. Triggers window scroll to `0,0` with smooth easing.
    *   `1.2 Chapter Dots / Sticky Indicators`: Horizontal sequence of 5 glowing markers indicating active scroll chapter (`#hero`, `#anatomy`, `#lighting`, `#customizer`, `#checkout`).
    *   `1.3 Utility Cluster`:
        *   Audio Toggle button (Mute/Unmute state with animated equalizer bars).
        *   Reduce Motion Toggle (A11y override switch).
        *   Cart Trigger Button with floating item-count badge (e.g., "0" or "1").
*   **States:**
    *   *Default (Hero):* Transparent backdrop, white typography, subtle border.
    *   *Scrolled:* Frosted glass background (`backdrop-blur-md`, `bg-surface` opacity 85%), border bottom `surface.border`.
    *   *Active Chapter:* Corresponding chapter indicator lights up in `primary` neon cyan with a pulsing drop-shadow.

---

## 2. 3D Scrollytelling Viewport Canvas (`ShoeCanvas.tsx`)
*   **Purpose:** Persistent Three.js / R3F viewport container anchoring the 3D footwear asset, handling lighting shifts, shader modifications, and scroll-linked animation timelines.
*   **Anatomy:**
    *   WebGL Canvas covering 100vw x 100vh, fixed position (`z-index: 0`).
    *   Lighting rig (directional spotlights, ambient rim lights) dynamically controlled by GSAP ScrollTrigger timeline interpolation.
*   **States & Triggers:**
    *   *Chapter 01:* Low-angle cinematic hero spin, cyberpunk neon rim lighting.
    *   *Chapter 02:* Exploded wireframe mesh disassembly (Knit Upper, Carbon Plate, Air Cushion separate along vector axes).
    *   *Chapter 03:* Clean studio white background fade, crisp specular highlights on performance metrics callouts.
    *   *Chapter 04:* Shader material swap triggered by active colorway selection.

---

## 3. Interactive Hotspot Modal (`HotspotModal.tsx`)
*   **Purpose:** Provides deep technical and material breakdowns when users click coordinates on the exploded 3D shoe model.
*   **Anatomy:**
    *   Floating anchor pin positioned in 3D-to-2D projected screen coordinates with a pulsing radar ping animation (`primary` color).
    *   Glassmorphism card (`bg-surface`, `border-surface.border`, `backdrop-blur-lg`).
    *   Headline title (e.g., "Carbon Fiber Plate Architecture"), descriptive body text, technical specs grid (Weight, Durability rating).
    *   Close button (Top right, cross icon) and keyboard Esc listener.
*   **States:**
    *   *Idle:* Pulsing dot anchor.
    *   *Hover:* Scale up 1.1x, border glows cyan.
    *   *Expanded:* Card slides up with spring physics (`framer-motion` or GSAP), pauses scroll scrub until dismissed.

---

## 4. Real-Time Colorway Customizer (`ColorCustomizer.tsx`)
*   **Purpose:** Interactive studio panel allowing users to instantly re-texture the 3D model.
*   **Anatomy:**
    *   Container box pinned to bottom-right or centered during Chapter 04 viewport section.
    *   Swatch Selector UI comprising three interactive circular buttons:
        *   `Cyberpunk Neon` (Cyan `#00F0FF` / Magenta `#FF0055`)
        *   `Stealth Black` (Matte Charcoal `#1A1A1E` / Gloss Black `#0A0A0A`)
        *   `Minimalist White` (Pure Ceramic `#F4F4F6` / Silver `#D1D5DB`)
*   **States:**
    *   *Active Swatch:* Border ring expands to 2px solid `primary`, subtle inner glow.
    *   *Transition State:* 3D material roughness/metalness and diffuse maps lerp smoothly over 600ms.

---

## 5. Slide-Out E-Commerce Checkout Drawer (`CheckoutDrawer.tsx`)
*   **Purpose:** Frictionless, slide-over purchase flow triggered from the cart icon or Chapter 05 pre-order CTA.
*   **Anatomy:**
    *   Off-canvas panel sliding in from the right (`w-full md:w-[480px]`, `bg-background-alt`, full height).
    *   Backdrop overlay (`bg-black/60`, `backdrop-blur-sm`).
    *   Product Summary Header: Thumbnail render, selected colorway name, price ($280).
    *   Size Selector Grid: US / EU sizing buttons (US 7 - US 14).
    *   Express Checkout Buttons: Apple Pay / Google Pay primary action buttons, Stripe secure credit card input accordion.
*   **States:**
    *   *Closed:* `translate-x-full`, `pointer-events-none`.
    *   *Open:* `translate-x-0`, `pointer-events-auto`.
    *   *Success State:* Replaces cart contents with animated checkmark icon, order confirmation number, and estimated delivery date ("Dispatching in 48 Hours").

---

## 6. Accessibility Fallback Experience (`StaticFallbackView.tsx`)
*   **Purpose:** Alternative DOM-based layout rendered automatically if user has OS "Reduce Motion" enabled or manually toggles a11y mode.
*   **Anatomy:**
    *   High-contrast vertical stack bypassing Three.js initialization and GSAP pin timelines.
    *   High-resolution WebP image sequence slider showcasing product angles.
    *   Clean typography blocks containing all narrative chapter data and direct purchase triggers.
*   **States:**
    *   Active only when `prefers-reduced-motion: reduce` or global state flag is `true`.