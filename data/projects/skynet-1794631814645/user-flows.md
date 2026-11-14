# user-flows.md

# Skynet User Flows & Navigation Sequences: Project Sole-Motion
**Author:** Principal UX Architect, Skynet  
**Project:** Cinematic Shoe Web Experience (v1 MVP)

---

## 1. Flow Overview
This document outlines the critical conversion and navigation pathways for Project Sole-Motion, mapping out how users across different intent profiles (Alex the Sneakerhead, Elena the Design Enthusiast, Marcus the Impulse Shopper) navigate the scrollytelling experience and reach conversion.

---

## 2. Core User Flows

### Flow 1: The Impulse Shopper Conversion Flow (Marcus, 28)
*Goal:* Instantly grasp product appeal, select size, and complete purchase with minimum friction via Express Checkout.

```text
[Landing: Root /] 
    │
    ▼
[Viewport Auto-Loads: Chapter 01 (Hero)] 
    │
    ├── (Sees immediate "Pre-Order" sticky button in Global Header)
    │
    ▼
[User Scrolls Rapidly past Chapters 02 & 03] 
    │
    ▼
[Arrival at Chapter 05: Conversion Hub]
    │
    ▼
[Clicks Size Selector Dropdown (e.g., US 10.5)]
    │
    ▼
[Clicks "Pre-Order Now / Apple Pay" CTA]
    │
    ▼
[Slide-Out Checkout Drawer Overlays Viewport]
    │
    ▼
[Authenticates via Apple Pay / Stripe One-Tap]
    │
    ▼
[Order Confirmation State Rendered inside Drawer] -> [Exit]
```

---

### Flow 2: The Sneakerhead Material Deep-Dive (Alex, 24)
*Goal:* Inspect construction, understand material tech, customize colorway, and purchase.

```text
[Landing: Root /]
    │
    ▼
[Slows Scroll at Chapter 02: Material Anatomy]
    │
    ├── (3D Shoe automatically triggers 3-stage exploded parts view)
    │
    ▼
[Clicks Hotspot 01: "Knit Upper"] 
    │
    ▼
[Modal Overlay Opens: Reads specs on recycled monofilament knit]
    │
    ├── [Closes Modal]
    │
    ▼
[Clicks Hotspot 02: "Carbon Fiber Plate"] 
    │
    ▼
[Modal Overlay Opens: Reads specs on energy return]
    │
    ├── [Closes Modal]
    │
    ▼
[Scrolls to Chapter 04: Colorway Customizer]
    │
    ▼
[Taps Swatch: "Stealth Black"] 
    │
    ├── (3D Shader updates instantly in real-time)
    │
    ▼
[Scrolls to Chapter 05 -> Triggers Checkout Drawer] -> [Completes Purchase] -> [Exit]
```

---

### Flow 3: The Accessibility / Low-Motion User Flow (NFR-04)
*Goal:* Experience product information and complete purchase without triggering heavy motion sickness or lag from 3D animations.

```text
[Landing: Root /]
    │
    ▼
[System detects user OS-level "Reduce Motion" preference OR User clicks Global A11y Toggle]
    │
    ▼
[System Bypasses GSAP ScrollTrigger & Three.js Canvas Initialization]
    │
    ▼
[Fallback Render Active: Static, high-resolution WebP image sequence presentation]
    │
    ▼
[User reads accessible vertical layout with high-contrast typography]
    │
    ▼
[User reaches Static Checkout Section -> Selects Size -> Purchases via Standard Form/Apple Pay] -> [Exit]
```

---

## 3. Interaction State Matrix

| UI Component | Trigger Event | System Response |
| :--- | :--- | :--- |
| **Global Header Logo** | Click / Tap | Smooth scroll animation returns viewport to Chapter 01 (Top). |
| **Colorway Swatch** | Click / Tap | Triggers Three.js material texture swap; updates active state on swatch UI. |
| **Hotspot Anchor** | Hover / Click | Pauses scroll scrub; anchors HTML tooltip modal over 3D coordinate space. |
| **Reduce Motion Toggle** | Click / Tap | Unmounts R3F canvas; mounts WebP image sequence fallback component; disables GSAP pin timelines. |
| **"Pre-Order" Button** | Click / Tap | Slides in E-Commerce Checkout Drawer from right side of viewport with backdrop blur. |