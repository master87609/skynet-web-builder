content/copy-review.md

# Editorial Audit & Copy Optimization Report

## Executive Summary
An editorial review of the current upstream codebase (`code/index.html`) reveals a strong visual foundation utilizing Tailwind CSS, Playfair Display, and Inter. However, the existing copy contains generic placeholder phrases, weak micro-copy, and inconsistent calls to action (CTAs) that fail to match the sophisticated "Editorial Luxury" brand voice required for Skynet Apparel Hub.

This audit details line-by-line optimizations across the navigation, hero section, cart drawer, and user touchpoints to maximize conversion rates and brand cohesion.

---

## Detailed Copy Audit & Recommendations

### 1. Header & Navigation (Desktop & Mobile)
*   **Current State:** Standard navigational links (*Women, Men, New Arrivals, Sale, Admin Portal*).
*   **Critique:** Adequate, but lacks editorial polish. "Admin Portal" is too utilitarian for high-end consumer views.
*   **Recommendation:**
    *   Change navigation labels to reflect curated collections: *Women* $\rightarrow$ **Curated Women**, *Men* $\rightarrow$ **Tailored Men**.
    *   Change "Admin Portal" $\rightarrow$ **Store Control Center** (hidden or styled discreetly for backend management).
    *   *Search Placeholder:* Change `"Search jackets, dresses, shoes..."` $\rightarrow$ `"Search silk evening wear, cashmere blazers..."`

### 2. Hero Section
*   **Current State:** 
    *   *Headline:* "Redefining Contemporary Elegance" (Strong, keep).
    *   *Subheadline:* "Immaculately tailored garments engineered for the modern aesthetic. Discover sustainable luxury delivered instantly."
    *   *CTAs:* "Explore Collection" / "New Arrivals"
*   **Critique:** The subheadline uses the word "instantly," which leans too heavily into fast-fashion logistics rather than curated luxury. 
*   **Recommendation:**
    *   **Optimized Subheadline:** *"Immaculately structured garments engineered for the modern aesthetic. Discover conscious luxury delivered with precision."*
    *   **Optimized Primary CTA:** *"Explore AW25 Collection"* (Adds seasonal urgency).
    *   **Optimized Secondary CTA:** *"Discover New Arrivals"*

### 3. Slide-out Cart Drawer & Checkout Flow
*   **Current State:** 
    *   *Header:* "Your Shopping Bag (2)"
    *   *Promo Input:* `placeholder="Promo code (e.g. SKYNET10)"`
    *   *Main CTA:* "Proceed to Secure Checkout"
    *   *Express Pay:* "Pay with Apple Pay"
*   **Critique:** Good foundation, but lacks the luxury tactile feel. The promo code example exposes internal test codes.
*   **Recommendation:**
    *   **Optimized Cart Header:** *"Your Curated Bag (2)"*
    *   **Optimized Promo Input:** `placeholder="Enter private invitation or promo code"`
    *   *Micro-copy addition below Subtotal:* *"Complimentary global shipping & signature packaging included."*
    *   **Optimized Checkout CTA:** *"Proceed to Secure Encrypted Checkout"*

### 4. Category & Product Grid Micro-Copy
*   **Current State:** Subtitles read `"Dresses, Outerwear, Knitwear"`.
*   **Recommendation:** Elevate descriptor sub-texts to sound more tactile and architectural:
    *   Women's Category: *"Fluid Silhouettes, Outerwear & Cashmere"*
    *   Men's Category: *"Architectural Suiting, Blazers & Premium Denim"*
    *   Accessories: *"Leather Goods, Silk Scarves & Hardware"*

---

## Implementation Checklist for Developers

1. [ ] **Update Index.html Hero Copy:** Replace subheadline text with the revised conscious luxury phrasing.
2. [ ] **Refine Search Bar Placeholder:** Switch generic item list to luxury apparel terms (`silk evening wear`, `cashmere blazers`).
3. [ ] **Enhance Cart Drawer Footer:** Add the complimentary packaging micro-copy and update the checkout button text to emphasize encryption/security.
4. [ ] **Standardize Button Hover States:** Ensure all luxury gold accent (`#C5A059`) buttons maintain high contrast text for WCAG 2.1 Level AA compliance.