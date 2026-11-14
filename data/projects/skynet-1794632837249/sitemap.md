# Skynet Information Architecture & Sitemap: Artisanal Sourdough Bakery

This document outlines the complete information architecture and hierarchical sitemap for the digital flagship of the artisanal sourdough bakery. It is designed to support high-concurrency drop events, transparent inventory limits, and seamless slot-based preordering.

## 1. Global Navigation Architecture

### Header (Persistent Across All Views)
*   **Brand Logo:** Returns to Homepage (`/`)
*   **Primary Navigation Links:**
    *   This Week's Menu (`/menu`)
    *   Our Craft & Philosophy (`/craft`)
    *   Baking Schedule & Cutoffs (`/schedule`)
    *   FAQ & Pickup Info (`/faq`)
*   **Utility Actions:**
    *   Account / Order History (`/account`)
    *   Cart Drawer Trigger (`/cart` - Dynamic Overlay with 10-Min Countdown Timer)

### Footer
*   **Column 1: Brand & Location**
    *   Physical Bakery Address & Hours
    *   Contact Email / Phone
*   **Column 2: Quick Links**
    *   Weekly Menu (`/menu`)
    *   Pickup Guidelines (`/faq#pickup`)
    *   Allergen & Ingredient Transparency (`/craft#ingredients`)
*   **Column 3: Legal & Compliance**
    *   Privacy Policy (`/privacy`)
    *   Terms of Service (`/terms`)
    *   Accessibility Statement (`/accessibility`)
*   **Column 4: Newsletter / Drop Alerts**
    *   SMS/Email Drop Alert Signup Form

---

## 2. Comprehensive Hierarchical Sitemap

```text
/ (Homepage)
│
├── /menu (This Week's Batch Catalog)
│   ├── /menu/[product-id] (Product Detail Page)
│   │   ├── Description & Story
│   │   ├── Ingredient Profile & Hydration Metrics
│   │   ├── Allergen Warnings
│   │   └── Direct "Add to Active Batch" Action
│   │
│   └── /cart (Active Cart & 10-Minute Lock Modal Overlay)
│       └── /checkout (Frictionless Secure Checkout)
│           ├── /checkout/slots (Slot-Based Pickup Selection)
│           ├── /checkout/payment (Stripe / Apple Pay Processing)
│           └── /checkout/success (Order Confirmation & Receipt)
│
├── /schedule (Baking Schedule & Cutoff Timers)
│   ├── Upcoming Drop Countdowns
│   └── Weekly Baking Calendar (Order-by Deadlines)
│
├── /craft (Our Craft & Philosophy)
│   ├── Wild Fermentation & Sourdough Process
│   ├── Organic Miller Partnerships
│   └── Ingredient Transparency Matrix
│
├── /faq (Frequently Asked Questions & Policies)
│   ├── Pickup Logistics & Parking Instructions
│   ├── Reheating & Storage Guidelines
│   └── Refund / Modification Policies
│
├── /account (Customer Portal)
│   ├── /account/orders (Active Preorders & Past History)
│   ├── /account/profile (Saved Addresses & Payment Methods)
│   └── /account/notifications (SMS/Email Reminder Preferences)
│
└── /admin (Baker / Operations Back-Office - Secure Authentication Required)
    ├── /admin/dashboard (Real-Time Overview & Quick Metrics)
    ├── /admin/batch-manager (FR-01: Batch Definition & Inventory Caps)
    │   ├── Create/Edit Baking Date
    │   ├── Set Order Cutoff Timers
    │   └── Configure Item-Level Limits
    ├── /admin/fulfillment (FR-06: Daily Production & Pickup Dashboard)
    │   ├── Hourly Pickup Breakdown View
    │   ├── Printable/Exportable Kitchen Sheet
    │   └── Customer Order Status Toggles
    └── /admin/settings (Store Operational Hours & Location Rules)
```

---

## 3. Sitemap Node Specifications

### Customer-Facing Nodes
*   **`/` (Homepage):** High-impact visual gateway featuring the current week's marquee loaf, countdown timer to the next drop, direct CTA to "Reserve Your Loaf," and brief brand ethos.
*   **`/menu` (Catalog):** Dynamic grid displaying active batch items. Automatically grays out or marks items as "Sold Out" in real time based on database inventory locks.
*   **`/menu/[product-id]` (PDP):** Deep dive into the specific bake. Features hydration percentage, fermentation length (e.g., "36-hour cold proof"), flour provenance, and specific allergen callouts.
*   **`/checkout` (Transaction Engine):** Single-page streamlined checkout designed to minimize drop-off. Integrates strict cart expiration timers and slot reservations.

### Administrative Back-Office Nodes (`/admin`)
*   **`/admin/batch-manager`:** The command center for the master baker. Allows rapid definition of stock limits (preventing overselling during peak traffic) and setting hard cutoff rules (e.g., Thursday 5 PM).
*   **`/admin/fulfillment`:** Optimized for tablet and mobile viewports in the early morning kitchen. Aggregates orders into clean, printable categories sorted by pickup hour so bakers can stage orders effortlessly.