# sitemap.md

```
# Skynet Autonomous Architecture — Sitemap & Information Architecture
## Project: Artisanal Sourdough Bakery with Preorders (v1 MVP)

## 1. Global Navigation Architecture

### Header (Global)
- **Brand / Logo:** Links to Homepage (`/`)
- **Main Navigation Links:**
  - `[Primary CTA]` Weekly Menu / Preorder (`/menu`)
  - Our Story (`/story`)
  - Baking Schedule & FAQ (`/faq`)
- **Utility Actions:**
  - Dietary Filter Toggle (`/menu#filters`)
  - User Account / Login (`/account`)
  - Cart / Preorder Drawer (`/cart`) [Dynamic item counter badge]

### Footer (Global)
- **Column 1: Brand & Ethos**
  - Mission statement & organic flour sourcing note
  - Copyright & Legal
- **Column 2: Quick Links**
  - Weekly Drop Menu (`/menu`)
  - Pickup Locations & Hours (`/faq#pickup`)
  - Our Story (`/story`)
- **Column 3: Customer Support**
  - FAQs (`/faq`)
  - Contact Us (`/contact`)
  - Dietary & Allergen Information (`/allergens`)
- **Column 4: Legal & Compliance**
  - Privacy Policy (`/legal/privacy`)
  - Terms of Service (`/legal/terms`)
  - Accessibility Statement (`/legal/accessibility`)
- **Newsletter Subscription:** Email input with instant success/error feedback state.

---

## 2. Complete Hierarchical Sitemap

```
1.0 Homepage (/)
├── Hero Section: Active Drop Timer / "Next Drop Live" CTA
├── Featured Loaves Carousel (Dynamic state: Available / Sold Out)
├── Brand Value Proposition (Fermentation process, organic grains)
└── Recent Instagram / Community Feed

2.0 Weekly Menu & Preorder Hub (/menu) [FR-02, FR-06]
├── 2.1 Filter Bar (Sticky)
│   ├── Dietary Filter (Vegan, Gluten-Conscious, Organic, Nut-Free)
│   └── Category Filter (Breads, Pastries, Pantry/Ferments)
├── 2.2 Product Detail Modal / Quick View
│   ├── Loaf Details (Fermentation time, hydration %, crumb profile)
│   ├── Ingredient Traceability (Local mill source)
│   └── Inventory Countdown Badge ("Only 4 left for Friday bake!")
└── 2.3 Product Detail Page (PDP) (/menu/[product-slug])

3.0 Cart & Preorder Flow (/cart) [FR-01, FR-03]
├── 3.1 Cart Review Drawer / Full Page
│   ├── Item Modification (Qty adjustment, remove)
│   └── Tip Selection (Optional gratuity tiers)
├── 3.2 Fulfillment Selector
│   ├── Pickup (Select Date & Time Slot from available capacities) [FR-01]
│   └── Local Delivery (Address input & zone validation)
└── 3.3 Express Checkout (/checkout) [FR-03]
    ├── Guest vs. Account Sign-in Prompt
    ├── Contact Information
    ├── Secure Payment Gateway (Stripe/Square: Apple Pay, Google Pay, CC) [NFR-03]
    └── Order Confirmation Success Screen (/checkout/success?order_id=XYZ) [FR-04]

4.0 Educational & Informational Pages
├── 4.1 Our Story (/story)
│   ├── The Baker's Journey & Philosophy
│   └── Sourdough Starter Heritage & Milling Process
├── 4.2 FAQ & Logistics (/faq)
│   ├── Pickup Instructions & Window Guidelines
│   ├── Storage & Reheating Tips
│   └── Cancellation / Modification Policy
├── 4.3 Dietary & Allergen Notice (/allergens) [FR-06]
│   └── Facility cross-contamination disclosures
└── 4.4 Contact Us (/contact)
    └── Inquiry Form (Wholesale, custom orders, general questions)

5.0 Customer Account Portal (/account) [FR-03]
├── 5.1 Dashboard (/account/overview)
│   ├── Upcoming Preorders & Pickup Reminders
│   └── Quick Reorder from Past Purchases
├── 5.2 Order History (/account/orders)
│   └── Past Invoices & Receipt Downloads
└── 5.3 Profile & Settings (/account/settings)
    └── Saved Addresses, Payment Methods, and Communication Preferences (Email/SMS toggle)

6.0 Administrative Dashboard (/admin) [Admin Persona] [FR-01, FR-05]
├── 6.1 Dashboard Home (/admin/overview)
│   ├── Real-time daily preorder tally sheet & sales totals
│   └── Quick status of high-concurrency drop metrics
├── 6.2 Menu & Inventory Management (/admin/menu) [FR-01, FR-02]
│   ├── Create/Edit Weekly Product Drops
│   └── Configure SKU-level daily baking capacities & slot limits
├── 6.3 Fulfillment & Packing Center (/admin/fulfillment) [Fulfillment Persona] [FR-05]
│   ├── Filterable, printable packing lists by date and pickup window
│   └── Mark orders as Fulfilled / Picked Up
└── 6.4 Customer & Order Operations (/admin/orders) [FR-05]
    └── Manual order modification, cancellation, and refund processing
```

---

## 3. Redirects & Edge Routes
- `/drop` -> Direct 302 temporary redirect to `/menu` during active drop windows.
- `/admin/*` -> Protected routes requiring authenticated Admin role session.
- `/account/*` -> Protected routes requiring customer authentication token.
- `*` (404 Not Found) -> Custom error page featuring a search bar, navigation back to `/menu`, and a playful sourdough pun.
```