# Component Specifications
## Project: Artisanal Sourdough Bakery with Preorders (v1 MVP)

This document establishes the UI component specifications for Skynet's artisanal bakery platform. All components adhere strictly to the design tokens (warm linen background, roasted crust typography, golden wheat accents) and support high-concurrency preorder flows.

---

## 1. Global Navigation & Layout Components

### 1.1 Header
- **Anatomy:** 
  - Sticky top banner with glassmorphism or solid warm surface (`background.subtle`).
  - Brand Logo (Serif font "Skynet Bakehouse" with subtle wheat icon).
  - Main Navigation Links (`/menu`, `/story`, `/faq`).
  - Utility actions: Dietary Filter Toggle, User Account avatar/login, and Cart Drawer trigger with dynamic item counter badge.
- **States:** Default, Scrolled (adds subtle shadow), Active Drop (flashing golden accent indicator when drop window is live).
- **Accessibility:** Full keyboard tab-navigation; `aria-expanded` attributes on mobile drawer toggles.

### 1.2 Footer
- **Anatomy:** 
  - 4-column layout (Brand & Ethos, Quick Links, Customer Support, Legal & Compliance).
  - Bottom newsletter subscription bar with inline email input and instant success/error feedback state.
- **States:** Newsletter input empty, validating, success (green confirmation badge), error (inline validation message).

---

## 2. Menu & Product Components

### 2.1 Sticky Filter Bar (`/menu#filters`)
- **Anatomy:** 
  - Horizontal scrolling pill group for Dietary Filters (Vegan, Gluten-Conscious, Organic, Nut-Free) and Category Filters (Breads, Pastries, Pantry).
- **States:** Unselected (surface subtle, dark text), Selected (accent background, white text).
- **Behavior:** Instant client-side URL hash update and filter execution without page reload.

### 2.2 Product Card (Grid View)
- **Anatomy:**
  - High-res product imagery with rounded corners (`borderRadius.lg`).
  - Inventory Countdown Badge overlay (`"Only 4 left for Friday bake!"`).
  - Product Title (Lora Serif, 1.25rem), Short description, Price (`$12.00`).
  - Quick action button: "Add to Preorder" or "Sold Out" (disabled, muted tone).
- **States:** Available, Low Stock (< 5 units remaining, amber badge), Sold Out (grayscale image overlay, disabled button).

### 2.3 Product Detail Modal / Quick View (`/menu/[product-slug]`)
- **Anatomy:**
  - Split view: Image gallery left, detailed specs right.
  - Fermentation metrics pill ("36hr Ferment • 82% Hydration • Open Crumb").
  - Ingredient traceability note ("Milled locally at Central Milling Co.").
  - Quantity selector stepper (`-` `1` `+`).
  - Primary CTA: "Secure Preorder — $14.00".
- **States:** Loading, Ready, Inventory Depleted (triggers inline alert banner).

---

## 3. Cart & Checkout Flow Components

### 3.1 Cart Review Drawer (`/cart`)
- **Anatomy:**
  - Slide-over panel from right with backdrop blur.
  - Item list with thumbnail, title, selected pickup date, qty adjuster, and remove icon.
  - Tip Selection Tier buttons (`10%`, `15%`, `20%`, `Custom`).
  - Subtotal, Tax, Total calculation summary.
  - Sticky bottom action: "Proceed to Checkout".
- **States:** Empty Cart (friendly sourdough pun + "Browse Weekly Drop" button), Populated Cart.

### 3.2 Fulfillment Selector Component
- **Anatomy:**
  - Tab toggle: **[ Local Pickup ]** vs. **[ Local Delivery ]**.
  - *Pickup View:* Date picker calendar + time slot radio cards (e.g., `3:00 PM - 4:00 PM (8 slots left)`).
  - *Delivery View:* ZIP code input field with real-time zone validation message (`"Delivery available in your area!"`).
- **States:** Unselected, Slot Selected, Slot Sold Out (disables radio and prompts user to select alternate window).

### 3.3 Express Checkout & Payment Form (`/checkout`)
- **Anatomy:**
  - Express checkout bar: Apple Pay / Google Pay instant buttons.
  - Divider: "Or pay with credit card".
  - Secure Stripe/Square form inputs: Email, Full Name, Card Number, Expiry, CVC.
  - Submit Button: "Place Preorder — $38.50" with secure lock icon.
- **States:** Idle, Processing (spinner state with disabled inputs to prevent double-click race conditions), Payment Success, Payment Error (inline card decline message).

---

## 4. Administrative & Staff Components (`/admin`)

### 4.1 Admin Overview Dashboard Tally Sheet (`/admin/overview`)
- **Anatomy:**
  - Metric summary cards (Total Revenue, Active Preorders, High-Concurrency Drop Load status).
  - Real-time daily preorder tally sheet broken down by SKU.
- **States:** Live polling active (green pulse indicator), Offline warning banner.

### 4.2 Fulfillment Time-Slot Packing List (`/admin/fulfillment`)
- **Anatomy:**
  - Filterable table by Bake Date and Time Window.
  - Columns: Customer Name, Order ID, Items Ordered, Special Notes, Fulfillment Checkbox.
  - Bulk action buttons: "Print Packing Sheet", "Export CSV".
- **States:** Unfulfilled (default), Picked Up / Fulfilled (strikethrough row, muted background, recorded timestamp).