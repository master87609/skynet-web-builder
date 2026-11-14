# user-flows.md

```
# Skynet Autonomous Architecture — User & Conversion Flows
## Project: Artisanal Sourdough Bakery with Preorders (v1 MVP)

## Flow 1: The Conscious Foodie — High-Concurrency Flash Preorder & Checkout
*Objective: The user visits during a weekly product drop, secures a high-demand loaf before stock depletes, selects a pickup slot, and completes checkout in under 90 seconds.*

```
[User Lands on Homepage (/)] 
       │
       ▼ (Clicks "Shop Weekly Drop" or Drop Notification Email)
[Weekly Menu Hub (/menu)] 
       │
       ▼ (Applies Dietary Filter: "Organic" [FR-06])
[Filtered Menu View] 
       │
       ▼ (Clicks "Country Sourdough" Product Card)
[Product Detail View / Quick View Modal] 
       │
       ▼ (Views inventory counter: "Only 6 left for Friday!")
[Clicks "Add to Preorder Cart"]
       │
       ▼ (Cart Drawer Slides In / Navigates to /cart)
[Cart Review] ──(Optional: Adds 15% Tip)
       │
       ▼ (Clicks "Proceed to Checkout")
[Fulfillment Selection Step]
       │
       ├─► Selects "Local Pickup" 
       │         └── [Selects Available Date & Time Slot (e.g., Friday 4:00 PM - 5:00 PM)] [FR-01]
       │
       └─► Selects "Local Delivery" (Enters ZIP code -> Validated)
       │
       ▼ (Clicks "Continue to Payment")
[Checkout Screen (/checkout) [FR-03]]
       │
       ├─► Option A: Click "Express Apple Pay / Google Pay" (Bypasses manual form)
       └─► Option B: Enter Email, Name, and Credit Card details
       │
       ▼ (Clicks "Place Preorder")
[Payment Processing (Stripe/Square Secure Gateway)] [NFR-03]
       │
       ├─► [Failure / Slot Sold Out]: Display error modal ("Loaf just sold out! Inventory updated"), return to Cart.
       │
       ▼ [Success (Under 500 concurrent user load)] [NFR-01]
[Order Confirmation Page (/checkout/success?order_id=1042)] [FR-04]
       │
       ├─► Automated Trigger: System dispatches Email & SMS confirmation with calendar invite. [FR-04]
       └─► Prompt: "Create an account to save your favorite loaves?" (Optional password creation).
```

---

## Flow 2: The Local Pickup Coordinator — Fulfillment & Packing List Generation
*Objective: The staff member logs into the admin portal on a bake day to generate and execute packing lists categorized by pickup windows.*

```
[Admin / Staff Visits /admin/login]
       │
       ▼ (Authenticates secure credentials)
[Admin Dashboard Overview (/admin/overview)] [FR-05]
       │
       ▼ (Clicks "Fulfillment & Packing")
[Fulfillment Center (/admin/fulfillment)] [FR-05]
       │
       ▼ (Selects Date: "Current Bake Day" & View Mode: "By Time Slot")
[Generated Fulfillment Tally Sheet]
       │
       ├─► Views aggregated product totals (e.g., 42 Country Loaves, 18 Seeded Ryes total for the day).
       │
       ▼ (Selects Time Slot: "3:00 PM - 4:00 PM Window")
[Filtered Time-Slot Packing List]
       │
       ├─► Displays customer name, order items, special notes, and fulfillment status (Checkbox).
       │
       ▼ (Customer arrives at bakery storefront)
[Staff looks up customer name in interface]
       │
       ▼ (Hand-off verified)
[Clicks "Mark as Picked Up"] 
       │
       ▼ (System updates order status in real-time, logs timestamp)
[Order Closed in Database]
```

---

## Flow 3: The Artisan Baker / Owner — Weekly Menu Publishing & Capacity Slotting
*Objective: The bakery owner configures the upcoming week's baking schedule, sets capacity limits per loaf, and schedules the automated drop time.*

```
[Admin Logged into Dashboard (/admin/overview)]
       │
       ▼ (Navigates to Menu & Inventory)
[Menu Management Portal (/admin/menu)] [FR-01, FR-02]
       │
       ▼ (Clicks "Create New Weekly Drop")
[Product & Schedule Configuration Form]
       │
       ├─► Selects items from master product library (e.g., Country Loaf, Pain de Campagne)
       ├─► Sets pricing, descriptions, and fermentation metrics [FR-02]
       └─► Configures SKU-Level Daily Baking Capacities [FR-01]:
             - Friday Bake Capacity: 50 units (Allocated across slots)
             - Saturday Bake Capacity: 75 units (Allocated across slots)
       │
       ▼ (Sets Automated Drop Publish Timer)
[Schedule Drop: Thursday at 6:00 PM]
       │
       ▼ (Clicks "Publish Schedule / Save Draft")
[System Schedules Cron Job]
       │
       ▼ (When Thursday 6:00 PM hits)
[Website automatically transitions menu from "Coming Soon" to "Live"] [FR-02]
       │
       ▼ (System handles incoming high-concurrency reservation locks) [FR-01, NFR-01]
[Inventory decrements automatically per completed checkout; fully booked slots lock instantly]
```
```