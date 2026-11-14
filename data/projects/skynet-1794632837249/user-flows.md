# Skynet User Flows & Navigation Sequences

This document maps the step-by-step conversion and navigation flows for both the conscious foodie (customer) and the master baker (operations manager), ensuring frictionless execution during high-concurrency drop events.

---

## Flow 1: The High-Concurrency Drop & Preorder Conversion Flow (Customer)
*Goal: Allow the Conscious Foodie to rapidly browse, lock inventory, select a pickup slot, and complete checkout within the 10-minute cart reservation window.*

```text
[Landing: Homepage / Drop Alert SMS Link] 
    │
    ▼
[View /menu (Batch Catalog)] ──(Item Sold Out?)──> [Join Drop Waitlist / SMS Alert]
    │
    ├── (Item Available)
    ▼
[View /menu/[product-id] (Product Details)]
    │
    ▼
[Click "Add to Batch" / Reserve Loaf]
    │
    ▼
[Cart Drawer Opens + 10-Minute Countdown Timer Initiated (FR-03)]
    │
    ▼
[Click "Proceed to Secure Checkout"]
    │
    ▼
[Step 1: Select Slot-Based Pickup Window (FR-04)] 
*(Choose 30-min window from available capacity)*
    │
    ▼
[Step 2: Enter Contact & Payment Information] 
*(Apple Pay / Saved Stripe Token for instant capture)*
    │
    ▼
[Click "Authorize & Confirm Preorder"]
    │
    ├── (Payment Failed / Timer Expired) ──> [Return to Cart / Inventory Released]
    │
    └── (Payment Successful)
        │
        ▼
[Redirect to /checkout/success (Order Confirmation)]
    │
    ▼
[Automated Trigger: Instant Confirmation Email Sent (FR-05)]
    │
    ▼
[Background Automated Triggers (FR-05)]
    ├── 24 Hours Before Pickup: Reminder Email / SMS sent with location/parking info
    └── 2 Hours Before Pickup: Final SMS reminder sent
```

---

## Flow 2: The Morning Kitchen Fulfillment & Batch Management Flow (Master Baker / Admin)
*Goal: Enable the time-poor artisan baker to review daily production requirements and manage inventory caps quickly from a mobile or tablet device.*

```text
[Access Secure Admin Login (/admin)]
    │
    ▼
[Authentication Check (TLS 1.3 / Secure Session)]
    │
    ▼
[Land on /admin/dashboard (Real-time overview)]
    │
    ├── Path A: Update Inventory / Baking Schedule (FR-01)
    │   ├── Navigate to [/admin/batch-manager]
    │   ├── Select Baking Date (e.g., Saturday Drop)
    │   ├── Adjust Hard Inventory Caps per Loaf (prevent over-selling)
    │   ├── Set Order Cutoff Time (e.g., Thursday 5:00 PM)
    │   └── Save & Publish (Instant database sync)
    │
    └── Path B: Kitchen Operations & Fulfillment (FR-06)
        ├── Navigate to [/admin/fulfillment]
        ├── View Daily Production Sheet (Categorized by product type & pickup hour)
        ├── Filter by Pickup Window (e.g., 8:00 AM – 8:30 AM)
        ├── Print or Export Kitchen Sheet for Packaging Station
        └── Mark Orders as "Staged / Ready" or "Collected" in Real Time
```

---

## Flow 3: Cart Expiration & Inventory Recovery Flow (System Architecture)
*Goal: Handle high-concurrency race conditions during Saturday morning bread releases without deadlocking the database.*

```text
[User adds limited-batch item to cart]
    │
    ▼
[Database executes Atomic Lock on 1 unit of Item X for Session ID]
    │
    ▼
[10-Minute Countdown Timer displayed prominently in Cart Drawer]
    │
    ├── Scenario A: User completes checkout within 10 minutes
    │   └── Inventory lock is permanently converted to a confirmed Order record.
    │
    └── Scenario B: Timer expires (10 minutes elapsed without payment)
        ├── Cart session times out
        ├── Database releases atomic lock on Item X
        └── Inventory automatically returns to public pool on /menu catalog in real time
```