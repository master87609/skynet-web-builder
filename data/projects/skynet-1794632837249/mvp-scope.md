# Skynet MVP Scope & Feature Breakdown

To ensure a rapid time-to-market while guaranteeing rock-solid performance during high-concurrency drop events, the product features are strictly tiered between the Version 1 (v1) Release and Future Expansion.

## 1. Version 1 (v1) Release Scope
The v1 release focuses exclusively on core transactional stability, inventory atomicity, and essential kitchen fulfillment workflows.

### Customer-Facing Experience (Front-End)
* **Dynamic Menu & Batch Catalog (FR-02):** Responsive display of weekly sourdough items, rich imagery, ingredient profiles, allergen data, and pricing.
* **Preorder Scheduling & Visibility (FR-01):** Clear indication of baking dates and ordering cutoff times (e.g., "Order by Thursday 5 PM").
* **Timed Cart Locking (FR-03):** 10-minute temporary reservation of items during checkout to prevent inventory loss.
* **Slot-Based Pickup Selection (FR-04):** Interactive selection of available 30-minute pickup windows during checkout.
* **Instant Checkout & Confirmation (TC-02, FR-05):** Secure PCI-compliant payment gateway integration (Stripe/Apple Pay) paired with automated instant email confirmation.

### Baker / Admin Experience (Back-Office)
* **Batch & Inventory Caps (FR-01, FR-05):** Simple administrative interface to define daily product limits, baking dates, and hard cutoff timers.
* **Daily Fulfillment Dashboard (FR-06):** Secure, mobile/tablet-friendly dashboard aggregating daily orders into a clean, printable/exportable kitchen production sheet organized by pickup hours.
* **Automated Reminders (FR-05):** System-triggered customer SMS/email reminders sent 24 hours and 2 hours prior to pickup.

### Non-Functional Baseline (NFR)
* **High-Concurrency Performance (NFR-01):** Optimized for 500 concurrent checkout requests during weekly drops with sub-1.5s page loads.
* **Security & Reliability (NFR-02, NFR-04):** TLS 1.3 encryption, PCI compliance, and automated 4-hour database backups.

---

## 2. Future Expansion Scope (Post-v1 Roadmap)
Features deferred to v2 and beyond to maintain v1 velocity and focus on core bakery unit economics:

* **Recurring Bread Subscriptions:** Automated weekly/monthly subscription billing and recurring slot reservations for VIP members.
* **Local Delivery Routing:** Integration with third-party local courier APIs for home delivery route optimization based on postal codes.
* **Customer Loyalty & Rewards Program:** Points-based system for frequent buyers and referral bonuses.
* **Advanced Kitchen Analytics:** Historical sell-out data visualization to help bakers forecast flour and starter quantities more accurately over seasonal trends.
* **Multi-Location Support:** Ability to manage inventory, baking capacities, and pickup slots across multiple retail storefronts or farmers market stalls from a single admin login.