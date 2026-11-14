# Component Specifications: Project Chronos-Garment
**Author:** Design System Lead, Skynet  
**Project Designation:** Project Chronos-Garment  

---

## 1. Global Navigation Bar (`Navigation.tsx`)
* **Purpose:** Floating high-z-index chrome providing persistent access to core utilities (Brand, Audio, Accessibility, Cart) without obscuring the WebGL viewport.
* **Anatomy & States:**
  * **Brand Logo:** Left-aligned minimalist typography (`CHRONOS`). Clicking resets the WebGL camera to Act I (Hero).
  * **Soundscape Toggle (MVP-05):** Center-left minimalist icon button toggling audio state with subtle expanding sound-wave ripples when active.
  * **Accessibility Toggle (NFR-03):** Center-right icon button instantly swapping the WebGL canvas for the static editorial grid.
  * **Cart Trigger:** Right-aligned pill button displaying dynamic item count badge (e.g., `BAG [01]`).
* **Interactions & Styling:**
  * Background: Frosted glass effect (`backdrop-blur-md bg-background/40 border border-border/50`).
  * Hover / Focus: Smooth scaling transition (`scale-105`), subtle gold accent text glow (`text-accent`).

---

## 2. 3D Hotspot Overlay (`HotspotOverlay.tsx`)
* **Purpose:** Contextual, non-intrusive UI anchor attached to 3D spatial coordinates on garments during the runway scroll sequence (FR-04).
* **Anatomy & States:**
  * **Pulse Indicator:** Concentric pulsating ring (`bg-accent/30 animate-ping`) centered on the garment's anchor point.
  * **Data Pill:** Minimalist dark glass card displaying Garment Title (`LOOK 02: VELVET DRAPE TRENCH`), Price (`$480`), and an interactive action prompt (`EXPLORE`).
* **Interactions & Styling:**
  * Position: Screen-space projection calculated via Three.js vector projection from 3D world coordinates.
  * Hover: Card expands smoothly to reveal quick-add option; cursor transforms to custom luxury pointer reticle.

---

## 3. Garment Inspection Modal / Viewport (`InspectionModal.tsx`)
* **Purpose:** Focused 360-degree interactive 3D examination mode triggered when a user interacts with a hotspot (MVP-02).
* **Anatomy & States:**
  * **Viewport Canvas:** Full-screen isolated WebGL render target with high-intensity studio rim lighting.
  * **Control HUD:** Floating bottom bar featuring 360-degree rotation drag instruction, zoom indicators, and high-res material texture toggle.
  * **Specification Panel:** Right-hand slide-in panel showing Designer Notes, Fabric Composition (e.g., *100% Japanese Technical Silk*), Sizing Selector (Dropdown), and [ADD TO COLLECTION] CTA button.
  * **Close Control:** Top-right minimalist `[×]` button to unlock scroll timeline and return to the cinematic descent.
* **Interactions & Styling:**
  * Enters via a cinematic camera lerp and background blur (`backdrop-blur-xl bg-background/90`).
  * Sizing selector uses clean typographic pills with gold border outline upon selection.

---

## 4. Express Checkout Drawer (`CheckoutDrawer.tsx`)
* **Purpose:** Slide-over panel enabling frictionless order completion without losing WebGL context (MVP-04).
* **Anatomy & States:**
  * **Header:** "YOUR SELECTION" title alongside item count and close button.
  * **Item Review List:** Vertical scrollable list of added garments with thumbnail preview, selected size/colorway, quantity stepper, and price.
  * **Subtotal & Shipping Calculator:** Transparent calculation summary displaying free global express shipping indicator.
  * **Payment Integration:** One-click express payment buttons (`Apple Pay`, `Stripe Instant Checkout`) alongside secure manual card entry fallback.
* **Interactions & Styling:**
  * Slides in smoothly from the right (`transform transition-transform duration-500 ease-out`).
  * Backdrop darkens significantly (`bg-background/80 backdrop-blur-md`) to isolate attention.

---

## 5. Accessibility Fallback Catalog (`FallbackCatalog.tsx`)
* **Purpose:** High-fashion static editorial grid for users with reduced motion preferences or unsupported WebGL environments (NFR-03).
* **Anatomy & States:**
  * **Editorial Header:** Stark, high-contrast typography banner introducing the capsule collection.
  * **Product Grid:** Asymmetric 2-column editorial layout featuring high-resolution photography, grain textures, and direct add-to-cart buttons.
  * **Static Modal:** Replaces the 3D inspection modal with a standard high-res image lightbox and specification sheet.
* **Interactions & Styling:**
  * Pure CSS document scrolling with high-contrast monochrome aesthetic (`bg-background text-text-primary`). Zero heavy WebGL overhead.