# content/copy-review.md

# Skynet Editorial Audit & Copy Optimization Report

## Executive Summary
This audit reviews the current website copy against Apple’s gold-standard brand guidelines. While the existing implementation establishes a solid cinematic framework, several headings, micro-copy elements, and Call-to-Action (CTA) buttons suffer from generic tech-industry phrasing (e.g., "Buy Now", "Explore 3D Model"). 

Below is the optimized copy matrix designed to elevate the user experience from a high-end tech demo to a true visceral Apple brand journey.

---

## 1. Global Navigation & Header
*   **Current Link:** `Overview` | `3D Inspector` | `A19 Pro Silicon` | `Ecosystem` | `Tech Specs`
*   **Optimized Link:** `Overview` | `Design & 3D` | `A19 Pro` | `Ecosystem` | `Tech Specs`
*   **Rationale:** "3D Inspector" sounds like a developer tool. "Design & 3D" reframes the sandbox as a celebration of form and material.

---

## 2. Hero Section Optimization
*   **Current Headline:** *Titanium. So strong. So light. So Pro.* (Retained – benchmark Apple phrasing).
*   **Current Sub-headline:** *Forged in aerospace-grade titanium with the groundbreaking A19 Pro chip and a customizable Action button.*
*   **Optimized Sub-headline:** *Forged in aerospace-grade titanium. Driven by the uncompromising A19 Pro chip. Designed to change everything.*
*   **CTA Optimization:**
    *   *Primary Button:* Change from `Buy Now` $\rightarrow$ **`Configure Your Pro`**
    *   *Secondary Button:* Change from `Explore 3D Model` $\rightarrow$ **`Experience in 3D`**

---

## 3. Interactive Feature Section / 3D Inspector Sandbox
*   **Current Section Header:** *Precision Engineered. Inside & Out.*
*   **Optimized Section Header:** *Form meets physics.*
*   **Current Sub-headline:** *Inspect material finishes and explore the mechanical separation of internal components with real-time sliders.*
*   **Optimized Sub-headline:** *Rotate the chassis, examine the microblasted grain, and slide open the architectural layers of our most advanced pro device yet.*
*   **Control Panel Micro-Copy:**
    *   *Finish Label:* Change from `Switch between aerospace-grade titanium colorways.` $\rightarrow$ **`Select your finish.`**
    *   *Exploded View Label:* Change from `Manual mechanical separation of internal hardware modules.` $\rightarrow$ **`Exploded architectural view.`**

---

## 4. Silicon Architecture Section
*   **Current Section Header:** *A19 Pro. The chip that redefines limits.*
*   **Optimized Section Header:** *A19 Pro chip. A monumental leap for Pro graphics.*
*   **Current Sub-headline:** *Industry-leading 3nm architecture with hardware-accelerated ray tracing and breakthrough neural engine performance.*
*   **Optimized Sub-headline:** *Built on industry-first 3nm process technology. Blazing graphics, console-class gaming, and extraordinary battery efficiency.*

---

## 5. Summary of Recommended Copy Replacements (Code Snippets)

```html
<!-- Hero CTAs -->
<button onclick="openConfigurator()" class="...">
    <span>Configure Your Pro</span>
    <i data-lucide="chevron-right" class="w-4 h-4"></i>
</button>
<a href="#inspector" class="...">
    <span>Experience in 3D</span>
    <i data-lucide="box" class="w-4 h-4"></i>
</a>

<!-- 3D Inspector Header -->
<div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
    <p class="text-appleAccent text-sm uppercase tracking-wider font-semibold">Interactive Sandbox</p>
    <h2 class="text-3xl md:text-5xl font-bold tracking-tight">Form meets physics.</h2>
    <p class="text-appleGray text-base md:text-lg">Rotate the chassis, examine the microblasted grain, and slide open the architectural layers of our most advanced pro device yet.</p>
</div>
```