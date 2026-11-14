# mvp-scope.md

## 1. Version 1 (v1) Release — The Core Preorder Engine
The v1 release focuses on solving the primary pain points of limited-batch artisanal drops: eliminating overselling, enabling high-concurrency flash checkouts, and streamlining pickup fulfillment.

### Core Features (v1)
- **Dynamic Menu & Drop Scheduling (FR-02):**
  - CMS/Admin interface to publish rotating weekly menus with descriptions, fermentation times, and pricing.
  - "Coming Soon" state for upcoming items prior to drop time.
- **Slot-Based Preorder & Real-Time Inventory (FR-01, FR-02):**
  - SKU-level daily capacity limits configured by the admin.
  - Real-time inventory counter showing remaining stock.
  - Date and time slot selection for local pickup; automatic locking of fully booked slots.
- **Streamlined Express Checkout (FR-03):**
  - Guest checkout and registered account creation.
  - Integration with Stripe/Square supporting Apple Pay, Google Pay, and standard credit cards.
  - Tip addition and local pickup/delivery preference selection.
- **Automated Notifications (FR-04):**
  - Instant email and SMS order confirmations upon successful checkout.
  - Automated 24-hour pickup reminder alerts.
- **Admin Dashboard & Fulfillment Tools (FR-05):**
  - Dashboard displaying daily preorder tally sheets.
  - Filterable, printable packing lists categorized by pickup window for the Local Pickup Coordinator.
  - Basic manual order modification capabilities.
- **Dietary Filtering (FR-06):**
  - Basic tag-based filtering for vegan, organic, and gluten-conscious attributes.

---

## 2. Future Expansion (v2 & Beyond) — Scaling & Advanced Community Features
Future iterations will focus on customer lifetime value expansion, recurring revenue models, and advanced analytics for business forecasting.

### Future Features (v2+)
- **Subscription & Membership Models:**
  - Automated recurring billing for "Loaf of the Month" clubs and weekly subscription tier scheduling.
- **Advanced Analytics & Business Intelligence (FR-07):**
  - Deep trend visualization dashboard tracking seasonal sales curves, popular crumb profiles, and grain usage forecasting to aid baking batch sizing.
- **Multi-Location & Delivery Routing:**
  - Support for multiple pickup storefronts or automated third-party local delivery route optimization.
- **Customer Loyalty & Rewards Program:**
  - Points-based system for frequent buyers, referral bonuses, and digital gift cards.
- **Enhanced Allergen & Ingredient Traceability:**
  - Interactive maps and deeper supply chain transparency logs linking specific flour batches to local farms.