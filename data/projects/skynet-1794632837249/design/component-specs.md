# Skynet Component Specifications: Artisanal Sourdough Bakery

This document outlines the detailed user interface specifications for building the Skynet digital flagship. All components adhere strictly to WCAG 2.1 AA accessibility standards, mobile-first responsiveness, and the warm, tactile aesthetic of an artisanal bakery.

---

## 1. Global Navigation & Layout Components

### 1.1 Header (`Header`)
* **Purpose:** Persistent top navigation providing brand reentry, core educational/catalog links, account access, and the cart drawer trigger.
* **Anatomy:**
    * **Brand Logo:** High-contrast typographic or emblem mark returning to `/`.
    * **Primary Nav Links:** `/menu`, `/craft`, `/schedule`, `/faq`.
    * **Utility Group:** Account icon/link (`/account`) and Cart Drawer Trigger with an inline item count badge and active countdown state indicator.
* **Behavior:** Sticky on scroll with a subtle bottom border when scrolled past 20px. Mobile view collapses navigation into a full-screen accessible slide-out menu.

### 1.2 Cart Drawer & Countdown Timer (`CartDrawer`)
* **Purpose:** Slide-over overlay displaying active cart items, subtotal, and the critical **10-minute inventory reservation countdown timer (FR-03)**.
* **Anatomy:**
    * **Header:** "Your Batch Reservation" + Close button (`X`).
    * **Timer Banner:** High-visibility pulsing pill component displaying MM:SS countdown. Turns warm amber (`#C86D39`) with text warning under 2 minutes.
    * **Line Items:** Thumbnail, Title, Selected Pickup Slot summary, Quantity controller (restricted for limited drops), Price, Remove action.
    * **Footer:** Subtotal calculation and primary CTA: "Proceed to Secure Checkout" (`/checkout`).
* **Behavior:** Opens automatically when an item is added to cart. If the timer hits `00:00`, triggers an inline modal state notifying the user that reserved stock has been released back to the general pool, clearing local cart state.

---

## 2. Customer-Facing Components

### 2.1 Hero Drop Banner (`HeroDropBanner`)
* **Purpose:** High-impact visual gateway on the Homepage (`/`) driving immediate conversion for limited drops.
* **Anatomy:**
    * **Editorial Background Imagery:** Rich, tactile full-bleed photography of crust texture and crumb structure.
    * **Typography:** Serif headline setting drop urgency (e.g., *"Saturday’s Loaves are Live"*).
    * **Drop Countdown / Status:** Live countdown clock to the next batch release or closing window.
    * **Primary Action:** Direct CTA button ("Reserve Your Loaf" -> `/menu`).

### 2.2 Product Grid & Batch Card (`BatchProductCard`)
* **Purpose:** Catalog display cards on `/menu` representing limited-batch items with real-time availability states.
* **Anatomy:**
    * **Visual Frame:** High-contrast product photography with hover zoom.
    * **Status Badge:** Dynamic state pill: "Available" (Green/Surface), "Low Stock" (Amber), or "Sold Out" (Grayed out).
    * **Metadata Block:** Product title, short flavor profile, and price.
    * **Action Button:** "Add to Active Batch" (Disabled and styled as "Sold Out" when inventory locks reach zero).

### 2.3 Product Detail View (`ProductDetail`)
* **Purpose:** Deep dive into product provenance on `/menu/[product-id]`.
* **Anatomy:**
    * **Technical Specs Grid:** Hydration Percentage (e.g., *82% Hydration*), Fermentation Length (*36-hour cold proof*), and Miller Partnership.
    * **Allergen Notice Box:** Clear, bordered callout noting gluten, flour origins, and facility details.
    * **Action Bar:** Quantity selector and prominent sticky "Add to Batch" action.

### 2.4 Slot Selector Component (`PickupSlotSelector`)
* **Purpose:** Frictionless time-window selection during checkout (`/checkout/slots` per **FR-04**).
* **Anatomy:**
    * **Date Header:** Selected baking date (e.g., *Saturday, October 14th*).
    * **Slot Grid:** Interactive radio-card group listing 30-minute availability windows (e.g., *08:00 AM – 08:30 AM*).
    * **Capacity Feedback:** Real-time helper text on cards showing remaining slot capacity (e.g., *"3 slots remaining"*). Fully booked slots are dimmed and unselectable.

---

## 3. Administrative Back-Office Components (`/admin`)

### 3.1 Batch Manager Table (`BatchManagerTable`)
* **Purpose:** Command center interface for the master baker to configure inventory limits and cutoffs (**FR-01**).
* **Anatomy:**
    * **Date & Status Control:** Toggle switches for publishing or locking specific baking dates.
    * **Inline Editable Data Grid:**
        * Loaf Variant Name
        * Hard Inventory Cap (Numeric input with immediate validation)
        * Current Reservations Count
        * Order Cutoff Timestamp Picker (e.g., *Thursday 17:00*)
    * **Bulk Action Bar:** "Save & Publish Batch" with instant database sync feedback.

### 3.2 Kitchen Fulfillment Dashboard (`FulfillmentDashboard`)
* **Purpose:** Tablet-optimized operations view for early morning kitchen staff (**FR-06**).
* **Anatomy:**
    * **Time Filter Bar:** Quick-tap pill filters for pickup hours (e.g., `All`, `08:00 AM`, `08:30 AM`).
    * **Order Fulfillment Card List:**
        * Order Reference Number & Customer Name
        * Grouped Item Breakdown (e.g., *2x Country Sourdough, 1x Seeded Rye*)
        * Pickup Window Time Badge
        * **Interactive Status Toggles:** Checkbox / Swipe action for "Staged / Ready" and "Collected".
    * **Export Action:** "Print Kitchen Production Sheet" formatted for thermal or letter-size kitchen printers with high contrast.